import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const ACCESSIBILITY_OPTIONS = [
  "Accessible flooring",
  "Wide pathways",
  "Level access",
  "Elevator access",
  "Braille signage",
  "Audio cues",
];

const COLORS = {
  primary: "#2D1B69",
  primaryLight: "#EDE8FF",
  accent: "#7C5CDB",
  accentHover: "#6347C7",
  text: "#1A1A2E",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  background: "#FAFAFA",
  white: "#FFFFFF",
  tagBg: "#EDE8FF",
  tagText: "#2D1B69",
  checkmark: "#7C5CDB",
};

interface ProfilePageProps {
  name?: string;
  joinDate?: string;
  home?: string;
  avatarUri?: string;
  onPastReports?: () => void;
}

export default function ProfilePage({
  name = "Caprice Johnson",
  joinDate = "April 30th, 2026",
  home = "123 45th ave SE",
  avatarUri,
  onPastReports,
}: ProfilePageProps) {
  const firstName = name.split(" ")[0];

  const [editableName, setEditableName] = useState(name);
  const [editableHome, setEditableHome] = useState(home);
  const [editingName, setEditingName] = useState(false);
  const [editingHome, setEditingHome] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([
    "Wide pathways",
    "Level access",
  ]);
  const [scheduleFiles, setScheduleFiles] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const handleUploadPress = () => {
    // In a real app, integrate with expo-document-picker or react-native-document-picker
    Alert.alert(
      "Upload Schedule",
      "Connect a file picker library to enable uploads.",
    );
  };

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    );
  };

  const removeTag = (option: string) => {
    setSelected((prev) => prev.filter((o) => o !== option));
  };

  const handleSave = () => {
    setSaved(true);
    setEditingName(false);
    setEditingHome(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarEmoji}>⭐</Text>
            </View>
          )}
        </View>

        {/* Greeting */}
        <View style={styles.greetingRow}>
          <Text style={styles.greetingBold}>Hi, </Text>
          <Text style={styles.greetingName}>{firstName}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.joinDate}>Joined {joinDate}</Text>

        {/* Name Field */}
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputRow}>
          {editingName ? (
            <TextInput
              style={[styles.input, styles.inputActive]}
              value={editableName}
              onChangeText={setEditableName}
              autoFocus
              onBlur={() => setEditingName(false)}
              returnKeyType="done"
              onSubmitEditing={() => setEditingName(false)}
            />
          ) : (
            <TouchableOpacity
              style={styles.inputTouchable}
              onPress={() => setEditingName(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.inputText}>{editableName}</Text>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Home Field */}
        <Text style={styles.label}>Home</Text>
        <View style={styles.inputRow}>
          {editingHome ? (
            <TextInput
              style={[styles.input, styles.inputActive]}
              value={editableHome}
              onChangeText={setEditableHome}
              autoFocus
              onBlur={() => setEditingHome(false)}
              returnKeyType="done"
              onSubmitEditing={() => setEditingHome(false)}
            />
          ) : (
            <TouchableOpacity
              style={styles.inputTouchable}
              onPress={() => setEditingHome(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.inputText}>{editableHome}</Text>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Accessibility Needs */}
        <Text style={styles.label}>Accessibility Needs</Text>

        {/* Tag Row + Chevron */}
        <View style={styles.tagRow}>
          <View style={styles.tagsContainer}>
            {selected.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity
                  onPress={() => removeTag(tag)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.tagX}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => setDropdownOpen((o) => !o)}
            style={styles.chevronBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.chevron}>{dropdownOpen ? "▲" : "▼"}</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown */}
        {dropdownOpen && (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownHint}>Select all that apply</Text>
            {ACCESSIBILITY_OPTIONS.map((option) => {
              const checked = selected.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={styles.checkRow}
                  onPress={() => toggleOption(option)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[styles.checkbox, checked && styles.checkboxChecked]}
                  >
                    {checked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkLabel}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Schedule */}
        <Text style={[styles.label, { marginTop: 20 }]}>Schedule</Text>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={handleUploadPress}
          activeOpacity={0.7}
        >
          <Text style={styles.uploadLink}>Upload files...</Text>
          <View style={styles.uploadDivider} />
          <Text style={styles.uploadDrop}>⬆ Drop files here</Text>
        </TouchableOpacity>

        {scheduleFiles.length > 0 && (
          <View style={styles.fileList}>
            {scheduleFiles.map((f, i) => (
              <View key={i} style={styles.fileRow}>
                <Text style={styles.fileName}>{f}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setScheduleFiles((prev) => prev.filter((_, j) => j !== i))
                  }
                >
                  <Text style={styles.fileRemove}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Past Reports */}
        <TouchableOpacity
          style={styles.pastReportsRow}
          onPress={onPastReports}
          activeOpacity={0.7}
        >
          <Text style={styles.pastReportsLabel}>Past Reports</Text>
          <Text style={styles.pastReportsChevron}>›</Text>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnSuccess]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>
            {saved ? "Saved ✓" : "Save changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: width * 0.06,
    paddingTop: 24,
    paddingBottom: 48,
  },

  /* Avatar */
  avatarWrapper: {
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarFallback: {
    backgroundColor: "#F9BFCA",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 36,
  },

  /* Greeting */
  greetingRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 6,
  },
  greetingBold: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  greetingName: {
    fontSize: 32,
    fontWeight: "400",
    color: COLORS.text,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 6,
  },
  joinDate: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 28,
    fontStyle: "italic",
  },

  /* Labels */
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  /* Input */
  inputRow: {
    marginBottom: 20,
  },
  inputTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.text,
  },
  inputActive: {
    borderColor: COLORS.accent,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  editIcon: {
    fontSize: 15,
    color: COLORS.textMuted,
  },

  /* Tags */
  tagRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginBottom: 0,
  },
  tagsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.tagBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
  },
  tagText: {
    fontSize: 13,
    color: COLORS.tagText,
    fontWeight: "500",
  },
  tagX: {
    fontSize: 11,
    color: COLORS.tagText,
    fontWeight: "700",
  },
  chevronBtn: {
    paddingLeft: 8,
    paddingTop: 2,
  },
  chevron: {
    fontSize: 13,
    color: COLORS.textMuted,
  },

  /* Dropdown */
  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 14,
    paddingBottom: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  dropdownHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 10,
    marginBottom: 8,
    fontStyle: "italic",
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.checkmark,
    borderColor: COLORS.checkmark,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
  checkLabel: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "400",
  },

  /* Schedule Upload */
  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 4,
  },
  uploadLink: {
    fontSize: 15,
    color: COLORS.accent,
    fontWeight: "500",
  },
  uploadDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  uploadDrop: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  fileList: {
    marginBottom: 4,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  fileName: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
  fileRemove: {
    fontSize: 12,
    color: COLORS.textMuted,
    paddingLeft: 8,
  },

  /* Past Reports */
  pastReportsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 20,
  },
  pastReportsLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  pastReportsChevron: {
    fontSize: 22,
    color: COLORS.textMuted,
    lineHeight: 24,
  },

  /* Save Button */
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveBtnSuccess: {
    backgroundColor: "#22875A",
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
