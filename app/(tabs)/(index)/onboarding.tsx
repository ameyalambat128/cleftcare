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
  const [completed, setCompleted] = useState(false);

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
        right: 185,
        transform: [{ rotate: "0deg" }],
      },
    },

    {
      title: "Tutorials Tab",
      message:
        "Find helpful guides and training materials for using Cleft Care",
      position: { bottom: 40, right: "20%", left: "20%" },
      arrowPosition: {
        bottom: -10,
        right: 110,
        transform: [{ rotate: "0deg" }],
      },
    },
    {
      title: "Profile Tab",
      message: "Access your community worker profile and account settings",
      position: { bottom: 40, right: "5%", left: "20%" },
      arrowPosition: {
        bottom: -10,
        right: 35,
        transform: [{ rotate: "0deg" }],
      },
    },
    {
      title: "Edit Records",
      message: "Tap on any patient record to view and edit their details",
      position: { top: "40%", left: "10%", right: "10%" },
    },
    {
      title: "Recording Tutorial",
      message: "Next, let's learn how to record speech samples",
      position: {
        top: "30%",
        left: "10%",
        right: "10%",
        height: "35%",
      },
      arrowPosition: null,
      showSpecialButton: true,
    },
    {
      title: "Start-Stop Audio",
      message:
        "Press the Audio icon to start recording children's voice. Make sure to record audio in a quiet place",
      position: { bottom: 110, left: "10%", right: "10%" },
      arrowPosition: {
        top: -10,
        left: "50%",
        transform: [{ translateX: 10 }, { rotate: "180deg" }],
      },
      showRecordUI: true,
    },
    {
      title: "Predefined Statement",
      message:
        "First, carefully speak predefined sentence in front of children",
      position: { top: 340, left: "10%", right: "10%" },
      arrowPosition: {
        top: -10,
        left: "50%",
        transform: [{ translateX: 10 }, { rotate: "180deg" }],
      },
      showRecordUI: true,
    },
    {
      title: "Next Button",
      message:
        "Next button will be enabled once you record the audio in current screen",
      position: { top: "10%", left: "20%", right: "2%" },
      arrowPosition: {
        top: -10,
        right: 30,
        transform: [{ translateX: 10 }, { rotate: "180deg" }],
      },
      showRecordUI: true,
    },
    {
      title: "All Set!",
      message:
        "You've completed the onboarding and are ready to use Cleft Care!",
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
      const userId = await AsyncStorage.getItem("user-id");
      if (userId) {
        const onboarded = await AsyncStorage.getItem(
          `home-onboarded-${userId}`
        );
        if (onboarded === "true") {
          router.replace("/(tabs)/(index)/");
        }
      }
    };

    checkOnboarded();
  }, []);

  const handleNextOnboardingStep = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleCompleteOnboarding();
    }
  };

  const handleCompleteOnboarding = async () => {
    const userId = await AsyncStorage.getItem("user-id");
    if (userId) {
      await AsyncStorage.setItem(`home-onboarded-${userId}`, "true");
    }
    router.replace("/(tabs)/(index)");
  };

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={false}
    >
      {/* Custom header for recording UI steps */}
      {onboardingSteps[currentStep].showRecordUI && (
        <View style={styles.customHeader}>
          <TouchableOpacity
            onPress={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
            style={styles.headerButton}
          >
            <Ionicons name="chevron-back-outline" size={24} color="black" />
            <Text style={styles.headerButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNextOnboardingStep}
            style={styles.headerButton}
          >
            <Text style={[styles.headerButtonText, { color: Colors.tint }]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
              (currentStep === onboardingSteps.length - 1 ||
                currentStep === 8) && {
                // The transition step
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
              (currentStep === onboardingSteps.length - 1 ||
                onboardingSteps[currentStep].showSpecialButton) && {
                paddingVertical: 16,
                paddingHorizontal: 32,
              },
            ]}
            onPress={handleNextOnboardingStep}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === onboardingSteps.length - 1
                ? "Get Started"
                : onboardingSteps[currentStep].showSpecialButton
                ? "Continue to Recording"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Show appropriate UI based on step */}
      {!onboardingSteps[currentStep].showRecordUI ? (
        /* Original Home UI mockup */
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
      ) : (
        /* Record Screen UI mockup */
        <View style={styles.container}>
          <View style={styles.bodyContainer}>
            <Text style={styles.bodyText}>
              Prompt: Speak predefined sentence
            </Text>
            <TouchableOpacity style={styles.recordButton}>
              <Feather name="mic" size={40} color="black" />
            </TouchableOpacity>
            <Text style={styles.instructions}>Press the mic to record</Text>
          </View>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>1/</Text>
            <Text style={styles.finalProgressText}>25</Text>
          </View>
        </View>
      )}
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
  headerRightText: {
    fontSize: 16,
    fontWeight: "bold",
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
    zIndex: 2,
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
  bodyContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "90%",
  },
  bodyText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  recordButton: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0E5E5",
  },
  instructions: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: "center",
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  progressText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.tint,
  },
  finalProgressText: {
    fontSize: 18,
    color: Colors.secondaryText,
  },
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
