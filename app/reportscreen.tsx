import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
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

type Tab = 'report' | 'track';

const PROBLEMS = [
  { id: 'elevator',  label: 'Broken Elevator'  },
  { id: 'path',      label: 'Obstructed Path'   },
  { id: 'entrances', label: 'Blocked Entrances' },
  { id: 'ramps',     label: 'Misuse of Ramps'   },
];

const PURPLE      = '#A855D8';
const LIGHT_PURPLE = '#f3e8ff';

export default function ReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab,    setActiveTab]    = useState<Tab>('report');
  const [selected,     setSelected]     = useState<Set<string>>(new Set());
  const [otherChecked, setOtherChecked] = useState(false);
  const [otherText,    setOtherText]    = useState('');
  const [photo,        setPhoto]        = useState<string | null>(null);

  const toggleProblem = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

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

  const canSubmit = selected.size > 0 || otherChecked;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Ionicons name="camera" size={26} color="#fff" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Report</Text>
          <Text style={styles.headerSub}>Snap, Report, Improve campus access</Text>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'report' && styles.tabActive]}
            onPress={() => setActiveTab('report')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'report' && styles.tabTextActive]}>
              + Report Problem
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'track' && styles.tabActive]}
            onPress={() => setActiveTab('track')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'track' && styles.tabTextActive]}>
              ☰ Track Reports
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'report' ? (
          <>
            <Text style={styles.sectionTitle}>Report a Problem</Text>

            <View style={styles.subHeadingRow}>
              <Ionicons name="camera-outline" size={20} color="#1a1a1a" />
              <Text style={styles.subHeading}>Report a Problem</Text>
            </View>

            <Text style={styles.description}>
              Snap a photo and we'll take care of the rest. Your location and timestamp will be automatically recorded.
            </Text>

            {/* Card */}
            <View style={styles.card}>
              {/* Capture label */}
              <View style={styles.captureLabelRow}>
                <Ionicons name="camera-outline" size={18} color="#1a1a1a" />
                <Text style={styles.captureLabel}> Capture Problem Photo *</Text>
              </View>

              {/* Photo zone */}
              <View style={[styles.photoZone, photo ? styles.photoZoneActive : null]}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photoPreview} resizeMode="cover" />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={36} color="#aaa" />
                    <Text style={styles.photoLabel}>Take a Photo of the Problem</Text>
                  </>
                )}
                <View style={styles.photoButtons}>
                  <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto} activeOpacity={0.85}>
                    <Ionicons name="camera-outline" size={16} color="#fff" />
                    <Text style={styles.cameraBtnText}>Open Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.galleryBtn} onPress={pickFromGallery} activeOpacity={0.85}>
                    <Ionicons name="images-outline" size={16} color={PURPLE} />
                    <Text style={styles.galleryBtnText}>Choose from Gallery</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Problem checklist */}
              <View style={styles.problemBox}>
                <Text style={styles.problemInstruction}>
                  Please select from one of the problems below or select Other if not listed.
                </Text>

                {PROBLEMS.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.checkRow}
                    onPress={() => toggleProblem(p.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkBox, selected.has(p.id) && styles.checkBoxChecked]}>
                      {selected.has(p.id) && <Ionicons name="checkmark" size={14} color="#fff" />}
                    </View>
                    <Text style={styles.checkLabel}>{p.label}</Text>
                  </TouchableOpacity>
                ))}

                {/* Other */}
                <View style={styles.otherRow}>
                  <TouchableOpacity
                    style={[styles.checkBox, otherChecked && styles.checkBoxChecked]}
                    onPress={() => setOtherChecked(v => !v)}
                    activeOpacity={0.7}
                  >
                    {otherChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </TouchableOpacity>
                  <Text style={styles.checkLabel}>Other:</Text>
                  <TextInput
                    style={[styles.otherInput, !otherChecked && styles.otherInputDisabled]}
                    value={otherText}
                    onChangeText={setOtherText}
                    editable={otherChecked}
                    placeholder="Describe the issue"
                    placeholderTextColor="#bbb"
                    returnKeyType="done"
                  />
                </View>
              </View>

              {/* Submit */}
              <TouchableOpacity
                style={[styles.submitBtn, canSubmit && styles.submitBtnActive]}
                activeOpacity={0.85}
                disabled={!canSubmit}
              >
                <Ionicons name="send" size={16} color={canSubmit ? '#fff' : PURPLE} />
                <Text style={[styles.submitBtnText, canSubmit && styles.submitBtnTextActive]}>
                  Submit Report
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.comingSoon}>
            <Ionicons name="list-outline" size={48} color="#ccc" />
            <Text style={styles.comingSoonText}>Track Reports coming soon</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom, height: 60 + insets.bottom }]}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={() => router.push('/home')}>
          <Ionicons name="home-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="warning" size={24} color={PURPLE} />
          <Text style={[styles.navLabel, { color: PURPLE, fontWeight: '700' }]}>Report</Text>
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
  root: { flex: 1, backgroundColor: '#f9fafb' },

  header: {
    backgroundColor: PURPLE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  headerSub:   { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  body:        { flex: 1 },
  bodyContent: { padding: 20, gap: 16, paddingBottom: 8 },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 4,
    gap: 4,
    alignSelf: 'flex-start',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
      android: { elevation: 2 },
    }),
  },
  tab: {
    borderRadius: 50,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  tabActive:    { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  tabText:      { fontSize: 13, fontWeight: '500', color: '#888' },
  tabTextActive:{ color: '#1a1a1a', fontWeight: '600' },

  sectionTitle: { fontSize: 24, fontWeight: '800', color: '#1a1a1a', letterSpacing: -0.4 },

  subHeadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  subHeading:    { fontSize: 17, fontWeight: '600', color: '#1a1a1a' },

  description: { fontSize: 14, color: '#666', lineHeight: 21, marginTop: -8 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    gap: 16,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },

  captureLabelRow: { flexDirection: 'row', alignItems: 'center' },
  captureLabel:    { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },

  photoZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fafafa',
  },
  photoZoneActive: { borderColor: PURPLE, backgroundColor: '#fdf4ff' },
  photoPreview:    { width: '100%', height: 180, borderRadius: 8 },
  photoLabel:      { fontSize: 15, color: '#555', fontWeight: '500' },

  photoButtons: { gap: 8, width: '100%', maxWidth: 220 },
  cameraBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: PURPLE,
    borderRadius: 50, paddingVertical: 12, paddingHorizontal: 20,
  },
  cameraBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  galleryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: PURPLE,
    borderRadius: 50, paddingVertical: 12, paddingHorizontal: 20,
  },
  galleryBtnText: { color: PURPLE, fontSize: 14, fontWeight: '600' },

  problemBox: {
    borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12,
    padding: 16, gap: 12,
  },
  problemInstruction: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', lineHeight: 20 },

  checkRow:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkBox: {
    width: 22, height: 22, borderRadius: 5,
    borderWidth: 1.5, borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  checkBoxChecked: { backgroundColor: PURPLE, borderColor: PURPLE },
  checkLabel:      { fontSize: 14, color: '#333' },

  otherRow:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  otherInput: {
    flex: 1,
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: Platform.OS === 'ios' ? 8 : 5,
    fontSize: 14, color: '#333', backgroundColor: '#fafafa',
  },
  otherInputDisabled: { opacity: 0.4 },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: LIGHT_PURPLE,
    borderRadius: 50, paddingVertical: 16,
  },
  submitBtnActive:    { backgroundColor: PURPLE },
  submitBtnText:      { fontSize: 16, fontWeight: '700', color: PURPLE },
  submitBtnTextActive:{ color: '#fff' },

  comingSoon:     { alignItems: 'center', paddingTop: 60, gap: 12 },
  comingSoonText: { fontSize: 16, color: '#888' },

  bottomNav: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee',
  },
  navItem:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  navLabel: { fontSize: 11, color: '#888' },
});
