import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const PROBLEMS = [
  { id: 'elevator',  label: 'Broken Elevator'  },
  { id: 'path',      label: 'Obstructed Path'   },
  { id: 'entrances', label: 'Blocked Entrances' },
  { id: 'ramps',     label: 'Misuse of Ramps'   },
];

const PURPLE       = '#7209B7';
const PURPLE_LIGHT = '#F3EAFF';

export default function ReportScreen1() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addReport } = useUser();

  const [selected,     setSelected]     = useState<Set<string>>(new Set());
  const [otherChecked, setOtherChecked] = useState(false);
  const [otherText,    setOtherText]    = useState('');
  const [photo,        setPhoto]        = useState<string | null>(null);
  const [submitted,    setSubmitted]    = useState(false);

  const toggleProblem = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera access needed', 'Please allow camera access in Settings.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Photo library access needed', 'Please allow photo library access in Settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleSubmit = () => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const problems = [...selected].map(id => PROBLEMS.find(p => p.id === id)?.label ?? id);
    if (otherChecked && otherText.trim()) problems.push(otherText.trim());
    const title = `${dateStr} - ${problems.join(', ')}`;

    addReport({
      id: Date.now().toString(),
      title,
      imageUri: photo ?? undefined,
      date: dateStr,
    });

    setSubmitted(true);
    Alert.alert('Report submitted!', 'Thank you for helping improve campus accessibility.', [
      {
        text: 'OK',
        onPress: () => router.replace('/home'),
      },
    ]);
  };

  const canSubmit = (selected.size > 0 || otherChecked) && !submitted;

  const BOTTOM_NAV_H = 60;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      {/* Compact purple header */}
      <SafeAreaView style={styles.headerSafe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="warning-outline" size={18} color="rgba(255,255,255,0.9)" />
            <Text style={styles.headerTitle}>File a Report</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      {/* Scrollable content */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={[styles.bodyContent, { paddingBottom: BOTTOM_NAV_H + insets.bottom + 16 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeading}>Report a Problem</Text>
        <Text style={styles.sectionSub}>
          Snap a photo and we'll take care of the rest. Your location and timestamp will be automatically recorded.
        </Text>

        {/* Photo card */}
        <View style={styles.card}>
          <View style={styles.cardLabelRow}>
            <Ionicons name="camera-outline" size={18} color="#111" />
            <Text style={styles.cardLabel}>Capture Problem Photo</Text>
            <Text style={styles.required}>*</Text>
          </View>

          <View style={[styles.photoZone, photo ? styles.photoZoneActive : null]}>
            {photo ? (
              <>
                <Image source={{ uri: photo }} style={styles.photoPreview} resizeMode="cover" />
                <TouchableOpacity style={styles.retakeBtn} onPress={takePhoto} activeOpacity={0.8}>
                  <Ionicons name="refresh-outline" size={14} color={PURPLE} />
                  <Text style={styles.retakeBtnText}>Retake</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Ionicons name="camera-outline" size={38} color="#C0B0D8" />
                <Text style={styles.photoPlaceholder}>Take a photo of the problem</Text>
              </>
            )}
          </View>

          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto} activeOpacity={0.85}>
              <Ionicons name="camera-outline" size={16} color="#fff" />
              <Text style={styles.cameraBtnText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.galleryBtn} onPress={pickFromGallery} activeOpacity={0.85}>
              <Ionicons name="images-outline" size={16} color={PURPLE} />
              <Text style={styles.galleryBtnText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Problem checklist card */}
        <View style={styles.card}>
          <View style={styles.cardLabelRow}>
            <Ionicons name="list-outline" size={18} color="#111" />
            <Text style={styles.cardLabel}>What's the issue?</Text>
          </View>
          <Text style={styles.cardSub}>Select all that apply, or describe it below.</Text>

          {PROBLEMS.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.checkRow, selected.has(p.id) && styles.checkRowActive]}
              onPress={() => toggleProblem(p.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.checkBox, selected.has(p.id) && styles.checkBoxChecked]}>
                {selected.has(p.id) && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
              <Text style={[styles.checkLabel, selected.has(p.id) && styles.checkLabelActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Other */}
          <TouchableOpacity
            style={[styles.checkRow, otherChecked && styles.checkRowActive]}
            onPress={() => setOtherChecked(v => !v)}
            activeOpacity={0.75}
          >
            <View style={[styles.checkBox, otherChecked && styles.checkBoxChecked]}>
              {otherChecked && <Ionicons name="checkmark" size={13} color="#fff" />}
            </View>
            <Text style={[styles.checkLabel, otherChecked && styles.checkLabelActive]}>Other</Text>
          </TouchableOpacity>

          {otherChecked && (
            <TextInput
              style={styles.otherInput}
              value={otherText}
              onChangeText={setOtherText}
              placeholder="Describe the issue..."
              placeholderTextColor="#C0B0D8"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="done"
            />
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.85}
        >
          <Ionicons name="send" size={18} color={canSubmit ? '#fff' : '#C0A8E8'} />
          <Text style={[styles.submitBtnText, !canSubmit && styles.submitBtnTextDisabled]}>
            Submit Report
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { height: BOTTOM_NAV_H + insets.bottom, paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.replace('/home')}>
          <Ionicons name="home-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="warning" size={24} color={PURPLE} />
          <Text style={[styles.navLabel, styles.navActive]}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/community')}>
          <Ionicons name="mail-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Community</Text>
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
  root: { flex: 1, backgroundColor: '#F7F3FF' },

  /* Compact header */
  headerSafe:   { backgroundColor: PURPLE },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: PURPLE,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 7,
  },
  headerTitle:  { fontSize: 17, fontWeight: '700', color: '#fff', letterSpacing: -0.2 },
  headerSpacer: { width: 36 },

  /* Body */
  body:        { flex: 1 },
  bodyContent: { padding: 20, gap: 16 },

  sectionHeading: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, color: '#111' },
  sectionSub:     { fontSize: 14, color: '#6B6B6B', lineHeight: 21, marginTop: -4 },

  /* Card */
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    gap: 14,
    ...Platform.select({
      ios:     { shadowColor: '#7209B7', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  cardLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardLabel:    { fontSize: 15, fontWeight: '700', color: '#111', letterSpacing: -0.1 },
  required:     { fontSize: 15, color: PURPLE, fontWeight: '700' },
  cardSub:      { fontSize: 13, color: '#8A7AA0', marginTop: -6 },

  /* Photo zone */
  photoZone: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: '#DDD',
    borderRadius: 14, paddingVertical: 28,
    alignItems: 'center', gap: 10, backgroundColor: '#FAFAFA',
  },
  photoZoneActive:  { borderColor: PURPLE, backgroundColor: '#FBF5FF', borderStyle: 'solid' },
  photoPreview:     { width: '100%', height: 180, borderRadius: 10 },
  photoPlaceholder: { fontSize: 14, color: '#AAA', fontWeight: '500' },
  retakeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: PURPLE_LIGHT, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  retakeBtnText: { fontSize: 13, fontWeight: '600', color: PURPLE },

  photoActions: { flexDirection: 'row', gap: 10 },
  cameraBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, backgroundColor: PURPLE, borderRadius: 50, paddingVertical: 13,
  },
  cameraBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  galleryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, backgroundColor: PURPLE_LIGHT, borderRadius: 50, paddingVertical: 13,
    borderWidth: 1.5, borderColor: PURPLE,
  },
  galleryBtnText: { color: PURPLE, fontSize: 14, fontWeight: '600' },

  /* Checklist */
  checkRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F7F2FF', borderRadius: 12,
    padding: 14, borderWidth: 1.5, borderColor: '#EDE3FC',
  },
  checkRowActive: { backgroundColor: '#EFE0FF', borderColor: PURPLE },
  checkBox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: '#C0B0D8',
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  checkBoxChecked:  { backgroundColor: PURPLE, borderColor: PURPLE },
  checkLabel:       { fontSize: 15, fontWeight: '500', color: '#555', flex: 1 },
  checkLabelActive: { color: '#5A0890', fontWeight: '600' },

  otherInput: {
    backgroundColor: '#F7F2FF', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E4D4F8',
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#111', minHeight: 80,
  },

  /* Submit */
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: PURPLE,
    borderRadius: 50, paddingVertical: 18,
    ...Platform.select({
      ios:     { shadowColor: PURPLE, shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 5 },
    }),
  },
  submitBtnDisabled:    { backgroundColor: '#E4D4F8', shadowOpacity: 0 },
  submitBtnText:        { fontSize: 17, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },
  submitBtnTextDisabled:{ color: '#C0A8E8' },

  /* Bottom nav */
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
