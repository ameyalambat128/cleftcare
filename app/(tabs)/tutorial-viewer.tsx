import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import {
  buildPdfViewerHtml,
  getTutorialPdf,
  loadTutorialPdf,
} from "@/lib/tutorialPdfs";

export default function TutorialViewerScreen() {
  const router = useRouter();
  const { document } = useLocalSearchParams<{ document?: string }>();
  const tutorial = getTutorialPdf(document);
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setHtml("");
    setError("");

    loadTutorialPdf(document)
      .then(({ tutorial: loadedTutorial, base64 }) => {
        if (!active) return;
        setHtml(buildPdfViewerHtml(base64, loadedTutorial.title));
      })
      .catch((loadError) => {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load tutorial PDF",
        );
      });

    return () => {
      active = false;
    };
  }, [document]);

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
            {tutorial.title}
          </Text>
          <Text style={styles.subtitle}>{tutorial.language}</Text>
        </View>
      </View>

      {error ? (
        <View style={styles.stateContainer}>
          <Ionicons name="alert-circle-outline" size={34} color={Colors.tint} />
          <Text style={styles.stateTitle}>Could not open tutorial</Text>
          <Text selectable style={styles.stateMessage}>
            {error}
          </Text>
        </View>
      ) : html ? (
        <WebView
          originWhitelist={["*"]}
          source={{ html }}
          style={styles.webView}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color={Colors.tint} />
            </View>
          )}
        />
      ) : (
        <View style={styles.stateContainer}>
          <ActivityIndicator color={Colors.tint} />
          <Text style={styles.stateMessage}>Loading tutorial...</Text>
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
  webView: {
    backgroundColor: Colors.background,
    flex: 1,
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
  loadingOverlay: {
    alignItems: "center",
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: "center",
  },
});
