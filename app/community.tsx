import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePosts } from '../context/PostsContext';

const PURPLE = '#9B59B6';
const PURPLE_DARK = '#7209B7';

const STATIC_POSTS = [
  {
    id: '1',
    category: 'blockage',
    categoryColor: '#6366f1',
    user: 'j_peach99',
    time: '20m',
    title: 'Note for commuters',
    body: 'fyi the stairs down to husky stadium parking area are still closed off!!',
  },
  {
    id: '2',
    category: 'service',
    categoryColor: '#22c55e',
    user: 'milly_lee',
    time: '3h',
    title: 'I NEED THEM TO FIX KANE NOW.',
    body: "kane elevators haven't been fixed since fall q i swear. PLS",
  },
  {
    id: '3',
    category: 'question',
    categoryColor: '#ec4899',
    user: 'p.deannnn',
    time: '3h',
    title: 'need help as new wheelchair user',
    body: 'does uw have any on campus resources? im newly in a wheelchair',
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { postStates, handleVote, handleSave } = usePosts();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch,  setShowSearch]  = useState(false);

  const displayedPosts = useMemo(() => {
    const merged = STATIC_POSTS.map(post => {
      const state = postStates.find(s => s.id === post.id) ?? {
        upvotes: 0, vote: null as 'up' | 'down' | null, saved: false, commentCount: 0,
      };
      return { ...post, ...state };
    });
    const sorted = [...merged].sort((a, b) => b.upvotes - a.upvotes);
    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.toLowerCase();
    return sorted.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q) ||
      p.user.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [postStates, searchQuery]);

  const BOTTOM_NAV_H = 60;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push('/create-post')}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={22} color={PURPLE_DARK} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => { setShowSearch(s => !s); setSearchQuery(''); }}
              activeOpacity={0.7}
            >
              <Ionicons name={showSearch ? 'close' : 'search-outline'} size={20} color={PURPLE_DARK} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar */}
        {showSearch && (
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#aaa" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search posts..."
              placeholderTextColor="#bbb"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={18} color="#bbb" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Posts */}
        {displayedPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color="#ddd" />
            <Text style={styles.emptyText}>No posts match "{searchQuery}"</Text>
          </View>
        ) : (
          <FlatList
            data={displayedPosts}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: BOTTOM_NAV_H + insets.bottom }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/community/${item.id}`)}
                activeOpacity={0.75}
              >
                {/* Top row */}
                <View style={styles.cardTop}>
                  <View style={[styles.avatar, { backgroundColor: item.categoryColor }]}>
                    <Text style={styles.avatarText}>{item.user[0].toUpperCase()}</Text>
                  </View>
                  <View style={styles.metaBlock}>
                    <Text style={[styles.categoryLabel, { color: item.categoryColor }]}>
                      {item.category}
                    </Text>
                    <Text style={styles.meta}>{item.user} · {item.time}</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>

                {/* Actions */}
                <View style={styles.actions}>
                  <View style={styles.votePill}>
                    <TouchableOpacity
                      onPress={e => { e.stopPropagation(); handleVote(item.id, 'up'); }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
                    >
                      <Ionicons
                        name="arrow-up"
                        size={16}
                        color={item.vote === 'up' ? PURPLE_DARK : '#555'}
                      />
                    </TouchableOpacity>
                    <Text style={[styles.voteCount, item.vote !== null && styles.voteCountActive]}>
                      {item.upvotes}
                    </Text>
                    <TouchableOpacity
                      onPress={e => { e.stopPropagation(); handleVote(item.id, 'down'); }}
                      hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
                    >
                      <Ionicons
                        name="arrow-down"
                        size={16}
                        color={item.vote === 'down' ? PURPLE_DARK : '#555'}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.commentPill}>
                    <Ionicons name="chatbubble-outline" size={14} color="#777" />
                    <Text style={styles.commentCount}>{item.commentCount}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.savePill}
                    onPress={e => { e.stopPropagation(); handleSave(item.id); }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={item.saved ? 'bookmark' : 'bookmark-outline'}
                      size={18}
                      color={item.saved ? PURPLE_DARK : '#aaa'}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>

      {/* Bottom navigation */}
      <View style={[styles.bottomNav, { height: BOTTOM_NAV_H + insets.bottom, paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/reportscreen_1')}>
          <Ionicons name="warning-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="mail" size={24} color={PURPLE} />
          <Text style={[styles.navLabel, styles.navActive]}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/profile_page')}>
          <Ionicons name="person-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  safe: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8FF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: '#111',
  },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3EAFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8FF',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F7F2FF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 9 : 6,
    fontSize: 15,
    color: '#111',
    borderWidth: 1.5,
    borderColor: '#E4D4F8',
  },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 12 },
  emptyText:  { fontSize: 15, color: '#aaa', textAlign: 'center' },

  separator: { height: 1, backgroundColor: '#F5F0FF' },

  card: { paddingHorizontal: 20, paddingVertical: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarText:    { color: '#fff', fontWeight: '700', fontSize: 16 },
  metaBlock:     { flex: 1 },
  categoryLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  meta:          { fontSize: 12, color: '#999', marginTop: 2 },
  cardTitle:     { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 5, letterSpacing: -0.2 },
  cardBody:      { fontSize: 14, color: '#6B6B6B', lineHeight: 21, marginBottom: 14 },

  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  votePill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F3EAFF', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  voteCount:       { fontSize: 14, fontWeight: '700', color: '#555', minWidth: 18, textAlign: 'center' },
  voteCountActive: { color: PURPLE_DARK },
  commentPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#F5F5F5', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 7,
  },
  commentCount: { fontSize: 13, fontWeight: '600', color: '#777' },
  savePill:     { marginLeft: 'auto' },

  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee', zIndex: 20,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: -2 } },
      android: { elevation: 8 },
    }),
  },
  navItem:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  navLabel: { fontSize: 11, color: '#888' },
  navActive:{ color: PURPLE, fontWeight: '700' },
});
