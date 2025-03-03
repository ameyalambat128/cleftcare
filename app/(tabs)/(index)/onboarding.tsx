import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";

export default function HomeOnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: "Welcome to Cleft Care",
      message:
        "This app helps you manage and record speech data for children with cleft palate",
      position: {
        top: "30%",
        left: "10%",
        right: "10%",
      },
      arrowPosition: null,
    },
    {
      title: "Add New Records",
      message: "Create new patient records by tapping the pencil icon here",
      position: { top: 90, right: "5%", left: "30%" },
      arrowPosition: {
        top: -10,
        right: 65,
        transform: [{ translateX: 15 }, { rotate: "180deg" }],
      },
    },
    {
      title: "Search Records",
      message: "Quickly find patient records by tapping the search icon",
      position: { top: 90, right: "5%", left: "30%" },
      arrowPosition: {
        top: -10,
        right: 115,
        transform: [{ translateX: 15 }, { rotate: "180deg" }],
      },
    },
    {
      title: "Help Center",
      message: "Access the help center by tapping the mail icon",
      position: { top: 90, right: "2%", left: "30%" },
      arrowPosition: {
        top: -10,
        right: 25,
        transform: [{ translateX: 10 }, { rotate: "180deg" }],
      },
    },
    {
      title: "Home Tab",
      message: "Return to the main screen to manage patient records",
      position: { bottom: 40, right: "35%", left: "5%" },
      arrowPosition: {
        bottom: -10,
        right: 180,
        transform: [{ rotate: "0deg" }],
      },
    },
    {
      title: "Record Audio Tab",
      message:
        "Record speech samples for evaluating children's progress. Only use after creating a new patient.",
      position: { bottom: 40, right: "30%", left: "15%" },
      arrowPosition: {
        bottom: -10,
        right: 115,
        transform: [{ rotate: "0deg" }],
      },
    },
    {
      title: "Tutorials Tab",
      message:
        "Find helpful guides and training materials for using Cleft Care",
      position: { bottom: 40, right: "10%", left: "30%" },
      arrowPosition: {
        bottom: -10,
        right: 95,
        transform: [{ rotate: "0deg" }],
      },
    },
    {
      title: "Profile Tab",
      message: "Access your community worker profile and account settings",
      position: { bottom: 40, right: "5%", left: "20%" },
      arrowPosition: {
        bottom: -10,
        right: 20,
        transform: [{ rotate: "0deg" }],
      },
    },
    {
      title: "Edit Records",
      message: "Tap on any patient record to view and edit their details",
      position: { top: "40%", left: "10%", right: "10%" },
    },
    {
      title: "All Set!",
      message: "You're now ready to use Cleft Care",
      position: {
        top: "30%",
        left: "10%",
        right: "10%",
        height: "35%",
        gap: 40,
      },
      arrowPosition: null,
    },
  ];

  useEffect(() => {
    const checkOnboarded = async () => {
      const onboarded = await AsyncStorage.getItem("home-onboarded");
      if (onboarded === "true") {
        router.replace("/(tabs)/(index)/");
      }
    };

    checkOnboarded();
  }, []);

  const handleNextOnboardingStep = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await AsyncStorage.setItem("home-onboarded", "true");
      router.replace("/(tabs)/(index)/");
    }
  };

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={false}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.overlay}>
        <View
          style={[
            styles.overlayContent,
            // @ts-ignore
            onboardingSteps[currentStep].position,
          ]}
        >
          <Text
            style={[
              styles.helpText,
              { fontWeight: "bold", fontSize: 18, marginBottom: 2 },
              currentStep === onboardingSteps.length - 1 && {
                fontWeight: "bold",
                fontSize: 24,
                marginBottom: 2,
              },
            ]}
          >
            {onboardingSteps[currentStep].title}
          </Text>
          <Text style={styles.helpText}>
            {onboardingSteps[currentStep].message}
          </Text>
          {onboardingSteps[currentStep].arrowPosition && (
            <View
              style={[
                styles.arrow,
                // @ts-ignore
                onboardingSteps[currentStep].arrowPosition,
              ]}
            />
          )}
          <TouchableOpacity
            style={[
              styles.nextButton,
              currentStep === onboardingSteps.length - 1 && {
                paddingVertical: 16,
                paddingHorizontal: 32,
              },
            ]}
            onPress={handleNextOnboardingStep}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === onboardingSteps.length - 1
                ? "Get Started"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mock Home Screen UI */}
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Cleft Care</Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.icon}>
              <Feather name="search" size={25} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Feather name="edit" size={23} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Feather name="mail" size={25} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recordsContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.recordsTitle}>View Records</Text>
            <Text style={styles.recordsCount}>3 records</Text>
          </View>

          <View style={styles.recordListContainer}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.recordItem}>
                <Text style={styles.recordName}>Patient {i}</Text>
                <Text style={styles.recordDate}>DOB: 01/01/2010</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 1,
  },
  overlayContent: {
    position: "absolute",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.tint,
    zIndex: 2,
  },
  arrow: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
    zIndex: 3,
  },
  helpText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: Colors.tint,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 10,
  },
  nextButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  recordsContainer: {
    paddingTop: 30,
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
  recordListContainer: {
    marginTop: 20,
  },
  recordItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  recordName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recordDate: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 5,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    height: 60,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
