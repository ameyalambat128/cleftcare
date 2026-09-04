import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import { getTutorialVideo } from "@/lib/tutorialVideos";

export default function TutorialVideoViewerScreen() {
  const router = useRouter();
  const { video } = useLocalSearchParams<{ video?: string }>();
  const tutorial = getTutorialVideo(video);
  const player = useVideoPlayer(tutorial?.asset ?? null);
  const playerState = useEvent(player, "statusChange", {
    status: player.status,
  });

  const errorMessage = !tutorial
    ? "This tutorial video is unavailable."
    : playerState.status === "error"
      ? (playerState.error?.message ?? "Unable to play this tutorial video.")
      : "";

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={28} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {tutorial?.title ?? "Tutorial Video"}
          </Text>
          {tutorial ? (
            <Text style={styles.subtitle}>{tutorial.language}</Text>
          ) : null}
        </View>
      </View>

      {errorMessage ? (
        <View style={styles.stateContainer}>
          <Ionicons name="alert-circle-outline" size={34} color={Colors.tint} />
          <Text style={styles.stateTitle}>Could not open video</Text>
          <Text selectable style={styles.stateMessage}>
            {errorMessage}
          </Text>
        </View>
      ) : (
        <View style={styles.playerContainer}>
          <VideoView
            player={player}
            style={styles.video}
            contentFit="contain"
            nativeControls
            fullscreenOptions={{ enable: true, orientation: "portrait" }}
          />
          {playerState.status === "loading" ? (
            <View style={styles.loadingOverlay} pointerEvents="none">
              <ActivityIndicator color="#FFFFFF" size="large" />
            </View>
          ) : null}
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  backButton: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    color: Colors.secondaryText,
    fontSize: 13,
    marginTop: 2,
  },
  playerContainer: {
    backgroundColor: "#000000",
    flex: 1,
    justifyContent: "center",
  },
  video: {
    alignSelf: "center",
    aspectRatio: 9 / 20,
    height: "100%",
    maxWidth: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  stateContainer: {
    alignItems: "center",
    flex: 1,
    gap: 10,
    justifyContent: "center",
    padding: 24,
  },
  stateTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  stateMessage: {
    color: Colors.secondaryText,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
});
