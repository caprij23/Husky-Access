import React from "react";
import {
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#2D1B69",
  text: "#1A1A2E",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  background: "#FAFAFA",
  white: "#FFFFFF",
};

export interface Report {
  id: string;
  title: string;
  imageUri?: string;
  date?: string;
}

interface PastReportsPageProps {
  name?: string;
  joinDate?: string;
  avatarUri?: string;
  reports?: Report[];
  onBack?: () => void;
  onReportPress?: (report: Report) => void;
}

const DEFAULT_REPORTS: Report[] = [
  {
    id: "1",
    title: "May 2nd - broken elevator at Kane Hall",
    imageUri: undefined,
  },
  {
    id: "2",
    title: "May 7th - broken table in Kane 130",
    imageUri: undefined,
  },
];

export default function PastReportsPage({
  name = "Caprice Johnson",
  joinDate = "April 30th, 2026",
  avatarUri,
  reports = DEFAULT_REPORTS,
  onBack,
  onReportPress,
}: PastReportsPageProps) {
  const firstName = name.split(" ")[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
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

        {/* Back + Title */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backChevron}>‹</Text>
          <Text style={styles.backLabel}>Past Reports</Text>
        </TouchableOpacity>

        {/* Report Cards */}
        {reports.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={styles.card}
            onPress={() => onReportPress?.(report)}
            activeOpacity={0.75}
          >
            <Text style={styles.cardTitle}>{report.title}</Text>
            {report.imageUri ? (
              <Image
                source={{ uri: report.imageUri }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.cardImagePlaceholder}>
                <Text style={styles.cardImagePlaceholderText}>📎 No image</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
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
    marginBottom: 24,
    fontStyle: "italic",
  },

  /* Back row */
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 4,
  },
  backChevron: {
    fontSize: 26,
    color: COLORS.text,
    lineHeight: 28,
    marginTop: -2,
  },
  backLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  /* Cards */
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    padding: 14,
    paddingBottom: 10,
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  cardImagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImagePlaceholderText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
