import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import { tutorialPdfs } from "@/lib/tutorialPdfs";
import { tutorialVideos } from "@/lib/tutorialVideos";

export default function Screen() {
  const router = useRouter();

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={false}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.headerContainer}>
          <Animated.Text
            entering={FadeInLeft.springify()}
            exiting={FadeOutLeft}
            style={styles.title}
          >
            Tutorials
          </Animated.Text>
          <Text style={styles.subtitle}>
            Open CleftCare guides for training and reference.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video tutorials</Text>
          <View style={styles.list}>
            {tutorialVideos.map((tutorial) => (
              <TouchableOpacity
                accessibilityRole="button"
                key={tutorial.id}
                onPress={() =>
                  router.push({
                    pathname: "/tutorial-video-viewer",
                    params: { video: tutorial.id },
                  } as never)
                }
                style={styles.card}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="play-circle-outline"
                    size={26}
                    color={Colors.tint}
                  />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{tutorial.title}</Text>
                  <Text style={styles.cardDescription}>
                    {tutorial.description}
                  </Text>
                  <Text style={styles.cardMeta}>{tutorial.duration} video</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={Colors.secondaryText}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Written guides</Text>
          <View style={styles.list}>
            {tutorialPdfs.map((tutorial) => (
              <TouchableOpacity
                accessibilityRole="button"
                key={tutorial.id}
                onPress={() =>
                  router.push({
                    pathname: "/tutorial-viewer",
                    params: { document: tutorial.id },
                  } as never)
                }
                style={styles.card}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color={Colors.tint}
                  />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{tutorial.title}</Text>
                  <Text style={styles.cardDescription}>
                    {tutorial.description}
                  </Text>
                  <Text style={styles.cardMeta}>9-page PDF</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={Colors.secondaryText}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 22,
    padding: 20,
    paddingBottom: 36,
  },
  headerContainer: {
    alignItems: "flex-start",
    gap: 6,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    color: Colors.secondaryText,
    fontSize: 15,
    lineHeight: 22,
  },
  list: {
    gap: 12,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 16,
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: "#F1F7FF",
    borderRadius: 8,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  cardTextContainer: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  cardDescription: {
    color: Colors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
  },
  cardMeta: {
    color: Colors.tint,
    fontSize: 13,
    fontWeight: "600",
  },
});
