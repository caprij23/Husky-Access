import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const PURPLE = '#9B59B6';
type VoteState = 'up' | 'down' | null;

type Reply = {
  id: string;
  user: string;
  time: string;
  text: string;
};

type Comment = {
  id: string;
  user: string;
  time: string;
  text: string;
  replies: Reply[];
};

const POST_DATA: Record<string, any> = {
  '1': {
    id: '1', category: 'blockage', categoryColor: '#6366f1',
    user: 'j_peach99', time: '20m',
    title: 'Note for commuters',
    body: 'fyi the stairs down to husky stadium parking area are still closed off!!',
    upvotes: 15,
    comments: [
      { id: 'c1', user: 'dilly_dalle', time: '26s ago', text: "i wonder when they're gonna fix it 😤", replies: [] },
      { id: 'c2', user: 'jaden.lin', time: '18m ago', text: 'brooooo', replies: [] },
      { id: 'c3', user: 'ejr12220', time: '19m ago', text: 'it adds like 20 min to my commute istg', replies: [] },
    ],
  },
  '2': {
    id: '2', category: 'service', categoryColor: '#22c55e',
    user: 'milly_lee', time: '3h',
    title: 'I NEED THEM TO FIX KANE NOW.',
    body: "kane elevators haven't been fixed since fall q i swear. PLS",
    upvotes: 43,
    comments: [
      { id: 'c1', user: 'husky_fan', time: '1h ago', text: 'This has been going on forever', replies: [] },
      { id: 'c2', user: 'uw_student', time: '2h ago', text: 'So inconvenient for everyone', replies: [] },
    ],
  },
  '3': {
    id: '3', category: 'question', categoryColor: '#ec4899',
    user: 'p.deannnn', time: '3h',
    title: 'need help as new wheelchair user',
    body: 'does uw have any on campus resources? im newly in a wheelchair',
    upvotes: 2,
    comments: [
      { id: 'c1', user: 'helper123', time: '30m ago', text: 'Check out UW Disability Resources office!', replies: [] },
    ],
  },
};

const CURRENT_USER = 'me';

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const post = POST_DATA[id as string];

  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [vote, setVote] = useState<VoteState>(null);
  const [saved, setSaved] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; user: string; index: number } | null>(null);
  const [replyText, setReplyText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleVote = (dir: 'up' | 'down') => {
    if (vote === dir) {
      setVote(null);
      setUpvotes((u: number) => dir === 'up' ? u - 1 : u + 1);
    } else if (vote === null) {
      setVote(dir);
      setUpvotes((u: number) => dir === 'up' ? u + 1 : Math.max(0, u - 1));
    }
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now().toString(),
      user: CURRENT_USER,
      time: 'just now',
      text: newComment,
      replies: [],
    }]);
    setNewComment('');
  };

  const deleteComment = (commentId: string) => {
    Alert.alert('Delete comment', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setComments(prev => prev.filter(c => c.id !== commentId));
      }},
    ]);
  };

  const handleReplyPress = (commentId: string, user: string, index: number) => {
    setReplyingTo({ commentId, user, index });
    setReplyText('');
    // Scroll to that comment so keyboard doesn't cover it
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index, animated: true, viewOffset: 80 });
    }, 100);
  };

  const addReply = (commentId: string) => {
    if (!replyText.trim()) return;
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, { id: Date.now().toString(), user: CURRENT_USER, time: 'just now', text: replyText }] }
          : c
      )
    );
    setReplyText('');
    setReplyingTo(null);
  };

  const deleteReply = (commentId: string, replyId: string) => {
    Alert.alert('Delete reply', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setComments(prev =>
          prev.map(c =>
            c.id === commentId
              ? { ...c, replies: c.replies.filter(r => r.id !== replyId) }
              : c
          )
        );
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={comments}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          onScrollToIndexFailed={() => {}}
          ListHeaderComponent={() => (
            <View>
              {/* Post */}
              <View style={styles.postSection}>
                <View style={styles.cardTop}>
                  <View style={[styles.avatar, { backgroundColor: post.categoryColor }]}>
                    <Text style={styles.avatarText}>{post.user[0].toUpperCase()}</Text>
                  </View>
                  <View style={styles.metaBlock}>
                    <Text style={styles.categoryLabel}>{post.category}</Text>
                    <Text style={styles.meta}>{post.user} · {post.time}</Text>
                  </View>
                </View>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.body}>{post.body}</Text>
                <View style={styles.postActions}>
                  <View style={styles.votePill}>
                    <TouchableOpacity onPress={() => handleVote('up')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}>
                      <Text style={[styles.voteArrow, vote === 'up' && styles.voteArrowActive]}>↑</Text>
                    </TouchableOpacity>
                    <Text style={styles.voteCount}>{upvotes}</Text>
                    <TouchableOpacity onPress={() => handleVote('down')} hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
                      <Text style={[styles.voteArrow, vote === 'down' && styles.voteArrowActive]}>↓</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.saveBtn} onPress={() => setSaved(s => !s)}>
                    <Text style={styles.saveIcon}>{saved ? '🔖' : '🏷️'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Add comment — above comments */}
              <View style={styles.inputSection}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    placeholderTextColor="#aaa"
                    value={newComment}
                    onChangeText={setNewComment}
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

              {/* Replies — indented with vertical line */}
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
                      <Text style={styles.cancelReply}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </KeyboardAvoidingView>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.back()}>
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
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backArrow: { fontSize: 24, color: PURPLE, fontWeight: '600' },
  postSection: { padding: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  metaBlock: { flex: 1 },
  categoryLabel: { fontSize: 12, fontWeight: '700', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: 0.5 },
  meta: { fontSize: 12, color: '#999', marginTop: 1 },
  title: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  body: { fontSize: 15, color: '#444', lineHeight: 22, marginBottom: 16 },
  postActions: { flexDirection: 'row', alignItems: 'center' },
  votePill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f3f0f7', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start',
  },
  voteArrow: { fontSize: 18, color: '#1a1a1a', fontWeight: '700' },
  voteArrowActive: { color: PURPLE },
  voteCount: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', minWidth: 24, textAlign: 'center' },
  saveBtn: { marginLeft: 'auto' },
  saveIcon: { fontSize: 20 },
  inputSection: { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1, backgroundColor: '#f3f4f6', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8, fontSize: 14, color: '#333',
  },
  sendBtn: { backgroundColor: PURPLE, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  sendText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  commentsHeader: { fontSize: 16, fontWeight: '700', paddingHorizontal: 16, paddingVertical: 12, color: '#1a1a1a' },
  separator: { height: 1, backgroundColor: '#f0f0f0' },
  commentBlock: { paddingTop: 4 },
  comment: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e0e7ff', justifyContent: 'center', alignItems: 'center' },
  replyAvatar: { width: 28, height: 28, borderRadius: 14 },
  commentAvatarText: { fontSize: 13, fontWeight: '700', color: PURPLE },
  replyAvatarText: { fontSize: 11, fontWeight: '700', color: PURPLE },
  commentBody: { flex: 1 },
  commentTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  commentUser: { fontSize: 13, fontWeight: '700', color: '#1a1a1a' },
  commentTime: { fontSize: 12, color: '#999' },
  commentText: { fontSize: 14, color: '#333', lineHeight: 20 },
  commentActions: { flexDirection: 'row', gap: 16, marginTop: 6 },
  replyBtnText: { fontSize: 12, color: PURPLE, fontWeight: '600' },
  deleteText: { fontSize: 12, color: '#ef4444', fontWeight: '600' },
  replyBlock: { flexDirection: 'row', paddingLeft: 52, paddingRight: 16, paddingBottom: 8 },
  replyLine: { width: 2, backgroundColor: '#e0e7ff', borderRadius: 2, marginRight: 10 },
  reply: { flex: 1, flexDirection: 'row', gap: 8 },
  replyInputBlock: { flexDirection: 'row', paddingLeft: 52, paddingRight: 16, paddingBottom: 10 },
  replyInputRow: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center' },
  cancelReply: { fontSize: 16, color: '#aaa', paddingHorizontal: 4 },
  navbar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 8, backgroundColor: '#fff' },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  navIcon: { fontSize: 20 },
  navLabel: { fontSize: 11, color: '#aaa', marginTop: 2 },
  navLabelActive: { color: PURPLE, fontWeight: '700' },
});