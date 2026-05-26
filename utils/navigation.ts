export interface LatLon { latitude: number; longitude: number; }

export interface NavStep {
  instruction: string;
  iconName:    string;  // Ionicons name
  coordIndex:  number;  // index in routeCoords where this step applies
}

export interface NavBanner {
  instruction:    string;
  iconName:       string;
  distToNext:     string;  // "45 m" | "arriving"
  distRemaining:  string;
  arrived:        boolean;
}

// ── Geometry helpers ───────────────────────────────────────────────────────
export function haversine(a: LatLon, b: LatLon): number {
  const R = 6_371_000;
  const dLat = (b.latitude  - a.latitude)  * (Math.PI / 180);
  const dLon = (b.longitude - a.longitude) * (Math.PI / 180);
  const lat1 = a.latitude  * (Math.PI / 180);
  const lat2 = b.latitude  * (Math.PI / 180);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function getBearing(a: LatLon, b: LatLon): number {
  const lat1 = a.latitude  * (Math.PI / 180);
  const lat2 = b.latitude  * (Math.PI / 180);
  const dLon = (b.longitude - a.longitude) * (Math.PI / 180);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
}

function normaliseAngle(a: number): number {
  while (a >  180) a -= 360;
  while (a < -180) a += 360;
  return a;
}

function cardinalDir(bearing: number): string {
  const dirs = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
  return dirs[Math.round(bearing / 45) % 8];
}

function turnLabel(delta: number): { text: string; icon: string } {
  const abs  = Math.abs(delta);
  const side = delta > 0 ? 'right' : 'left';
  if (abs < 20)  return { text: 'Continue straight',       icon: 'arrow-up-outline'               };
  if (abs < 45)  return { text: `Keep ${side}`,            icon: delta > 0 ? 'arrow-forward-outline' : 'arrow-back-outline' };
  if (abs < 120) return { text: `Turn ${side}`,            icon: delta > 0 ? 'arrow-forward-outline' : 'arrow-back-outline' };
  return             { text: `Turn sharp ${side}`,         icon: delta > 0 ? 'return-up-forward-outline' : 'return-up-back-outline' };
}

// ── Step generation ────────────────────────────────────────────────────────
export function generateSteps(coords: LatLon[]): NavStep[] {
  if (coords.length < 2) return [];

  const steps: NavStep[] = [];

  // Opening instruction
  const initBearing = getBearing(coords[0], coords[Math.min(4, coords.length - 1)]);
  steps.push({ instruction: `Head ${cardinalDir(initBearing)}`, iconName: 'navigate-outline', coordIndex: 0 });

  const LOOK  = 3;   // smoothing window for jitter
  const MIN   = 25;  // degrees to consider a turn
  const MIN_D = 12;  // metres between consecutive turns

  for (let i = LOOK; i < coords.length - LOOK; i++) {
    const b1    = getBearing(coords[i - LOOK], coords[i]);
    const b2    = getBearing(coords[i], coords[i + LOOK]);
    const delta = normaliseAngle(b2 - b1);
    if (Math.abs(delta) < MIN) continue;

    const last = steps[steps.length - 1];
    if (haversine(coords[last.coordIndex], coords[i]) < MIN_D) continue;

    const { text, icon } = turnLabel(delta);
    steps.push({ instruction: text, iconName: icon, coordIndex: i });
  }

  steps.push({ instruction: 'Arrive at destination', iconName: 'flag-outline', coordIndex: coords.length - 1 });
  return steps;
}

// ── Navigation progress ────────────────────────────────────────────────────

/** Search forward a window from `fromIdx` to find the closest route point to the user. */
export function findClosestPointIndex(user: LatLon, route: LatLon[], fromIdx: number): number {
  const end  = Math.min(fromIdx + 40, route.length);
  let best   = fromIdx;
  let bestD  = haversine(user, route[fromIdx]);
  for (let i = fromIdx + 1; i < end; i++) {
    const d = haversine(user, route[i]);
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}

/** Index into `steps[]` that the user is currently walking toward. */
export function getCurrentStepIndex(steps: NavStep[], closestCoordIdx: number): number {
  let idx = 0;
  for (let i = 0; i < steps.length - 1; i++) {
    if (closestCoordIdx >= steps[i].coordIndex) idx = i;
  }
  return idx;
}

/** Sum of segment lengths from `fromIdx` to the step at `stepCoordIdx`. */
export function distToNextStep(route: LatLon[], fromIdx: number, stepCoordIdx: number): number {
  let total = 0;
  const end = Math.min(stepCoordIdx, route.length - 1);
  for (let i = fromIdx; i < end; i++) {
    total += haversine(route[i], route[i + 1]);
  }
  return total;
}

/** Sum of all remaining segment lengths from `fromIdx` to end of route. */
export function sumRemainingDistance(route: LatLon[], fromIdx: number): number {
  let total = 0;
  for (let i = fromIdx; i < route.length - 1; i++) {
    total += haversine(route[i], route[i + 1]);
  }
  return total;
}

export function formatDistance(metres: number): string {
  if (metres < 15)    return 'arriving';
  if (metres < 1000)  return `${Math.round(metres / 5) * 5} m`;
  return `${(metres / 1000).toFixed(1)} km`;
}

/** Build the banner data shown during active navigation. */
export function getNavBanner(
  steps:        NavStep[],
  route:        LatLon[],
  closestIdx:   number,
): NavBanner {
  const stepIdx    = getCurrentStepIndex(steps, closestIdx);
  const step       = steps[stepIdx];
  const nextStep   = steps[stepIdx + 1];
  const distRemain = sumRemainingDistance(route, closestIdx);
  const arrived    = closestIdx >= route.length - 5 || distRemain < 15;

  if (arrived) {
    return { instruction: 'You have arrived!', iconName: 'flag', distToNext: '', distRemaining: '', arrived: true };
  }

  const distNext = nextStep
    ? distToNextStep(route, closestIdx, nextStep.coordIndex)
    : distRemain;

  return {
    instruction:   step.instruction,
    iconName:      step.iconName,
    distToNext:    formatDistance(distNext),
    distRemaining: formatDistance(distRemain),
    arrived:       false,
  };
}
