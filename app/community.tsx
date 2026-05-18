import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const PURPLE = '#9B59B6';
type VoteState = 'up' | 'down' | null;

const INITIAL_POSTS = [
  {
    id: '1',
    category: 'blockage',
    categoryColor: '#6366f1',
    user: 'j_peach99',
    time: '20m',
    title: 'Note for commuters',
    body: 'fyi the stairs down to husky stadium parking area are still closed off!!',
    upvotes: 15,
    comments: 3, // matches actual 3 comments in [id].tsx
    saved: false,
    vote: null as VoteState,
  },
  {
    id: '2',
    category: 'service',
    categoryColor: '#22c55e',
    user: 'milly_lee',
    time: '3h',
    title: 'I NEED THEM TO FIX KANE NOW.',
    body: "kane elevators haven't been fixed since fall q i swear. PLS",
    upvotes: 43,
    comments: 2, // matches actual 2 comments in [id].tsx
    saved: false,
    vote: null as VoteState,
  },
  {
    id: '3',
    category: 'question',
    categoryColor: '#ec4899',
    user: 'p.deannnn',
    time: '3h',
    title: 'need help as new wheelchair user',
    body: 'does uw have any on campus resources? im newly in a wheelchair',
    upvotes: 2,
    comments: 1, // matches actual 1 comment in [id].tsx
    saved: false,
    vote: null as VoteState,
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleVote = (id: string, dir: 'up' | 'down') => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        if (p.vote === dir) {
          return { ...p, vote: null, upvotes: dir === 'up' ? p.upvotes - 1 : p.upvotes + 1 };
        }
        if (p.vote !== null) return p;
        const newUpvotes = dir === 'up' ? p.upvotes + 1 : Math.max(0, p.upvotes - 1);
        return { ...p, vote: dir, upvotes: newUpvotes };
      })
    );
  };

  const handleSave = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  };

  // Sort by upvotes descending, then filter by search
  const displayedPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => b.upvotes - a.upvotes);
    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.toLowerCase();
    return sorted.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q) ||
      p.user.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => router.push('/create-post')}>
            <Text style={styles.headerIconText}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setShowSearch(s => !s); setSearchQuery(''); }}>
            <Text style={styles.headerIconText}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {displayedPosts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No posts match "{searchQuery}"</Text>
        </View>
      ) : (
        <FlatList
          data={displayedPosts}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/community/${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.cardTop}>
                <View style={[styles.avatar, { backgroundColor: item.categoryColor }]}>
                  <Text style={styles.avatarText}>{item.user[0].toUpperCase()}</Text>
                </View>
                <View style={styles.metaBlock}>
                  <Text style={styles.categoryLabel}>{item.category}</Text>
                  <Text style={styles.meta}>{item.user} · {item.time}</Text>
                </View>
              </View>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body} numberOfLines={2}>{item.body}</Text>

              <View style={styles.actions}>
                <View style={styles.votePill}>
                  <TouchableOpacity
                    onPress={(e) => { e.stopPropagation(); handleVote(item.id, 'up'); }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
                  >
                    <Text style={[styles.voteArrow, item.vote === 'up' && styles.voteArrowActive]}>↑</Text>
                  </TouchableOpacity>
                  <Text style={styles.voteCount}>{item.upvotes}</Text>
                  <TouchableOpacity
                    onPress={(e) => { e.stopPropagation(); handleVote(item.id, 'down'); }}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
                  >
                    <Text style={[styles.voteArrow, item.vote === 'down' && styles.voteArrowActive]}>↓</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.commentCount}>
                  <Text style={styles.actionIcon}>💬</Text>
                  <Text style={styles.actionText}>{item.comments}</Text>
                </View>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={(e) => { e.stopPropagation(); handleSave(item.id); }}
                >
                  <Text style={styles.saveIcon}>{item.saved ? '🔖' : '🏷️'}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚠️</Text>
          <Text style={styles.navLabel}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>✉️</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a1a' },
  headerIcons: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  headerIconText: { fontSize: 24, color: PURPLE },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#eee', gap: 8,
  },
  searchInput: {
    flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8, fontSize: 14, color: '#333',
  },
  searchClear: { fontSize: 16, color: '#aaa', paddingHorizontal: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 15, color: '#aaa', textAlign: 'center' },
  separator: { height: 1, backgroundColor: '#f0f0f0' },
  card: { padding: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  metaBlock: { flex: 1 },
  categoryLabel: { fontSize: 12, fontWeight: '700', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: 0.5 },
  meta: { fontSize: 12, color: '#999', marginTop: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  body: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  votePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#f3f0f7', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  voteArrow: { fontSize: 16, color: '#1a1a1a', fontWeight: '700' },
  voteArrowActive: { color: PURPLE },
  voteCount: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', minWidth: 20, textAlign: 'center' },
  commentCount: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionIcon: { fontSize: 14 },
  actionText: { fontSize: 13, fontWeight: '600', color: '#555' },
  saveBtn: { marginLeft: 'auto' },
  saveIcon: { fontSize: 18 },
  navbar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 8, backgroundColor: '#fff' },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 11, color: '#aaa', marginTop: 2 },
  navLabelActive: { color: PURPLE, fontWeight: '700' },
});