import Page from "@/components/Page";
import PrimaryButton from "@/components/PrimaryButton";
import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";

export default function Screen() {
  const router = useRouter();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["45%"], []);

  const handleHelpPress = () => {
    router.push("/(modals)/help-center");
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  return (
    <BottomSheetModalProvider>
      <Page
        style={{ flex: 1, backgroundColor: Colors.background }}
        headerShown={false}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Animated.Text
              entering={FadeInLeft.springify()}
              exiting={FadeOutLeft}
              style={styles.title}
            >
              Profile
            </Animated.Text>
          </View>
          <View style={styles.profileContainer}>
            <Image
              source={require("@/assets/images/sample-worker.png")}
              style={styles.profileImage}
            />
            <Text style={styles.roleText}>Community worker</Text>
            <Text style={styles.nameText}>Shreya Jain</Text>

            <View style={styles.detailsContainer}>
              <View style={styles.contactInfo}>
                <Ionicons name="mail-outline" size={18} color={Colors.tint} />
                <Text style={styles.emailText}>rgondal1@asu.edu</Text>
              </View>
              <View style={styles.contactInfo}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={Colors.tint}
                />
                <Text style={styles.locationText}>Tempe, Arizona</Text>
              </View>
            </View>
            <View style={styles.separator} />
          </View>
          <TouchableOpacity style={styles.helpButton} onPress={handleHelpPress}>
            <Text style={styles.helpText}>Need help?</Text>
          </TouchableOpacity>
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          containerStyle={Platform.OS === "ios" && styles.bottomSheetContainer}
          style={styles.bottomSheetContainer}
        >
          <View style={styles.bottomSheetContentContainer}>
            <View style={styles.iconCircle}>
              <Feather name="mail" size={40} color={Colors.tint} />
            </View>
            <Text style={styles.emailUsTitle}>Need Help?</Text>
            <Text style={styles.emailUsText}>
              Please send email us if you need any assistance
            </Text>
            <PrimaryButton
              style={{ marginBottom: 20 }}
              type="small"
              onPress={handleCloseModalPress}
            >
              Email Us
            </PrimaryButton>
          </View>
        </BottomSheetModal>
      </Page>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  profileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "90%",
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 60,
  },
  roleText: {
    marginTop: 24,
    fontSize: 16,
    color: Colors.secondaryText,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 28,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  emailText: {
    marginLeft: 16,
    fontSize: 14,
  },
  locationText: {
    marginLeft: 16,
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: "lightgrey",
    marginVertical: 20,
    width: "60%",
  },
  helpButton: {
    alignItems: "center",
    bottom: 0,
  },
  helpText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.tint,
  },
  bottomSheetContainer: {
    borderTopStartRadius: 20, // Round the top left corner
    borderTopEndRadius: 20, // Round the top right corner
    elevation: 7, // Only works on Android for shadow
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: {
      width: 0,
      height: 4, // Vertical shadow
    },
    shadowOpacity: 0.6, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow blur radius for iOS
    overflow: "hidden", // Ensures the children don't overlap the rounded corners
  },
  bottomSheetContentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    backgroundColor: "#F5F8FF",
    borderRadius: 40,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emailUsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 14,
  },
  emailUsText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: "center",
    marginBottom: 22,
    width: "80%",
  },
});
