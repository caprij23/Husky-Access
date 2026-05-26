import { WHEELCHAIR_ROUTES, LIMITED_MOBILITY_ROUTES, AccessibleRoute } from '../constants/accessibleRoutes';

export interface LatLon { latitude: number; longitude: number; }

// ── Haversine distance (metres) ────────────────────────────────────────────
export function haversine(a: LatLon, b: LatLon): number {
  const R = 6_371_000;
  const dLat = (b.latitude  - a.latitude)  * (Math.PI / 180);
  const dLon = (b.longitude - a.longitude) * (Math.PI / 180);
  const lat1 = a.latitude  * (Math.PI / 180);
  const lat2 = b.latitude  * (Math.PI / 180);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// ── Internal graph types ───────────────────────────────────────────────────
interface Vertex { lat: number; lon: number; }
interface Edge   { to: number; dist: number; }
interface Graph  { vertices: Vertex[]; adj: Edge[][]; }

// ── Min-heap (A* open set) ─────────────────────────────────────────────────
class MinHeap {
  private d: { id: number; f: number }[] = [];
  push(item: { id: number; f: number }) {
    this.d.push(item);
    let i = this.d.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.d[p].f <= this.d[i].f) break;
      [this.d[p], this.d[i]] = [this.d[i], this.d[p]];
      i = p;
    }
  }
  pop(): { id: number; f: number } | undefined {
    if (!this.d.length) return undefined;
    const top  = this.d[0];
    const last = this.d.pop()!;
    if (this.d.length) {
      this.d[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let s = i;
        if (l < this.d.length && this.d[l].f < this.d[s].f) s = l;
        if (r < this.d.length && this.d[r].f < this.d[s].f) s = r;
        if (s === i) break;
        [this.d[s], this.d[i]] = [this.d[i], this.d[s]];
        i = s;
      }
    }
    return top;
  }
  get size() { return this.d.length; }
}

// ── Build adjacency graph from route polylines ─────────────────────────────
function buildGraph(routes: AccessibleRoute[]): Graph {
  const vertices: Vertex[] = [];
  const intraEdges: [number, number][] = [];

  for (const route of routes) {
    const base = vertices.length;
    for (const c of route.coords) {
      vertices.push({ lat: c.latitude, lon: c.longitude });
    }
    for (let i = base; i < vertices.length - 1; i++) {
      intraEdges.push([i, i + 1]);
    }
  }

  // Spatial grid — cell ≈ 22 m, so adjacent cells cover ~66 m
  const CELL = 0.0002;
  const grid = new Map<string, number[]>();
  const key  = (lat: number, lon: number) =>
    `${Math.floor(lat / CELL)},${Math.floor(lon / CELL)}`;

  vertices.forEach((v, i) => {
    const k = key(v.lat, v.lon);
    const cell = grid.get(k);
    if (cell) cell.push(i); else grid.set(k, [i]);
  });

  // Cross-segment connections: any two vertices within 20 m
  const THRESHOLD = 20;
  const seen = new Set<number>(); // encoded pair
  const crossEdges: [number, number][] = [];

  vertices.forEach((v, i) => {
    const clat = Math.floor(v.lat / CELL);
    const clon = Math.floor(v.lon / CELL);
    for (let dlat = -1; dlat <= 1; dlat++) {
      for (let dlon = -1; dlon <= 1; dlon++) {
        for (const j of grid.get(`${clat + dlat},${clon + dlon}`) ?? []) {
          if (j <= i) continue;
          const pairKey = i * 100_000 + j;
          if (seen.has(pairKey)) continue;
          seen.add(pairKey);
          if (haversine(v, { latitude: vertices[j].lat, longitude: vertices[j].lon }) <= THRESHOLD) {
            crossEdges.push([i, j]);
          }
        }
      }
    }
  });

  // Build adjacency list (bidirectional)
  const adj: Edge[][] = vertices.map(() => []);
  for (const [a, b] of [...intraEdges, ...crossEdges]) {
    const d = haversine(
      { latitude: vertices[a].lat, longitude: vertices[a].lon },
      { latitude: vertices[b].lat, longitude: vertices[b].lon },
    );
    adj[a].push({ to: b, dist: d });
    adj[b].push({ to: a, dist: d });
  }

  return { vertices, adj };
}

// ── A* shortest path ───────────────────────────────────────────────────────
function astar(graph: Graph, startId: number, goalId: number): number[] {
  const { vertices, adj } = graph;
  const goal: LatLon = { latitude: vertices[goalId].lat, longitude: vertices[goalId].lon };

  const g        = new Float64Array(vertices.length).fill(Infinity);
  const parent   = new Int32Array(vertices.length).fill(-1);
  const closed   = new Uint8Array(vertices.length);
  g[startId]     = 0;

  const open = new MinHeap();
  open.push({ id: startId, f: haversine({ latitude: vertices[startId].lat, longitude: vertices[startId].lon }, goal) });

  while (open.size > 0) {
    const { id: cur } = open.pop()!;
    if (cur === goalId) {
      const path: number[] = [];
      for (let c = cur; c !== -1; c = parent[c]) path.push(c);
      return path.reverse();
    }
    if (closed[cur]) continue;
    closed[cur] = 1;

    for (const { to, dist } of adj[cur]) {
      if (closed[to]) continue;
      const tentG = g[cur] + dist;
      if (tentG < g[to]) {
        g[to]      = tentG;
        parent[to] = cur;
        open.push({ id: to, f: tentG + haversine({ latitude: vertices[to].lat, longitude: vertices[to].lon }, goal) });
      }
    }
  }
  return [];
}

// ── Nearest vertex to a LatLon ─────────────────────────────────────────────
function nearestVertex(graph: Graph, coord: LatLon): number {
  let best = -1, bestDist = Infinity;
  graph.vertices.forEach((v, i) => {
    const d = haversine(coord, { latitude: v.lat, longitude: v.lon });
    if (d < bestDist) { bestDist = d; best = i; }
  });
  return best;
}

// ── Lazy-built graph cache ─────────────────────────────────────────────────
let wheelchairGraph: Graph | null = null;
let allGraph:        Graph | null = null;

function getGraph(type: 'wheelchair' | 'all'): Graph {
  if (type === 'wheelchair') {
    if (!wheelchairGraph) wheelchairGraph = buildGraph(WHEELCHAIR_ROUTES);
    return wheelchairGraph;
  }
  if (!allGraph) allGraph = buildGraph([...WHEELCHAIR_ROUTES, ...LIMITED_MOBILITY_ROUTES]);
  return allGraph;
}

// ── Public API ─────────────────────────────────────────────────────────────
/**
 * Returns an ordered list of coordinates forming an accessible route from
 * `start` to `dest`, or null if the network has no reachable path.
 *
 * `type`:
 *   'wheelchair' — wheelchair-navigable paths only
 *   'all'        — wheelchair + limited-mobility paths
 */
export function getAccessibleRoute(
  start: LatLon,
  dest:  LatLon,
  type:  'wheelchair' | 'all' = 'wheelchair',
): LatLon[] | null {
  const graph   = getGraph(type);
  const startId = nearestVertex(graph, start);
  const goalId  = nearestVertex(graph, dest);
  if (startId === -1 || goalId === -1) return null;

  const MAX_SNAP = 400; // metres — if building is further than this from the network, bail
  const snapStart = haversine(start, { latitude: graph.vertices[startId].lat, longitude: graph.vertices[startId].lon });
  const snapGoal  = haversine(dest,  { latitude: graph.vertices[goalId].lat,  longitude: graph.vertices[goalId].lon });
  if (snapStart > MAX_SNAP || snapGoal > MAX_SNAP) return null;

  const ids = astar(graph, startId, goalId);
  if (!ids.length) return null;

  return ids.map(id => ({ latitude: graph.vertices[id].lat, longitude: graph.vertices[id].lon }));
}
