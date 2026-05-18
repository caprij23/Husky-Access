import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';

const PURPLE = '#9B59B6';
const CATEGORIES = ['blockage', 'service', 'question', 'general'];
const CATEGORY_COLORS: Record<string, string> = {
  blockage: '#6366f1', service: '#22c55e',
  question: '#ec4899', general: '#f59e0b',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const canPost = title.trim().length > 0 && selectedCategory.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

        {/* Header — cancel | title | post */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerSide}>
            <Text style={styles.cancel}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create Post</Text>

          <View style={styles.headerSide}>
            <TouchableOpacity
              style={[styles.postBtn, !canPost && styles.postBtnDisabled]}
              onPress={() => { if (canPost) router.back(); }}
            >
              <Text style={styles.postBtnText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.categories}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat && {
                    backgroundColor: CATEGORY_COLORS[cat],
                    borderColor: CATEGORY_COLORS[cat],
                  }
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === cat && { color: '#fff' }
                ]}>
                  {capitalize(cat)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Title */}
          <TextInput
            style={styles.titleInput}
            placeholder="Describe your post"
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
            maxLength={150}
          />
          <Text style={[styles.charCount, title.length >= 130 && { color: '#ef4444' }]}>
            {title.length}/150
          </Text>

          {/* Body */}
          <TextInput
            style={styles.bodyInput}
            placeholder="Text (optional)"
            placeholderTextColor="#aaa"
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
          />

          {/* Add image */}
          <TouchableOpacity
            style={styles.imageBtn}
            onPress={() => Alert.alert('Add Image', 'Image picker coming soon!')}
          >
            <Text style={styles.imageBtnIcon}>🖼️</Text>
            <Text style={styles.imageBtnText}>Add Image</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  // Equal-width sides so title is perfectly centered
  headerSide: {
    width: 72,
    alignItems: 'flex-end',
  },
  cancel: { fontSize: 18, color: '#555', alignSelf: 'flex-start' },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '700', textAlign: 'center', color: '#1a1a1a' },
  postBtn: {
    backgroundColor: PURPLE, borderRadius: 20,
    paddingHorizontal: 18, paddingVertical: 7,
  },
  postBtnDisabled: { backgroundColor: '#d8b4e2' },
  postBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  form: { padding: 16, gap: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#555' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { borderWidth: 1.5, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  categoryChipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  titleInput: { borderWidth: 1.5, borderColor: '#eee', borderRadius: 12, padding: 14, fontSize: 15, color: '#333' },
  charCount: { fontSize: 12, color: '#aaa', textAlign: 'right', marginTop: -8 },
  bodyInput: { borderWidth: 1.5, borderColor: '#eee', borderRadius: 12, padding: 14, fontSize: 15, color: '#333', minHeight: 160 },
  imageBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1.5, borderColor: '#eee', borderRadius: 12,
    padding: 14, borderStyle: 'dashed',
  },
  imageBtnIcon: { fontSize: 18 },
  imageBtnText: { fontSize: 14, color: '#888', fontWeight: '600' },
});