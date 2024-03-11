import { useCallback, useMemo, useRef } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import PrimaryButton from "@/components/PrimaryButton";
import { Stack, useRouter } from "expo-router";

export default function Screen() {
  const router = useRouter();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["45%"], []);

  const handleSearchPress = () => {
    router.push("/search-record");
  };

  const handleHelpPress = () => {
    router.push("/(modals)/help-center");
  };

  const handleAddRecordPress = () => {
    router.push("/add-record/");
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const getRecordCount = () => {
    // TODO: Fetch the actual record count
    return 0; // Replace with actual count
  };

  return (
    <BottomSheetModalProvider>
      <Page style={{ flex: 1 }} headerShown={false}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Animated.Text
              entering={FadeInLeft.springify()}
              exiting={FadeOutLeft}
              style={styles.title}
            >
              Cleft Care
            </Animated.Text>
            <View style={styles.iconsContainer}>
              <TouchableOpacity style={styles.icon} onPress={handleSearchPress}>
                <Feather name="search" size={25} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.icon}
                onPress={handleAddRecordPress}
              >
                <Feather name="edit" size={23} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon} onPress={handleHelpPress}>
                <Feather name="mail" size={25} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          {/* View Records Section */}
          <View style={styles.recordsSection}>
            <View style={styles.headerContainer}>
              <Text style={styles.recordsTitle}>View Children record</Text>
              <Text
                style={styles.recordsCount}
              >{`${getRecordCount()} records`}</Text>
            </View>
            {/* Placeholder for no records */}
            {getRecordCount() === 0 && (
              <View style={styles.noRecordsContainer}>
                <Feather name="edit" size={23} color={Colors.secondaryText} />
                <Text style={styles.noRecordsText}>
                  Children's records are empty.
                </Text>
                <Text style={styles.noRecordsSubtext}>
                  Please add a new one.
                </Text>
              </View>
            )}
            {/* You may want to use a FlatList or ScrollView here to display the records */}
          </View>
        </View>

        {/* Email Us Bottom Sheet */}
        {/* <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          containerStyle={Platform.OS === "ios" && styles.bottomSheetContainer}
          style={Platform.OS === "android" && styles.bottomSheetContainer}
        >
          <View style={styles.bottomSheetContentContainer}>
            <View style={styles.iconCircle}>
              <Feather name="mail" size={40} color={Colors.tint} />
            </View>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
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
        </BottomSheetModal> */}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    marginLeft: 25,
  },
  bottomSheetContainer: {
    borderTopStartRadius: 20, // Round the top left corner
    borderTopEndRadius: 20, // Round the top right corner
    elevation: 7, // Only works on Android for shadow
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: {
      width: 0,
      height: 4,
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
  helpTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 14,
  },
  helpText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: "center",
    marginBottom: 22,
    width: "80%",
  },
  recordsSection: {
    paddingTop: 30,
    alignItems: "center",
    height: "94%",
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  recordsCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.tint,
  },
  noRecordsContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  noRecordsText: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 20,
  },
  noRecordsSubtext: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 10,
  },
});
