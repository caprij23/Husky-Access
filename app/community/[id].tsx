import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePosts } from '../../context/PostsContext';

const PURPLE      = '#9B59B6';
const PURPLE_DARK = '#7209B7';

type Reply = { id: string; user: string; time: string; text: string };
type Comment = { id: string; user: string; time: string; text: string; replies: Reply[] };

const POST_DATA: Record<string, {
  id: string; category: string; categoryColor: string;
  user: string; time: string; title: string; body: string;
  initialComments: Comment[];
}> = {
  '1': {
    id: '1', category: 'blockage', categoryColor: '#6366f1',
    user: 'j_peach99', time: '20m',
    title: 'Note for commuters',
    body: 'fyi the stairs down to husky stadium parking area are still closed off!!',
    initialComments: [
      { id: 'c1', user: 'dilly_dalle', time: '26s ago', text: "i wonder when they're gonna fix it 😤", replies: [] },
      { id: 'c2', user: 'jaden.lin',   time: '18m ago', text: 'brooooo', replies: [] },
      { id: 'c3', user: 'ejr12220',    time: '19m ago', text: 'it adds like 20 min to my commute istg', replies: [] },
    ],
  },
  '2': {
    id: '2', category: 'service', categoryColor: '#22c55e',
    user: 'milly_lee', time: '3h',
    title: 'I NEED THEM TO FIX KANE NOW.',
    body: "kane elevators haven't been fixed since fall q i swear. PLS",
    initialComments: [
      { id: 'c1', user: 'husky_fan',  time: '1h ago', text: 'This has been going on forever', replies: [] },
      { id: 'c2', user: 'uw_student', time: '2h ago', text: 'So inconvenient for everyone', replies: [] },
    ],
  },
  '3': {
    id: '3', category: 'question', categoryColor: '#ec4899',
    user: 'p.deannnn', time: '3h',
    title: 'need help as new wheelchair user',
    body: 'does uw have any on campus resources? im newly in a wheelchair',
    initialComments: [
      { id: 'c1', user: 'helper123', time: '30m ago', text: 'Check out UW Disability Resources office!', replies: [] },
    ],
  },
};

const CURRENT_USER = 'me';

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const post    = POST_DATA[id];

  const { postStates, handleVote, handleSave, updateCommentCount } = usePosts();
  const postState = postStates.find(s => s.id === id) ?? { upvotes: 0, vote: null as 'up'|'down'|null, saved: false, commentCount: 0 };

  const [comments,    setComments]    = useState<Comment[]>(post.initialComments);
  const [newComment,  setNewComment]  = useState('');
  const [replyingTo,  setReplyingTo]  = useState<{ commentId: string; user: string; index: number } | null>(null);
  const [replyText,   setReplyText]   = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Keep comment count in shared context in sync
  useEffect(() => {
    updateCommentCount(id, comments.length);
  }, [comments.length]);

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now().toString(),
      user: CURRENT_USER,
      time: 'just now',
      text: newComment.trim(),
      replies: [],
    }]);
    setNewComment('');
  };

  const deleteComment = (commentId: string) => {
    Alert.alert('Delete comment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () =>
        setComments(prev => prev.filter(c => c.id !== commentId))
      },
    ]);
  };

  const handleReplyPress = (commentId: string, user: string, index: number) => {
    setReplyingTo({ commentId, user, index });
    setReplyText('');
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index, animated: true, viewOffset: 80 });
    }, 100);
  };

  const addReply = (commentId: string) => {
    if (!replyText.trim()) return;
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, { id: Date.now().toString(), user: CURRENT_USER, time: 'just now', text: replyText.trim() }] }
          : c
      )
    );
    setReplyText('');
    setReplyingTo(null);
  };

  const deleteReply = (commentId: string, replyId: string) => {
    Alert.alert('Delete reply', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () =>
        setComments(prev =>
          prev.map(c =>
            c.id === commentId
              ? { ...c, replies: c.replies.filter(r => r.id !== replyId) }
              : c
          )
        )
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.headerSafe} edges={['top']}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back" size={22} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{post.title}</Text>
          <View style={{ width: 38 }} />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={comments}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          onScrollToIndexFailed={() => {}}
          contentContainerStyle={{ paddingBottom: 60 + insets.bottom }}
          ListHeaderComponent={() => (
            <View>
              {/* Post body */}
              <View style={styles.postSection}>
                <View style={styles.cardTop}>
                  <View style={[styles.avatar, { backgroundColor: post.categoryColor }]}>
                    <Text style={styles.avatarText}>{post.user[0].toUpperCase()}</Text>
                  </View>
                  <View style={styles.metaBlock}>
                    <Text style={[styles.categoryLabel, { color: post.categoryColor }]}>
                      {post.category}
                    </Text>
                    <Text style={styles.meta}>{post.user} · {post.time}</Text>
                  </View>
                </View>

                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.body}>{post.body}</Text>

                {/* Vote + Save row */}
                <View style={styles.postActions}>
                  <View style={styles.votePill}>
                    <TouchableOpacity onPress={() => handleVote(id, 'up')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}>
                      <Ionicons
                        name="arrow-up"
                        size={18}
                        color={postState.vote === 'up' ? PURPLE_DARK : '#555'}
                      />
                    </TouchableOpacity>
                    <Text style={[styles.voteCount, postState.vote !== null && styles.voteCountActive]}>
                      {postState.upvotes}
                    </Text>
                    <TouchableOpacity onPress={() => handleVote(id, 'down')} hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
                      <Ionicons
                        name="arrow-down"
                        size={18}
                        color={postState.vote === 'down' ? PURPLE_DARK : '#555'}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.saveBtn} onPress={() => handleSave(id)}>
                    <Ionicons
                      name={postState.saved ? 'bookmark' : 'bookmark-outline'}
                      size={22}
                      color={postState.saved ? PURPLE_DARK : '#aaa'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Add comment */}
              <View style={styles.inputSection}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    placeholderTextColor="#aaa"
                    value={newComment}
                    onChangeText={setNewComment}
                    returnKeyType="send"
                    onSubmitEditing={addComment}
                  />
                  <TouchableOpacity style={styles.sendBtn} onPress={addComment}>
                    <Text style={styles.sendText}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.commentsHeader}>{comments.length} Comments</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View style={styles.commentBlock}>
              <View style={styles.comment}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>{item.user[0].toUpperCase()}</Text>
                </View>
                <View style={styles.commentBody}>
                  <View style={styles.commentTop}>
                    <Text style={styles.commentUser}>{item.user}</Text>
                    <Text style={styles.commentTime}> · {item.time}</Text>
                  </View>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <View style={styles.commentActions}>
                    <TouchableOpacity onPress={() => handleReplyPress(item.id, item.user, index)}>
                      <Text style={styles.replyBtnText}>↩ Reply</Text>
                    </TouchableOpacity>
                    {item.user === CURRENT_USER && (
                      <TouchableOpacity onPress={() => deleteComment(item.id)}>
                        <Text style={styles.deleteText}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              {/* Replies */}
              {item.replies.map((reply: Reply) => (
                <View key={reply.id} style={styles.replyBlock}>
                  <View style={styles.replyLine} />
                  <View style={styles.reply}>
                    <View style={[styles.commentAvatar, styles.replyAvatar]}>
                      <Text style={styles.replyAvatarText}>{reply.user[0].toUpperCase()}</Text>
                    </View>
                    <View style={styles.commentBody}>
                      <View style={styles.commentTop}>
                        <Text style={styles.commentUser}>{reply.user}</Text>
                        <Text style={styles.commentTime}> · {reply.time}</Text>
                      </View>
                      <Text style={styles.commentText}>{reply.text}</Text>
                      {reply.user === CURRENT_USER && (
                        <TouchableOpacity onPress={() => deleteReply(item.id, reply.id)}>
                          <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}

              {/* Inline reply input */}
              {replyingTo?.commentId === item.id && (
                <View style={styles.replyInputBlock}>
                  <View style={styles.replyLine} />
                  <View style={styles.replyInputRow}>
                    <TextInput
                      style={styles.input}
                      placeholder={`Reply to ${replyingTo.user}...`}
                      placeholderTextColor="#aaa"
                      value={replyText}
                      onChangeText={setReplyText}
                      autoFocus
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={() => addReply(item.id)}>
                      <Text style={styles.sendText}>Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setReplyingTo(null); setReplyText(''); }}>
                      <Ionicons name="close" size={18} color="#aaa" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </KeyboardAvoidingView>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { height: 60 + insets.bottom, paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/reportscreen_1')}>
          <Ionicons name="warning-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.back()}>
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

  headerSafe:  { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0E8FF' },
  headerBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10, gap: 8,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#F3EAFF', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#111', textAlign: 'center' },

  postSection: { padding: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  metaBlock: { flex: 1 },
  categoryLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  meta: { fontSize: 12, color: '#999', marginTop: 2 },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  body:  { fontSize: 15, color: '#444', lineHeight: 22, marginBottom: 16 },

  postActions: { flexDirection: 'row', alignItems: 'center' },
  votePill: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#F3EAFF', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start',
  },
  voteCount:       { fontSize: 15, fontWeight: '700', color: '#555', minWidth: 24, textAlign: 'center' },
  voteCountActive: { color: PURPLE_DARK },
  saveBtn: { marginLeft: 'auto', padding: 4 },

  inputSection: { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8, fontSize: 14, color: '#333',
  },
  sendBtn:  { backgroundColor: PURPLE, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  sendText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  commentsHeader: { fontSize: 16, fontWeight: '700', paddingHorizontal: 16, paddingVertical: 12, color: '#1a1a1a' },
  separator:      { height: 1, backgroundColor: '#f0f0f0' },

  commentBlock: { paddingTop: 4 },
  comment: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  commentAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#e0e7ff', justifyContent: 'center', alignItems: 'center',
  },
  replyAvatar:       { width: 28, height: 28, borderRadius: 14 },
  commentAvatarText: { fontSize: 13, fontWeight: '700', color: PURPLE },
  replyAvatarText:   { fontSize: 11, fontWeight: '700', color: PURPLE },
  commentBody:  { flex: 1 },
  commentTop:   { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  commentUser:  { fontSize: 13, fontWeight: '700', color: '#1a1a1a' },
  commentTime:  { fontSize: 12, color: '#999' },
  commentText:  { fontSize: 14, color: '#333', lineHeight: 20 },
  commentActions: { flexDirection: 'row', gap: 16, marginTop: 6 },
  replyBtnText: { fontSize: 12, color: PURPLE, fontWeight: '600' },
  deleteText:   { fontSize: 12, color: '#ef4444', fontWeight: '600' },

  replyBlock:     { flexDirection: 'row', paddingLeft: 52, paddingRight: 16, paddingBottom: 8 },
  replyLine:      { width: 2, backgroundColor: '#e0e7ff', borderRadius: 2, marginRight: 10 },
  reply:          { flex: 1, flexDirection: 'row', gap: 8 },
  replyInputBlock:{ flexDirection: 'row', paddingLeft: 52, paddingRight: 16, paddingBottom: 10 },
  replyInputRow:  { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center' },

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
