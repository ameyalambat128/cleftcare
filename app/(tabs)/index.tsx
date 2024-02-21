import { useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import PrimaryButton from "@/components/PrimaryButton";
import { Stack, useRouter } from "expo-router";

export default function Screen() {
  const router = useRouter();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["45%"], []);

  const handleSearchPress = () => {
    router.push("/searchRecord");
  };

  const handleAddRecordPress = () => {
    router.push("/addRecord");
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  return (
    <BottomSheetModalProvider>
      <Page style={{ flex: 1 }} headerShown={false}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Cleft Care</Text>
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
              <TouchableOpacity
                style={styles.icon}
                onPress={handlePresentModalPress}
              >
                <Feather name="mail" size={25} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          // bottomInset={24}
          // detached={true}
          style={styles.bottomSheetContainer}
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
    // marginHorizontal: 24,
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
    color: "#7C7C7C",
    textAlign: "center",
    marginBottom: 22,
    width: "80%",
  },
});
