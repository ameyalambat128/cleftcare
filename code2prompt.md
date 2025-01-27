Project Path: cleftCare

Source Tree:

```
cleftCare
├── app
│   ├── login.tsx
│   ├── (tabs)
│   │   ├── record
│   │   │   ├── three.tsx
│   │   │   ├── index.tsx
│   │   │   ├── twentyfive.tsx
│   │   │   ├── two.tsx
│   │   │   ├── onboarding.tsx
│   │   │   └── _layout.tsx
│   │   ├── profile.tsx
│   │   ├── _layout.tsx
│   │   ├── (index)
│   │   │   ├── index.tsx
│   │   │   ├── search-record.tsx
│   │   │   ├── _layout.tsx
│   │   │   ├── edit-record
│   │   │   │   └── [userId].tsx
│   │   │   └── add-record
│   │   │       ├── index.tsx
│   │   │       ├── add-signature.tsx
│   │   │       ├── parent-consent.tsx
│   │   │       └── _layout.tsx
│   │   └── tutorials.tsx
│   ├── +not-found.tsx
│   ├── _layout.tsx
│   ├── (auth)
│   └── (modals)
│       └── help-center.tsx
├── app.json
├── bun.lockb
├── constants
│   ├── Colors.ts
│   └── SampleData.ts
├── README.md
├── components
│   ├── ExternalLink.tsx
│   ├── RecordItem.tsx
│   ├── PrimaryButton.tsx
│   ├── useColorScheme.ts
│   ├── SignatureBox.tsx
│   └── Page.tsx
├── babel.config.js
├── package.json
├── lib
│   ├── utils.ts
│   ├── api.ts
│   ├── aws.ts
│   └── store.ts
├── tsconfig.json
├── i18n
│   └── locales
│       ├── en.json
│       └── kn.json
└── assets
    ├── images
    │   ├── icon.png
    │   ├── sample-worker.png
    │   ├── favicon.png
    │   ├── splash.png
    │   ├── adaptive-icon.png
    │   ├── cleftcare-icon.png
    │   ├── splash-alt.png
    │   └── splash-expo.png
    ├── videos
    └── fonts
        └── SpaceMono-Regular.ttf

```

`cleftCare/app/login.tsx`:

```tsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

import Colors from "@/constants/Colors";
import Page from "@/components/Page";
import PrimaryButton from "@/components/PrimaryButton";
import { testProdApi, validateLogin } from "@/lib/api";

const LANGUAGE_STORAGE_KEY = "user-language";

export default function Screen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState<"Kannada" | "English">();
  const [emailError, setEmailError] = useState("");
  const [languageError, setLanguageError] = useState("");
  const [isLanguagePickerVisible, setIsLanguagePickerVisible] =
    useState<boolean>(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getInputStyle = (inputValue: string) => ({
    borderColor:
      !inputValue && hasAttemptedSubmit
        ? "red"
        : inputValue
        ? Colors.tint
        : "#E5E7EB",
  });

  const getIconColor = (inputValue: string): string => {
    return !inputValue && hasAttemptedSubmit
      ? "red"
      : inputValue
      ? Colors.tint
      : Colors.secondaryText;
  };

  const handleInputChange = (
    newValue: string,
    setFunction: React.Dispatch<React.SetStateAction<string>>,
    setError: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (newValue !== "") {
      setError("");
    }
    setFunction(newValue);
  };

  const handlePickerChange = async (itemValue: "Kannada" | "English") => {
    setLanguageError("");
    setLanguage(itemValue);

    // Map the selected language to the corresponding language code
    const languageCode = itemValue === "Kannada" ? "kn" : "en";

    // Save selected language to AsyncStorage and update i18n
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    i18n.changeLanguage(languageCode);
    setIsLanguagePickerVisible(false);
  };

  const validEmails = ["krupa@asu.edu", "alambat@asu.edu", "test@asu.edu"];

  const validateWithBackend = async (email: string) => {
    setIsLoading(true);
    setEmailError(""); // Clear any previous errors

    try {
      const test = testProdApi();
      console.log("Test API response:", test);
      const response = await validateLogin(email);

      if (response?.role) {
        await AsyncStorage.setItem("user-role", response.role);
        await AsyncStorage.setItem("user-id", response.communityWorkerId);
        await AsyncStorage.setItem("user-email", email);

        router.replace("/");
        return true;
      } else {
        setEmailError("* The Email ID you entered is not registered");
        return false;
      }
    } catch (error: any) {
      if (error?.error) {
        setEmailError("* The Email ID you entered is not registered");
      } else {
        console.log(
          "Error validating login:",
          error.response?.data || error.message
        );
        setEmailError("Something went wrong, please try again.");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginPress = async () => {
    let isValid = true;
    if (!email) {
      setEmailError("* You must enter your email ID");
      isValid = false;
    } else if (!email.includes("@")) {
      setEmailError("* The Email ID you entered is wrong");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!language) {
      setLanguageError("* You must select the language");
      isValid = false;
    } else {
      setLanguageError("");
    }

    if (isValid) {
      const isEmailValid = await validateWithBackend(email);
      if (!isEmailValid) {
        isValid = false;
      }
    }

    if (isValid) {
      router.replace("/");
    } else {
      setHasAttemptedSubmit(true);
    }
  };

  const handleHelpPress = () => {
    router.push("/(modals)/help-center");
  };

  return (
    <Page style={{ flex: 1 }} headerShown={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Login</Text>
        </View>
        <View style={styles.bodyContainer}>
          <View>
            {/* Email Input */}
            <View style={[styles.inputField, getInputStyle(email)]}>
              <Feather
                name="mail"
                size={20}
                color={getIconColor(email)}
                style={styles.icon}
              />
              <TextInput
                placeholder="Enter your email address"
                placeholderTextColor={Colors.secondaryText}
                value={email}
                onChangeText={(text) =>
                  handleInputChange(text, setEmail, setEmailError)
                }
                style={styles.inputText}
                autoCapitalize="none"
              />
            </View>
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>
          <View>
            {/* Language Picker */}
            {Platform.OS === "android" && (
              <TouchableOpacity
                style={[
                  styles.androidInputField,
                  getInputStyle(language ? "language" : ""),
                ]}
                onPress={() =>
                  setIsLanguagePickerVisible(!isLanguagePickerVisible)
                }
              >
                <Ionicons
                  name="language"
                  size={20}
                  color={getIconColor(language ? "language" : "")}
                />

                <Picker
                  selectedValue={language}
                  mode="dropdown"
                  onValueChange={handlePickerChange}
                  style={styles.picker}
                >
                  <Picker.Item
                    label="Select you language"
                    style={{ color: Colors.secondaryText }}
                    value=""
                  />
                  <Picker.Item label="Kannada" value="Kannada" />
                  <Picker.Item label="English" value="English" />
                </Picker>
              </TouchableOpacity>
            )}
            {Platform.OS === "ios" && (
              <>
                <TouchableOpacity
                  style={[
                    styles.inputField,
                    getInputStyle(language ? "language" : ""),
                  ]}
                  onPress={() =>
                    setIsLanguagePickerVisible(!isLanguagePickerVisible)
                  }
                >
                  <Ionicons
                    name="language"
                    size={20}
                    color={getIconColor(language ? "language" : "")}
                    style={styles.icon}
                  />
                  {language ? (
                    <Text style={styles.inputText}>{language}</Text>
                  ) : (
                    <Text style={{ color: Colors.secondaryText }}>
                      Select your language
                    </Text>
                  )}
                </TouchableOpacity>
                <Modal
                  visible={isLanguagePickerVisible}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() =>
                    setIsLanguagePickerVisible(!isLanguagePickerVisible)
                  }
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={language}
                        onValueChange={handlePickerChange}
                        style={styles.picker}
                      >
                        <Picker.Item
                          label="Select your language"
                          style={{ color: Colors.secondaryText }}
                          value=""
                        />
                        <Picker.Item label="Kannada" value="Kannada" />
                        <Picker.Item label="English" value="English" />
                      </Picker>
                    </View>
                  </View>
                </Modal>
              </>
            )}
            {languageError ? (
              <Text style={styles.errorText}>{languageError}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <PrimaryButton onPress={handleLoginPress} type="large">
            Login
          </PrimaryButton>
          <TouchableOpacity onPress={handleHelpPress}>
            <Text style={styles.secondaryButtonText}>Need Help?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  bodyContainer: {
    gap: 20,
    height: "60%",
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F9FAFB",
    height: 56,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 15,
  },
  androidInputField: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    height: 56,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Dim the background for modal
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  picker: {
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  inputText: {
    color: "#000",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    paddingHorizontal: 15,
    paddingTop: 4,
  },
  bottomContainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: 28,
  },
  secondaryButtonText: {
    color: Colors.tint,
    textAlign: "center",
    fontWeight: "bold",
  },
});

```

`cleftCare/app/(tabs)/record/three.tsx`:

```tsx
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import { useUserStore } from "@/lib/store";
import { formatDuration } from "@/lib/utils";
import { s3Client } from "@/lib/aws";

const prompt = "This is the final recording prompt";

export const InitialScreenState: React.FC<{
  onStartRecording: () => void;
}> = ({ onStartRecording }) => (
  <View style={styles.bodyContainer}>
    <Text style={styles.bodyText}>{prompt}</Text>
    <TouchableOpacity onPress={onStartRecording} style={styles.recordButton}>
      <Feather name="mic" size={40} color="black" />
    </TouchableOpacity>
    <Text style={styles.instructions}>
      Press the audio icon to start recording
    </Text>
  </View>
);

export const RecordingState: React.FC<{
  onStopRecording: () => void;
  timer: string;
}> = ({ onStopRecording, timer }) => {
  return (
    <View style={styles.bodyContainer}>
      <Text style={[styles.bodyText, { color: Colors.tint }]}>{prompt}</Text>
      <TouchableOpacity
        onPress={onStopRecording}
        style={[styles.recordButton, styles.recording]}
      >
        <Feather name="mic" size={40} color="white" />
      </TouchableOpacity>
      <Text style={[styles.timer, { color: Colors.tint }]}>{timer}</Text>
      <Text style={styles.boldInstructions}>Recording started...</Text>
    </View>
  );
};

// TODO: Edit the 2 components below
export const UploadingState: React.FC<{ timer: string }> = ({ timer }) => (
  <View style={styles.bodyContainer}>
    <Text style={styles.bodyText}>{prompt}</Text>
    <TouchableOpacity
      onPress={() => console.log("Uploading...")}
      style={[styles.recordButton]}
    >
      <Feather name="mic" size={40} color="black" />
    </TouchableOpacity>
    <Text style={[styles.timer]}>{timer}</Text>
    <Text style={styles.boldInstructions}>Audio is uploading...</Text>
  </View>
);

export const DoneState: React.FC<{
  onDone: () => void;
  onStartRecording: () => void;
}> = ({ onDone, onStartRecording }) => {
  useEffect(() => {
    onDone();
  }, []);
  return (
    <View style={styles.bodyContainer}>
      <Text style={styles.bodyText}>{prompt}</Text>
      <TouchableOpacity
        onPress={onStartRecording}
        style={[styles.recordButton]}
      >
        <Feather name="mic" size={40} color="black" />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 50,
        }}
      >
        <AntDesign name="checkcircle" size={20} color={Colors.tint} />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: Colors.text,
            textAlign: "center",
          }}
        >
          Done
        </Text>
      </View>
      <Text
        style={{
          marginTop: 10,
        }}
      >
        To Re-Record press the mic button.
      </Text>
    </View>
  );
};

export default function Screen() {
  const router = useRouter();
  const { getUser } = useUserStore();
  const user = getUser();
  console.log("User data:", user);
  if (user) {
    Object.entries(user).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
  } else {
    console.log("No user data available");
  }

  const recordingRef = useRef<Audio.Recording | null>(null);
  const [screenState, setScreenState] = useState<
    "initial" | "recording" | "uploading" | "done"
  >("initial");
  const [timer, setTimer] = useState<string>("00:00");
  const [completed, setCompleted] = useState(false);
  const [recordingCount, setRecordingCount] = useState<number>(0);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [meter, setMeter] = useState(0);

  const onStartRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          // Android-specific settings
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
          onRecordingStatusUpdate
        );

        recordingRef.current = newRecording;
        // await newRecording.startAsync();
        setScreenState("recording");
        console.log("Recording started", newRecording);
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const onRecordingStatusUpdate = async (newStatus: Audio.RecordingStatus) => {
    setStatus(newStatus);
    console.log("Recording status:", newStatus);
    if (newStatus.canRecord && newStatus.durationMillis != null) {
      const newFormattedTime = formatDuration(newStatus.durationMillis);
      setTimer(newFormattedTime); // Update the formatted time
    }
  };

  const onStopRecording = async () => {
    const currentRecording = recordingRef.current;
    if (!currentRecording) return;
    await currentRecording.stopAndUnloadAsync();
    setScreenState("uploading");
    console.log("Recording stopped");
    // const uri = currentRecording.getURI();
    // console.log("Recording URI:", uri);
    setTimeout(() => setScreenState("done"), 2000);
  };

  const onDone = async () => {
    setCompleted(true);
    setRecordingCount((prevCount) => prevCount + 1);
    // record and store the audio locally and upload also but if internet connection is lost we upload in this in the end.
    const currentRecording = recordingRef.current;
    if (!currentRecording) return;

    try {
      const uri = currentRecording.getURI(); // Get the URI of the recording
      const fileName = `audio-${new Date().toISOString()}.m4a`;

      // Convert the recording to a Blob or a Buffer before uploading
      const response = await fetch(uri!);
      const blob = await response.blob();

      // Create the parameters for the S3 upload
      const uploadParams = {
        Bucket: "cleftcare-test", // The name of the bucket
        Key: fileName, // The name of the file to be uploaded
        Body: blob, // The audio blob to upload
        ContentType: "audio/mp4", // Specify the file type
      };

      // Upload to S3
      const command = new PutObjectCommand(uploadParams);
      const data = await s3Client.send(command);

      console.log("Successfully uploaded audio to S3", data);
    } catch (error) {
      console.error("Error uploading audio to S3:", error);
    }
  };

  let content;
  switch (screenState) {
    case "initial":
      content = <InitialScreenState onStartRecording={onStartRecording} />;
      break;
    case "recording":
      content = (
        <RecordingState onStopRecording={onStopRecording} timer={timer} />
      );
      break;
    case "uploading":
      content = <UploadingState timer={timer} />;
      break;
    case "done":
      // Choose the best file running each at once and compare the scores
      content = (
        <DoneState onDone={onDone} onStartRecording={onStartRecording} />
      );
      break;
  }

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={false}
    >
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity
                onPress={() => {
                  router.push("/record/three"); // TODO: Navigate to the next screen
                }}
                disabled={!completed}
              >
                <Text
                  style={[
                    styles.headerRightText,
                    completed ? { color: Colors.tint } : { color: "gray" },
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.container}>
        {content}
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>1/</Text>
          <Text style={styles.finalProgressText}>25</Text>
        </View>
        <View style={styles.recordingCountContainer}>
          <Text style={styles.recordingCountText}>
            Recordings: {recordingCount}
          </Text>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerRightText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
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
  recording: {
    backgroundColor: Colors.tint,
  },
  timer: {
    fontSize: 30,
    fontWeight: "500",
    color: Colors.text,
  },
  instructions: {
    fontSize: 16,
    marginTop: 50,
    color: Colors.secondaryText,
    textAlign: "center",
    width: "60%",
  },
  boldInstructions: {
    fontSize: 16,
    marginTop: 50,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
  },
  progressTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    bottom: 0,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.tint,
  },
  finalProgressText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.secondaryText,
  },
  recordingCountContainer: {
    position: "absolute",
    bottom: 0,
    right: 20,
    backgroundColor: Colors.tint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  recordingCountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});

```

`cleftCare/app/(tabs)/record/index.tsx`:

```tsx
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";
import { useTranslation } from "react-i18next";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import { useUserStore } from "@/lib/store";
import { formatDuration } from "@/lib/utils";
import { s3Client } from "@/lib/aws";
import { predictOhmRating } from "@/lib/api";

const promptNumber: number = 1;

export const InitialScreenState: React.FC<{
  onStartRecording: () => void;
}> = ({ onStartRecording }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.bodyContainer}>
      <Text style={styles.bodyText}>{t("recordingScreen.prompt1")}</Text>
      <TouchableOpacity onPress={onStartRecording} style={styles.recordButton}>
        <Feather name="mic" size={40} color="black" />
      </TouchableOpacity>
      <Text style={styles.instructions}>
        {t("recordingScreen.startRecording")}
      </Text>
    </View>
  );
};

export const RecordingState: React.FC<{
  onStopRecording: () => void;
  timer: string;
}> = ({ onStopRecording, timer }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.bodyContainer}>
      <Text style={[styles.bodyText, { color: Colors.tint }]}>
        {t("recordingScreen.prompt1")}
      </Text>
      <TouchableOpacity
        onPress={onStopRecording}
        style={[styles.recordButton, styles.recording]}
      >
        <Feather name="mic" size={40} color="white" />
      </TouchableOpacity>
      <Text style={[styles.timer, { color: Colors.tint }]}>{timer}</Text>
      <Text style={styles.boldInstructions}>
        {t("recordingScreen.recordingStarted")}
      </Text>
    </View>
  );
};

// TODO: Edit the 2 components below
export const UploadingState: React.FC<{ timer: string }> = ({ timer }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.bodyContainer}>
      <Text style={styles.bodyText}>{t("recordingScreen.prompt1")}</Text>
      <TouchableOpacity
        onPress={() => console.log("Uploading...")}
        style={[styles.recordButton]}
      >
        <Feather name="mic" size={40} color="black" />
      </TouchableOpacity>
      <Text style={[styles.timer]}>{timer}</Text>
      <Text style={styles.boldInstructions}>
        {t("recordingScreen.uploading")}
      </Text>
    </View>
  );
};

export const DoneState: React.FC<{
  onDone: () => void;
  onStartRecording: () => void;
}> = ({ onDone, onStartRecording }) => {
  const { t } = useTranslation();
  useEffect(() => {
    onDone();
  }, []);

  return (
    <View style={styles.bodyContainer}>
      <Text style={styles.bodyText}>{t("recordingScreen.prompt1")}</Text>
      <TouchableOpacity
        onPress={onStartRecording}
        style={[styles.recordButton]}
      >
        <Feather name="mic" size={40} color="black" />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 50,
        }}
      >
        <AntDesign name="checkcircle" size={20} color={Colors.tint} />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: Colors.text,
            textAlign: "center",
          }}
        >
          {t("recordingScreen.done")}
        </Text>
      </View>
      <Text
        style={{
          marginTop: 10,
        }}
      >
        {t("recordingScreen.reRecord")}
      </Text>
    </View>
  );
};

export default function Screen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { getUser } = useUserStore();
  const user = getUser();
  console.log("User data:", user);
  if (user) {
    Object.entries(user).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
  } else {
    console.log("No user data available");
  }

  const recordingRef = useRef<Audio.Recording | null>(null);
  const [screenState, setScreenState] = useState<
    "initial" | "recording" | "uploading" | "done"
  >("initial");
  const [timer, setTimer] = useState<string>("00:00");
  const [completed, setCompleted] = useState(false);
  const [recordingCount, setRecordingCount] = useState<number>(0);
  const [latestUploadFileName, setLatestUploadFileName] = useState<string>("");
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [meter, setMeter] = useState(0);

  const handleNext = () => {
    console.log("CHECKTHIS:", latestUploadFileName);
    const ohmScore = predictOhmRating(
      user?.userId!,
      user?.name!,
      promptNumber,
      latestUploadFileName
    );
    router.push("/record/twentyfive");
  };

  const onStartRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          // Android-specific settings
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
          onRecordingStatusUpdate
        );

        recordingRef.current = newRecording;
        // await newRecording.startAsync();
        setScreenState("recording");
        console.log("Recording started", newRecording);
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const onRecordingStatusUpdate = async (newStatus: Audio.RecordingStatus) => {
    setStatus(newStatus);
    console.log("Recording status:", newStatus);
    if (newStatus.canRecord && newStatus.durationMillis != null) {
      const newFormattedTime = formatDuration(newStatus.durationMillis);
      setTimer(newFormattedTime); // Update the formatted time
    }
  };

  const onStopRecording = async () => {
    const currentRecording = recordingRef.current;
    if (!currentRecording) return;
    await currentRecording.stopAndUnloadAsync();
    setScreenState("uploading");
    console.log("Recording stopped");
    // const uri = currentRecording.getURI();
    // console.log("Recording URI:", uri);
    setTimeout(() => setScreenState("done"), 2000);
  };

  /**
   * onDone function is called after the recording is stopped and unloaded.
   * It saves the recording to local storage and uploads it to S3.
   */
  const onDone = async () => {
    setCompleted(true);
    setRecordingCount((prevCount) => prevCount + 1);

    const currentRecording = recordingRef.current;
    if (!currentRecording) return;

    try {
      const uri = currentRecording.getURI();
      console.log("Recording URI:", uri);
      const fileName = `${
        user?.userId
      }-${new Date().getTime()}-${promptNumber}-${recordingCount + 1}.m4a`;
      const localFileUri = `${FileSystem.cacheDirectory}/${fileName}`; // Path to store the recording locally

      // Copy the recording to local storage
      await FileSystem.copyAsync({
        from: uri!,
        to: localFileUri,
      });
      console.log("File saved locally at:", localFileUri);

      await uploadToS3(localFileUri, fileName);
    } catch (error) {
      console.error("Error during recording processing:", error);
    }
  };

  // Helper function to upload file to S3
  const uploadToS3 = async (localFileUri: string, fileName: string) => {
    try {
      // Read the file from the local storage
      const fileInfo = await FileSystem.getInfoAsync(localFileUri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      const fileBlob = await FileSystem.readAsStringAsync(localFileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert the Base64 string to a Blob or ArrayBuffer before uploading to S3
      const buffer = Buffer.from(fileBlob, "base64");

      const uploadParams = {
        Bucket: "cleftcare-test", // The name of the bucket
        Key: fileName, // The name of the file to be uploaded
        Body: buffer, // Upload the file content
        ContentType: "audio/mp4", // M4A files use this MIME type
      };

      // Upload to S3
      const command = new PutObjectCommand(uploadParams);
      const data = await s3Client.send(command);

      setLatestUploadFileName(fileName);
      console.log("Successfully uploaded audio to S3:", data);

      // Delete from local storage after successful upload
      await FileSystem.deleteAsync(localFileUri);
      console.log("File deleted from local storage after successful upload");
    } catch (error) {
      console.error("Error uploading to S3:", error);
      // Handle the case where the file should remain locally for future upload retries
    }
  };

  let content;
  switch (screenState) {
    case "initial":
      content = <InitialScreenState onStartRecording={onStartRecording} />;
      break;
    case "recording":
      content = (
        <RecordingState onStopRecording={onStopRecording} timer={timer} />
      );
      break;
    case "uploading":
      content = <UploadingState timer={timer} />;
      break;
    case "done":
      // Choose the best file running each at once and compare the scores
      content = (
        <DoneState onDone={onDone} onStartRecording={onStartRecording} />
      );
      break;
  }

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={false}
    >
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity onPress={handleNext} disabled={!completed}>
                <Text
                  style={[
                    styles.headerRightText,
                    completed ? { color: Colors.tint } : { color: "gray" },
                  ]}
                >
                  {t("recordingScreen.nextButton")}
                </Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.container}>
        {content}
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>{`${promptNumber}/`}</Text>
          <Text style={styles.finalProgressText}>25</Text>
        </View>
        <View style={styles.recordingCountContainer}>
          <Text style={styles.recordingCountText}>
            {t("recordingScreen.recordings")}: {recordingCount}
          </Text>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerRightText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
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
  recording: {
    backgroundColor: Colors.tint,
  },
  timer: {
    fontSize: 30,
    fontWeight: "500",
    color: Colors.text,
  },
  instructions: {
    fontSize: 16,
    marginTop: 50,
    color: Colors.secondaryText,
    textAlign: "center",
    width: "60%",
  },
  boldInstructions: {
    fontSize: 16,
    marginTop: 50,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
  },
  progressTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    bottom: 0,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.tint,
  },
  finalProgressText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.secondaryText,
  },
  recordingCountContainer: {
    position: "absolute",
    bottom: 0,
    right: 20,
    backgroundColor: Colors.tint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  recordingCountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});

```

`cleftCare/app/(tabs)/record/twentyfive.tsx`:

```tsx
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";
import { useTranslation } from "react-i18next";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import { useUserStore } from "@/lib/store";
import { formatDuration } from "@/lib/utils";
import { s3Client } from "@/lib/aws";
import PrimaryButton from "@/components/PrimaryButton";
import { predictOhmRating } from "@/lib/api";

const promptNumber: number = 25;

export const InitialScreenState: React.FC<{
  onStartRecording: () => void;
}> = ({ onStartRecording }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.bodyContainer}>
      <Text style={styles.bodyText}>{t("recordingScreen.prompt2")}</Text>
      <TouchableOpacity onPress={onStartRecording} style={styles.recordButton}>
        <Feather name="mic" size={40} color="black" />
      </TouchableOpacity>
      <Text style={styles.instructions}>
        {t("recordingScreen.startRecording")}
      </Text>
    </View>
  );
};

export const RecordingState: React.FC<{
  onStopRecording: () => void;
  timer: string;
}> = ({ onStopRecording, timer }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.bodyContainer}>
      <Text style={[styles.bodyText, { color: Colors.tint }]}>
        {t("recordingScreen.prompt2")}
      </Text>
      <TouchableOpacity
        onPress={onStopRecording}
        style={[styles.recordButton, styles.recording]}
      >
        <Feather name="mic" size={40} color="white" />
      </TouchableOpacity>
      <Text style={[styles.timer, { color: Colors.tint }]}>{timer}</Text>
      <Text style={styles.boldInstructions}>
        {t("recordingScreen.recordingStarted")}
      </Text>
    </View>
  );
};

// TODO: Edit the 2 components below
export const UploadingState: React.FC<{ timer: string }> = ({ timer }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.bodyContainer}>
      <Text style={styles.bodyText}>{t("recordingScreen.prompt2")}</Text>
      <TouchableOpacity
        onPress={() => console.log("Uploading...")}
        style={[styles.recordButton]}
      >
        <Feather name="mic" size={40} color="black" />
      </TouchableOpacity>
      <Text style={[styles.timer]}>{timer}</Text>
      <Text style={styles.boldInstructions}>
        {t("recordingScreen.uploading")}
      </Text>
    </View>
  );
};

export const DoneState: React.FC<{
  onDone: () => void;
  onStartRecording: () => void;
}> = ({ onDone, onStartRecording }) => {
  const { t } = useTranslation();
  useEffect(() => {
    onDone();
  }, []);

  return (
    <View style={styles.bodyContainer}>
      <Text style={styles.bodyText}>{t("recordingScreen.prompt2")}</Text>
      <TouchableOpacity
        onPress={onStartRecording}
        style={[styles.recordButton]}
      >
        <Feather name="mic" size={40} color="black" />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 50,
        }}
      >
        <AntDesign name="checkcircle" size={20} color={Colors.tint} />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: Colors.text,
            textAlign: "center",
          }}
        >
          {t("recordingScreen.done")}
        </Text>
      </View>
      <Text
        style={{
          marginTop: 10,
        }}
      >
        {t("recordingScreen.reRecord")}
      </Text>
    </View>
  );
};

export default function Screen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { getUser } = useUserStore();
  const user = getUser();
  console.log("User data:", user);
  if (user) {
    Object.entries(user).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
  } else {
    console.log("No user data available");
  }

  const recordingRef = useRef<Audio.Recording | null>(null);
  const [screenState, setScreenState] = useState<
    "initial" | "recording" | "uploading" | "done"
  >("initial");
  const [timer, setTimer] = useState<string>("00:00");
  const [completed, setCompleted] = useState(false);
  const [recordingCount, setRecordingCount] = useState<number>(0);
  const [latestUploadFileName, setLatestUploadFileName] = useState<string>("");
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [meter, setMeter] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleNext = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    // OHM Score prediction here
    console.log("CHECKTHIS:", latestUploadFileName);
    const ohmScore = predictOhmRating(
      user?.userId!,
      user?.name!,
      promptNumber,
      latestUploadFileName
    );
    setShowModal(false);
    router.push("/"); // Navigate to home after closing
  };

  const onStartRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          // Android-specific settings
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
          onRecordingStatusUpdate
        );

        recordingRef.current = newRecording;
        // await newRecording.startAsync();
        setScreenState("recording");
        console.log("Recording started", newRecording);
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const onRecordingStatusUpdate = async (newStatus: Audio.RecordingStatus) => {
    setStatus(newStatus);
    console.log("Recording status:", newStatus);
    if (newStatus.canRecord && newStatus.durationMillis != null) {
      const newFormattedTime = formatDuration(newStatus.durationMillis);
      setTimer(newFormattedTime); // Update the formatted time
    }
  };

  const onStopRecording = async () => {
    const currentRecording = recordingRef.current;
    if (!currentRecording) return;
    await currentRecording.stopAndUnloadAsync();
    setScreenState("uploading");
    console.log("Recording stopped");
    // const uri = currentRecording.getURI();
    // console.log("Recording URI:", uri);
    setTimeout(() => setScreenState("done"), 2000);
  };

  const onDone = async () => {
    setCompleted(true);
    setRecordingCount((prevCount) => prevCount + 1);

    const currentRecording = recordingRef.current;
    if (!currentRecording) return;

    try {
      const uri = currentRecording.getURI();
      console.log("Recording URI:", uri);
      const fileName = `${
        user?.userId
      }-${new Date().getTime()}-${promptNumber}-${recordingCount + 1}.m4a`;
      const localFileUri = `${FileSystem.cacheDirectory}/${fileName}`; // Path to store the recording locally

      // Copy the recording to local storage
      await FileSystem.copyAsync({
        from: uri!,
        to: localFileUri,
      });
      console.log("File saved locally at:", localFileUri);

      await uploadToS3(localFileUri, fileName);
    } catch (error) {
      console.error("Error during recording processing:", error);
    }
  };

  // Helper function to upload file to S3
  const uploadToS3 = async (localFileUri: string, fileName: string) => {
    try {
      // Read the file from the local storage
      const fileInfo = await FileSystem.getInfoAsync(localFileUri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      const fileBlob = await FileSystem.readAsStringAsync(localFileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert the Base64 string to a Blob or ArrayBuffer before uploading to S3
      const buffer = Buffer.from(fileBlob, "base64");

      const uploadParams = {
        Bucket: "cleftcare-test", // The name of the bucket
        Key: fileName, // The name of the file to be uploaded
        Body: buffer, // Upload the file content
        ContentType: "audio/mp4", // M4A files use this MIME type
      };

      // Upload to S3
      const command = new PutObjectCommand(uploadParams);
      const data = await s3Client.send(command);

      setLatestUploadFileName(fileName);
      console.log("Successfully uploaded audio to S3:", data);

      // Delete from local storage after successful upload
      await FileSystem.deleteAsync(localFileUri);
      console.log("File deleted from local storage after successful upload");
    } catch (error) {
      console.error("Error uploading to S3:", error);
      // Handle the case where the file should remain locally for future upload retries
    }
  };

  let content;
  switch (screenState) {
    case "initial":
      content = <InitialScreenState onStartRecording={onStartRecording} />;
      break;
    case "recording":
      content = (
        <RecordingState onStopRecording={onStopRecording} timer={timer} />
      );
      break;
    case "uploading":
      content = <UploadingState timer={timer} />;
      break;
    case "done":
      // Choose the best file running each at once and compare the scores
      content = (
        <DoneState onDone={onDone} onStartRecording={onStartRecording} />
      );
      break;
  }

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={false}
    >
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity onPress={handleNext} disabled={!completed}>
                <Text
                  style={[
                    styles.headerRightText,
                    completed ? { color: Colors.tint } : { color: "gray" },
                  ]}
                >
                  {t("recordingScreen.nextButton")}
                </Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.container}>
        {content}
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>{`${promptNumber}/`}</Text>
          <Text style={styles.finalProgressText}>25</Text>
        </View>
        <View style={styles.recordingCountContainer}>
          <Text style={styles.recordingCountText}>
            {t("recordingScreen.recordings")}: {recordingCount}
          </Text>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => setShowModal(false)}
          >
            <View style={styles.modalContent}>
              <AntDesign name="checkcircle" size={50} color={Colors.tint} />
              <Text style={styles.modalTitle}>{t("audioSaveModal.title")}</Text>
              <Text style={styles.modalSubtitle}>
                {t("audioSaveModal.subtitle")}
              </Text>
              <PrimaryButton
                style={{ marginTop: 20 }}
                type="medium"
                onPress={handleModalClose}
              >
                {t("audioSaveModal.buttonText")}
              </PrimaryButton>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerRightText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
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
  recording: {
    backgroundColor: Colors.tint,
  },
  timer: {
    fontSize: 30,
    fontWeight: "500",
    color: Colors.text,
  },
  instructions: {
    fontSize: 16,
    marginTop: 50,
    color: Colors.secondaryText,
    textAlign: "center",
    width: "60%",
  },
  boldInstructions: {
    fontSize: 16,
    marginTop: 50,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
  },
  progressTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    bottom: 0,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.tint,
  },
  finalProgressText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.secondaryText,
  },
  recordingCountContainer: {
    position: "absolute",
    bottom: 0,
    right: 20,
    backgroundColor: Colors.tint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  recordingCountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "90%",
    height: "45%", // Increase height to make it longer
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40, // Add more padding for spacing
    alignItems: "center",
    justifyContent: "center", // Center content vertically
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: "center",
    marginBottom: 20,
  },
});

```

`cleftCare/app/(tabs)/record/two.tsx`:

```tsx
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import { useUserStore } from "@/lib/store";
import { formatDuration } from "@/lib/utils";
import { s3Client } from "@/lib/aws";

const prompt: string = "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಲು ಆಡಿಯೊ ಐಕಾನ್ ಅನ್ನು ಒತ್ತಿರಿ";
const promptNumber: number = 2;

export const InitialScreenState: React.FC<{
  onStartRecording: () => void;
}> = ({ onStartRecording }) => (
  <View style={styles.bodyContainer}>
    <Text style={styles.bodyText}>{prompt}</Text>
    <TouchableOpacity onPress={onStartRecording} style={styles.recordButton}>
      <Feather name="mic" size={40} color="black" />
    </TouchableOpacity>
    <Text style={styles.instructions}>
      Press the audio icon to start recording
    </Text>
  </View>
);

export const RecordingState: React.FC<{
  onStopRecording: () => void;
  timer: string;
}> = ({ onStopRecording, timer }) => {
  return (
    <View style={styles.bodyContainer}>
      <Text style={[styles.bodyText, { color: Colors.tint }]}>{prompt}</Text>
      <TouchableOpacity
        onPress={onStopRecording}
        style={[styles.recordButton, styles.recording]}
      >
        <Feather name="mic" size={40} color="white" />
      </TouchableOpacity>
      <Text style={[styles.timer, { color: Colors.tint }]}>{timer}</Text>
      <Text style={styles.boldInstructions}>Recording started...</Text>
    </View>
  );
};

// TODO: Edit the 2 components below
export const UploadingState: React.FC<{ timer: string }> = ({ timer }) => (
  <View style={styles.bodyContainer}>
    <Text style={styles.bodyText}>{prompt}</Text>
    <TouchableOpacity
      onPress={() => console.log("Uploading...")}
      style={[styles.recordButton]}
    >
      <Feather name="mic" size={40} color="black" />
    </TouchableOpacity>
    <Text style={[styles.timer]}>{timer}</Text>
    <Text style={styles.boldInstructions}>Audio is uploading...</Text>
  </View>
);

export const DoneState: React.FC<{
  onDone: () => void;
  onStartRecording: () => void;
}> = ({ onDone, onStartRecording }) => {
  useEffect(() => {
    onDone();
  }, []);
  return (
    <View style={styles.bodyContainer}>
      <Text style={styles.bodyText}>{prompt}</Text>
      <TouchableOpacity
        onPress={onStartRecording}
        style={[styles.recordButton]}
      >
        <Feather name="mic" size={40} color="black" />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 50,
        }}
      >
        <AntDesign name="checkcircle" size={20} color={Colors.tint} />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: Colors.text,
            textAlign: "center",
          }}
        >
          Done
        </Text>
      </View>
      <Text
        style={{
          marginTop: 10,
        }}
      >
        To Re-Record press the mic button.
      </Text>
    </View>
  );
};

export default function Screen() {
  const router = useRouter();
  const { getUser } = useUserStore();
  const user = getUser();
  console.log("User data:", user);
  if (user) {
    Object.entries(user).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
  } else {
    console.log("No user data available");
  }

  const recordingRef = useRef<Audio.Recording | null>(null);
  const [screenState, setScreenState] = useState<
    "initial" | "recording" | "uploading" | "done"
  >("initial");
  const [timer, setTimer] = useState<string>("00:00");
  const [completed, setCompleted] = useState(false);
  const [recordingCount, setRecordingCount] = useState<number>(0);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [meter, setMeter] = useState(0);

  const onStartRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          // Android-specific settings
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
          onRecordingStatusUpdate
        );

        recordingRef.current = newRecording;
        // await newRecording.startAsync();
        setScreenState("recording");
        console.log("Recording started", newRecording);
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const onRecordingStatusUpdate = async (newStatus: Audio.RecordingStatus) => {
    setStatus(newStatus);
    console.log("Recording status:", newStatus);
    if (newStatus.canRecord && newStatus.durationMillis != null) {
      const newFormattedTime = formatDuration(newStatus.durationMillis);
      setTimer(newFormattedTime); // Update the formatted time
    }
  };

  const onStopRecording = async () => {
    const currentRecording = recordingRef.current;
    if (!currentRecording) return;
    await currentRecording.stopAndUnloadAsync();
    setScreenState("uploading");
    console.log("Recording stopped");
    // const uri = currentRecording.getURI();
    // console.log("Recording URI:", uri);
    setTimeout(() => setScreenState("done"), 2000);
  };

  const onDone = async () => {
    setCompleted(true);
    setRecordingCount((prevCount) => prevCount + 1);

    const currentRecording = recordingRef.current;
    if (!currentRecording) return;

    try {
      const uri = currentRecording.getURI();
      const fileName = `${
        user?.userId
      }-${new Date().toISOString()}-${promptNumber}.m4a`;
      const localFileUri = `${FileSystem.documentDirectory}${fileName}`; // Path to store the recording locally

      // Copy the recording to local storage
      await FileSystem.copyAsync({
        from: uri!,
        to: localFileUri,
      });
      console.log("File saved locally at:", localFileUri);

      await uploadToS3(localFileUri, fileName);
    } catch (error) {
      console.error("Error during recording processing:", error);
    }
  };

  // Helper function to upload file to S3
  const uploadToS3 = async (localFileUri: string, fileName: string) => {
    try {
      // Read the file from the local storage
      const fileInfo = await FileSystem.getInfoAsync(localFileUri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      const fileBlob = await FileSystem.readAsStringAsync(localFileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert the Base64 string to a Blob or ArrayBuffer before uploading to S3
      const buffer = Buffer.from(fileBlob, "base64");

      // Create the parameters for the S3 upload
      const uploadParams = {
        Bucket: "cleftcare-test", // The name of the bucket
        Key: fileName, // The name of the file to be uploaded
        Body: buffer, // Upload the file content
        ContentType: "audio/mp4", // M4A files use this MIME type
      };

      // Upload to S3
      const command = new PutObjectCommand(uploadParams);
      const data = await s3Client.send(command);

      console.log("Successfully uploaded audio to S3:", data);

      // You can now delete the file locally if you no longer need it
      await FileSystem.deleteAsync(localFileUri);
      console.log("File deleted from local storage after successful upload");
    } catch (error) {
      console.error("Error uploading to S3:", error);
      // Handle the case where the file should remain locally for future upload retries
    }
  };

  let content;
  switch (screenState) {
    case "initial":
      content = <InitialScreenState onStartRecording={onStartRecording} />;
      break;
    case "recording":
      content = (
        <RecordingState onStopRecording={onStopRecording} timer={timer} />
      );
      break;
    case "uploading":
      content = <UploadingState timer={timer} />;
      break;
    case "done":
      // Choose the best file running each at once and compare the scores
      content = (
        <DoneState onDone={onDone} onStartRecording={onStartRecording} />
      );
      break;
  }

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={false}
    >
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity
                onPress={() => {
                  router.push("/record/twentyfive");
                }}
                disabled={!completed}
              >
                <Text
                  style={[
                    styles.headerRightText,
                    completed ? { color: Colors.tint } : { color: "gray" },
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.container}>
        {content}
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>{promptNumber}/</Text>
          <Text style={styles.finalProgressText}>25</Text>
        </View>
        <View style={styles.recordingCountContainer}>
          <Text style={styles.recordingCountText}>
            Recordings: {recordingCount}
          </Text>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerRightText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
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
  recording: {
    backgroundColor: Colors.tint,
  },
  timer: {
    fontSize: 30,
    fontWeight: "500",
    color: Colors.text,
  },
  instructions: {
    fontSize: 16,
    marginTop: 50,
    color: Colors.secondaryText,
    textAlign: "center",
    width: "60%",
  },
  boldInstructions: {
    fontSize: 16,
    marginTop: 50,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
  },
  progressTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    bottom: 0,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.tint,
  },
  finalProgressText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.secondaryText,
  },
  recordingCountContainer: {
    position: "absolute",
    bottom: 0,
    right: 20,
    backgroundColor: Colors.tint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  recordingCountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});

```

`cleftCare/app/(tabs)/record/onboarding.tsx`:

```tsx
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";

const promptNumber: number = 1;

export default function Screen() {
  const router = useRouter();

  const [isOnboarding, setIsOnboarding] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const onboardingSteps = [
    {
      title: "Start-Stop Audio",
      message:
        "Press the Audio icon to start recording children’s voice. make sure to record audio in quite place",
      position: { bottom: 70, left: "10%", right: "10%" }, // Box position
      arrowPosition: {
        top: -10,
        left: "50%",
        transform: [{ translateX: 10 }, { rotate: "180deg" }],
      },
    },
    {
      title: "Predefined Statement",
      message:
        "First, carefully speak predefined sentence in front of children",
      position: { top: 260, left: "10%", right: "10%" },
      arrowPosition: {
        top: -10,
        left: "50%",
        transform: [{ translateX: 10 }, { rotate: "180deg" }],
      },
    },
    {
      title: "Next Button",
      message:
        "Next button will be enable once you record the audio in current screen",
      position: { top: "3%", left: "20%", right: "2%" },
      arrowPosition: {
        top: -10,
        right: 30,
        transform: [{ translateX: 10 }, { rotate: "180deg" }],
      },
    },
    {
      title: "Success",
      message: "Great! let's begin recording audio now",
      position: {
        top: "30%",
        left: "10%",
        right: "10%",
        height: "40%",
        gap: 40,
      },
      arrowPosition: null, // No arrow for the success message
    },
  ];

  const handleNextOnboardingStep = async () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await AsyncStorage.setItem("onboarded", "true");
      router.replace("/(tabs)/record/");
    }
  };

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={false}
    >
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity onPress={() => {}} disabled={!completed}>
                <Text
                  style={[
                    styles.headerRightText,
                    completed ? { color: Colors.tint } : { color: "gray" },
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      {isOnboarding && (
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
      )}
      <View style={styles.container}>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>Prompt: Speak predefined sentence</Text>
          <TouchableOpacity onPress={() => {}} style={styles.recordButton}>
            <Feather name="mic" size={40} color="black" />
          </TouchableOpacity>
          <Text style={styles.instructions}>Press the mic to record</Text>
        </View>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>{`${promptNumber}/`}</Text>
          <Text style={styles.finalProgressText}>25</Text>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerRightText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
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
    borderColor: Colors.tint, // Teal border
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
  },
  nextButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
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
});

```

`cleftCare/app/(tabs)/record/_layout.tsx`:

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkOnboardingStatus() {
      const status = await AsyncStorage.getItem("onboarded");
      if (!status) {
        router.replace("/record/onboarding"); // Redirect to the first onboarding screen
      } else {
        setOnboarded(true);
      }
      setIsLoading(false);
    }
    checkOnboardingStatus();
  }, []);

  if (isLoading) return null;
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Record Audio",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          title: "Record Audio",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="two"
        options={{
          title: "Record Audio",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="three"
        options={{
          title: "Record Audio",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Stack.Screen
        name="twentyfive"
        options={{
          title: "Record Audio",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
        }}
      />
    </Stack>
  );
}

```

`cleftCare/app/(tabs)/profile.tsx`:

```tsx
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
              <TouchableOpacity
                style={styles.icon}
                onPress={handlePresentModalPress}
              >
                <Feather name="mail" size={25} color={Colors.text} />
              </TouchableOpacity>
            </View>
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

```

`cleftCare/app/(tabs)/_layout.tsx`:

```tsx
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { TouchableOpacity } from "react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: 0 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.tint,
      }}
    >
      <Tabs.Screen
        name="(index)"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon name={focused ? "mic" : "mic-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tutorials"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              name={focused ? "reader" : "reader-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

```

`cleftCare/app/(tabs)/(index)/index.tsx`:

```tsx
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Page from "@/components/Page";
import RecordItem from "@/components/RecordItem";
import Colors from "@/constants/Colors";
import { SampleData } from "@/constants/SampleData";
import { UserInfo } from "@/lib/store";
import { getRecordsByCommunityWorkerId } from "@/lib/api";

export default function Screen() {
  const router = useRouter();
  const { i18n, t } = useTranslation();

  const [records, setRecords] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false); // For pull-to-refresh
  const [error, setError] = useState<string>("");
  const [role, setRole] = useState<string | null>("");

  // Fetch records based on communityWorkerId
  const fetchRecords = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true); // Show loader only for initial fetch
    setError("");
    try {
      const communityWorkerId = await AsyncStorage.getItem("user-id");
      if (!communityWorkerId) {
        throw new Error("Community Worker ID is missing from storage.");
      }

      const response = await getRecordsByCommunityWorkerId(communityWorkerId);

      const mappedRecords: UserInfo[] = response.map((record: any) => ({
        userId: record.id,
        name: record.name,
        birthDate: record.birthDate,
        gender: record.gender,
        hearingLossStatus: record.hearingLossStatus,
        address: record.address,
        contactNumber: record.contactNumber,
        photo: record.photo,
        parentConsent: record.parentConsent,
        signedConsent: record.signedConsent,
        communityWorkerId: record.communityWorkerId,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }));

      setRecords(mappedRecords);
    } catch (err: any) {
      console.error("Failed to fetch records:", err);
      setError(err.error || "Failed to load records.");
    } finally {
      if (isRefresh) {
        setIsRefreshing(false); // End pull-to-refresh loader
      } else {
        setIsLoading(false); // End initial loader
      }
    }
  };

  const logUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem("user-id");
      const userRole = await AsyncStorage.getItem("user-role");

      console.log(
        "Onboarding status:",
        await AsyncStorage.getItem("onboarded")
      );

      setRole(userRole);
      if (userId !== null) {
        console.log("User ID:", userId);
        console.log("User Role:", userRole);
      } else {
        console.log("No user ID found");
      }
    } catch (error) {
      console.error("Error retrieving user ID:", error);
    }
  };
  logUserId();

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true); // Start pull-to-refresh loader
    fetchRecords(true); // Pass `true` to indicate refresh
  }, []);

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDevPress = () => {
    router.push("/add-record/add-signature");
  };

  const handleSearchPress = () => {
    router.push("/search-record");
  };

  const handleHelpPress = () => {
    router.push("/(modals)/help-center");
  };

  const handleAddRecordPress = () => {
    router.push("/add-record/");
  };

  const handleEditRecordPress = (id: string) => {
    router.push(`/edit-record/${id}`);
  };

  const getRecordCount = () => {
    return records.length;
  };

  const currentLanguage = i18n.language;
  console.log("Current language:", currentLanguage);
  return (
    <Page style={{ flex: 1 }} headerShown={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Animated.Text
            entering={FadeInLeft.springify()}
            exiting={FadeOutLeft}
            style={styles.title}
          >
            {t("homeScreen.title")}
          </Animated.Text>
          <View style={styles.iconsContainer}>
            {role == "Admin" && (
              <TouchableOpacity style={styles.icon} onPress={handleDevPress}>
                <Feather name="code" size={25} color={Colors.tint} />
              </TouchableOpacity>
            )}
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

        {/* Records */}
        <View style={styles.recordsContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.recordsTitle}>
              {t("homeScreen.viewRecords")}
            </Text>
            <Text
              style={styles.recordsCount}
            >{`${getRecordCount()} records`}</Text>
          </View>

          {isLoading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : getRecordCount() === 0 ? (
            <View style={styles.noRecordsContainer}>
              <Feather name="edit" size={23} color={Colors.secondaryText} />
              <Text style={styles.noRecordsText}>
                {t("homeScreen.noRecordsMessage")}
              </Text>
              <Text style={styles.noRecordsSubtext}>
                {t("homeScreen.addRecordPrompt")}
              </Text>
            </View>
          ) : (
            <View style={styles.recordListContainer}>
              <FlatList
                data={records}
                renderItem={({ item }: { item: UserInfo }) => (
                  <RecordItem
                    key={item.userId}
                    userId={item.userId}
                    name={item.name}
                    birthDate={
                      item.birthDate ? item.birthDate.toString() : null
                    }
                    onPress={() => handleEditRecordPress(item.userId)}
                  />
                )}
                keyExtractor={(item) => item.userId}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    tintColor={Colors.tint}
                  />
                }
                style={{ width: "100%" }}
              />
            </View>
          )}
        </View>
      </View>
    </Page>
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
  recordsContainer: {
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
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
  noRecordsSubtext: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 10,
  },
  recordListContainer: {
    marginTop: 30,
  },
});

```

`cleftCare/app/(tabs)/(index)/search-record.tsx`:

```tsx
import { StyleSheet, View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import Page from "@/components/Page";
import Colors from "@/constants/Colors";

export default function Screen() {
  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={true}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Feather
            name="search"
            size={20}
            color="#8E8E93"
            style={styles.icon}
          />
          <TextInput
            placeholder="Search name or record id"
            placeholderTextColor="#8E8E93"
            style={styles.input}
          />
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(25, 154, 142, 0.25)",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
});

```

`cleftCare/app/(tabs)/(index)/_layout.tsx`:

```tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function Layout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-record"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="search-record"
        options={{
          title: "Search",
          animation: "slide_from_bottom",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="edit-record/[userId]"
        options={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}

```

`cleftCare/app/(tabs)/(index)/edit-record/[userId].tsx`:

```tsx
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  Platform,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import { getRecordByUserId, updateRecord } from "@/lib/api";
import PrimaryButton from "@/components/PrimaryButton";

export default function Screen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { t } = useTranslation();

  const [name, setName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">();
  const [isGenderPickerVisible, setIsGenderPickerVisible] =
    useState<boolean>(false);
  const [hearingLoss, setHearingLoss] = useState<"Yes" | "No">();
  const [isHearingPickerVisible, setIsHearingPickerVisible] =
    useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [photo, setPhoto] = useState<string>(""); // Placeholder for photo
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const data = await getRecordByUserId(userId);
        setName(data.name);
        setBirthDate(data.birthDate ? new Date(data.birthDate) : null);
        setGender(data.gender);
        setHearingLoss(data.hearingLossStatus);
        setAddress(data.address);
        setContactNumber(data.contactNumber);
        setPhoto(data.photo || "");
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        Alert.alert("Error", "Unable to load user data.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleSave = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID is missing.");
      return;
    }

    const updatedUser = {
      name,
      birthDate: birthDate ? birthDate : null,
      gender,
      hearingLossStatus: hearingLoss,
      address,
      contactNumber,
      photo,
    };

    setIsSubmitting(true);

    try {
      await updateRecord(userId, updatedUser);
      Alert.alert("Success", "User record updated successfully!");
      router.back();
    } catch (error: any) {
      console.error("Failed to update user record:", error);
      Alert.alert("Error", error.error || "Failed to update user record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = (inputValue: string) => ({
    borderColor: inputValue ? Colors.tint : "#E5E7EB",
  });

  const getIconColor = (inputValue: string): string => {
    return inputValue ? Colors.tint : Colors.secondaryText;
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || birthDate;
    setBirthDate(currentDate);
    if (Platform.OS === "android") {
      setIsDatePickerVisible(false);
    }
  };

  const handlePickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Sorry",
        "We need camera roll permissions to make this work!"
      );
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Do something with the image URI
      console.log(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry", "We need camera permissions to make this work!");
      return;
    }

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Do something with the photo URI
      console.log(result.assets[0].uri);
    }
  };

  if (isLoading) {
    return (
      <Page
        style={{ flex: 1, backgroundColor: Colors.background }}
        headerShown={true}
      >
        <Stack.Screen options={{ title: "Edit Record" }} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      </Page>
    );
  }

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={true}
    >
      <Stack.Screen options={{ title: name || "Edit Record" }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 100 })}
      >
        <ScrollView style={styles.container}>
          <Text style={styles.headerText}>
            {t("editRecordScreen.headerText")}
          </Text>

          {/* Name Input */}
          <View style={[styles.inputField, getInputStyle(name)]}>
            <Feather
              name="user"
              size={20}
              color={getIconColor(name)}
              style={styles.icon}
            />
            <TextInput
              placeholder={t("editRecordScreen.namePlaceholder")}
              placeholderTextColor={Colors.secondaryText}
              value={name}
              onChangeText={setName}
              style={styles.inputText}
            />
          </View>

          {/* Birth Date Picker */}
          <TouchableOpacity
            style={[styles.inputField, getInputStyle(birthDate ? "1" : "")]}
            onPress={() => {
              setIsDatePickerVisible(true);
            }}
          >
            <Feather
              name="calendar"
              size={20}
              color={getIconColor(birthDate ? "1" : "")}
              style={styles.icon}
            />
            {birthDate ? (
              <Text style={styles.inputText}>
                {birthDate.getDate().toString().padStart(2, "0") +
                  "/" +
                  (birthDate.getMonth() + 1).toString().padStart(2, "0") +
                  "/" +
                  birthDate.getFullYear()}
              </Text>
            ) : (
              <Text style={{ color: Colors.secondaryText }}>
                {t("editRecordScreen.birthDatePlaceholder")}
              </Text>
            )}
          </TouchableOpacity>

          {Platform.OS === "ios" && isDatePickerVisible && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={isDatePickerVisible}
              onRequestClose={() => {
                setIsDatePickerVisible(false);
              }}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={birthDate ? birthDate : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "calendar"}
                    onChange={onDateChange}
                    style={styles.dateTimePicker}
                  />
                  <View style={styles.dateTimePickerFooter}>
                    <TouchableOpacity
                      onPress={() => {
                        setIsDatePickerVisible(false);
                      }}
                      style={{ padding: 10 }}
                    >
                      <Text style={styles.dateTimePickerFooterText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setIsDatePickerVisible(false);
                      }}
                      style={{ padding: 10 }}
                    >
                      <Text style={styles.dateTimePickerFooterText}>Ok</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}

          {Platform.OS === "android" && isDatePickerVisible && (
            <DateTimePicker
              testID="dateTimePicker"
              value={birthDate ? birthDate : new Date()}
              mode="date"
              display="calendar"
              onChange={onDateChange}
            />
          )}

          {/* Gender Picker */}
          {Platform.OS === "android" && (
            <TouchableOpacity
              style={[
                styles.androidInputField,
                getInputStyle(gender ? "gender" : ""),
              ]}
              onPress={() => setIsGenderPickerVisible(!isGenderPickerVisible)}
            >
              <Feather
                name="users"
                size={20}
                color={getIconColor(gender ? "gender" : "")}
              />

              <Picker
                selectedValue={gender}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {
                  setGender(itemValue);
                  setIsGenderPickerVisible(!isGenderPickerVisible);
                }}
                style={styles.picker}
              >
                <Picker.Item
                  label="Select Gender"
                  style={{ color: Colors.secondaryText }}
                  value=""
                />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </TouchableOpacity>
          )}

          {Platform.OS === "ios" && (
            <>
              <TouchableOpacity
                style={[
                  styles.inputField,
                  getInputStyle(gender ? "gender" : ""),
                ]}
                onPress={() => setIsGenderPickerVisible(!isGenderPickerVisible)}
              >
                <Feather
                  name="users"
                  size={20}
                  color={getIconColor(gender ? "gender" : "")}
                  style={styles.icon}
                />
                {gender ? (
                  <Text style={styles.inputText}>{gender}</Text>
                ) : (
                  <Text style={{ color: Colors.secondaryText }}>
                    Select Gender
                  </Text>
                )}
              </TouchableOpacity>
              <Modal
                visible={isGenderPickerVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() =>
                  setIsGenderPickerVisible(!isGenderPickerVisible)
                }
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={gender}
                      onValueChange={(itemValue, itemIndex) => {
                        setGender(itemValue);
                        setIsGenderPickerVisible(!isGenderPickerVisible);
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Gender" value="" />
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                      <Picker.Item label="Other" value="Other" />
                    </Picker>
                  </View>
                </View>
              </Modal>
            </>
          )}

          {/* Hearing Status Picker */}
          {Platform.OS === "android" && (
            <TouchableOpacity
              style={[
                styles.androidInputField,
                getInputStyle(hearingLoss ? "hearingStatus" : ""),
              ]}
              onPress={() => setIsHearingPickerVisible(!isHearingPickerVisible)}
            >
              <Feather
                name="users"
                size={20}
                color={getIconColor(hearingLoss ? "hearingStatus" : "")}
              />

              <Picker
                selectedValue={hearingLoss}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {
                  setHearingLoss(itemValue);
                  setIsHearingPickerVisible(!isHearingPickerVisible);
                }}
                style={styles.picker}
              >
                <Picker.Item
                  label="Hearing Status"
                  style={{ color: Colors.secondaryText }}
                  value=""
                />
                <Picker.Item label="Yes, I have hearing loss" value="Yes" />
                <Picker.Item label="No, I have no hearing loss" value="No" />
              </Picker>
            </TouchableOpacity>
          )}

          {Platform.OS === "ios" && (
            <>
              <TouchableOpacity
                style={[
                  styles.inputField,
                  getInputStyle(hearingLoss ? "hearingStatus" : ""),
                ]}
                onPress={() =>
                  setIsHearingPickerVisible(!isHearingPickerVisible)
                }
              >
                <Feather
                  name="smile"
                  size={20}
                  color={getIconColor(hearingLoss ? "hearingStatus" : "")}
                  style={styles.icon}
                />
                {hearingLoss ? (
                  <Text style={styles.inputText}>{hearingLoss}</Text>
                ) : (
                  <Text style={{ color: Colors.secondaryText }}>
                    Hearing Status
                  </Text>
                )}
              </TouchableOpacity>
              <Modal
                visible={isHearingPickerVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() =>
                  setIsHearingPickerVisible(!isHearingPickerVisible)
                }
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={hearingLoss}
                      onValueChange={(itemValue, itemIndex) => {
                        setHearingLoss(itemValue);
                        setIsHearingPickerVisible(!isHearingPickerVisible);
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item
                        label="Hearing Status"
                        style={{ color: Colors.secondaryText }}
                        value=""
                      />
                      <Picker.Item
                        label="Yes, I have hearing loss"
                        value="Yes, I have hearing loss"
                      />
                      <Picker.Item
                        label="No, I have no hearing loss"
                        value="No, I have no hearing loss"
                      />
                    </Picker>
                  </View>
                </View>
              </Modal>
            </>
          )}

          {/* Address Input */}
          <View style={[styles.inputField, getInputStyle(address)]}>
            <Feather
              name="map-pin"
              size={20}
              color={getIconColor(address)}
              style={styles.icon}
            />
            <TextInput
              placeholder={t("editRecordScreen.addressPlaceholder")}
              placeholderTextColor={Colors.secondaryText}
              value={address}
              onChangeText={setAddress}
              style={styles.inputText}
            />
          </View>

          {/* Contact Number Input */}
          <View style={[styles.inputField, getInputStyle(contactNumber)]}>
            <Feather
              name="phone"
              size={20}
              color={getIconColor(contactNumber)}
              style={styles.icon}
            />
            <TextInput
              placeholder={t("editRecordScreen.contactNumberPlaceholder")}
              placeholderTextColor={Colors.secondaryText}
              value={contactNumber}
              onChangeText={setContactNumber}
              maxLength={10}
              style={styles.inputText}
              keyboardType="phone-pad"
            />
          </View>

          {/* Attachment Input */}
          <TouchableOpacity
            style={[styles.inputField, getInputStyle(photo)]}
            onPress={() => {
              Alert.alert(
                "Upload Photo",
                "Choose an option",
                [
                  { text: "Take Photo", onPress: handleTakePhoto },
                  { text: "Choose from Gallery", onPress: handlePickImage },
                  { text: "Cancel", style: "cancel" },
                ],
                { cancelable: true }
              );
            }}
          >
            <Feather
              name="camera"
              size={22}
              color={Colors.secondaryText}
              style={styles.icon}
            />
            <Text style={{ color: Colors.secondaryText }}>
              Take/Choose Photo
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <PrimaryButton
            style={{ marginTop: 20 }}
            type="large"
            onPress={handleSave}
          >
            {t("editRecordScreen.updateButton")}
          </PrimaryButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    marginBottom: 20,
    fontSize: 14,
    textAlign: "center",
    color: Colors.secondaryText,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F9FAFB",
    height: 56,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 15,
  },
  androidInputField: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    height: 56,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  inputText: {
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Dim the background for modal
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  picker: {
    width: "100%",
  },
  dateTimePicker: {
    width: "100%",
    backgroundColor: "white",
  },
  dateTimePickerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  dateTimePickerFooterText: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#006ee6",
  },
});

```

`cleftCare/app/(tabs)/(index)/add-record/index.tsx`:

```tsx
import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  Platform,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { randomUUID } from "expo-crypto";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import PrimaryButton from "@/components/PrimaryButton";
import { useUserStore } from "@/lib/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Screen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setUser } = useUserStore();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">();
  const [isGenderPickerVisible, setIsGenderPickerVisible] =
    useState<boolean>(false);
  const [hearingStatus, setHearingStatus] = useState<
    "Yes, I have hearing loss" | "No, I have no hearing loss"
  >();
  const [isHearingPickerVisible, setIsHearingPickerVisible] =
    useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [photo, setPhoto] = useState<string>(""); // TODO: change photo to Image type if needed

  const handleNext = () => {
    updateUserStore();
    router.push("/add-record/parent-consent");
  };

  const updateUserStore = async () => {
    try {
      const workerId = await AsyncStorage.getItem("user-id");
      if (workerId !== null) {
        setUser({
          userId: randomUUID(),
          name,
          birthDate,
          gender,
          hearingStatus,
          address,
          contactNumber,
          photo,
          communityWorkerId: workerId,
          parentConsent: false,
          signedConsent: false,
        });
      }
    } catch (error) {
      console.error("Error retrieving user ID:", error);
    }
  };

  // Write a function that disables the submit button if any of the fields are empty except the photo field
  const isSubmitDisabled = () => {
    return (
      !name ||
      !birthDate ||
      !gender ||
      !hearingStatus ||
      !address ||
      !contactNumber
    );
  };

  const getInputStyle = (inputValue: string) => ({
    borderColor: inputValue ? Colors.tint : "#E5E7EB",
  });

  const getIconColor = (inputValue: string): string => {
    return inputValue ? Colors.tint : Colors.secondaryText;
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || birthDate;
    setBirthDate(currentDate);
    if (Platform.OS === "android") {
      setIsDatePickerVisible(false);
    }
  };

  const handlePickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Sorry",
        "We need camera roll permissions to make this work!"
      );
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Do something with the image URI
      console.log(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry", "We need camera permissions to make this work!");
      return;
    }

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Do something with the photo URI
      console.log(result.assets[0].uri);
    }
  };

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={true}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 100 })}
      >
        <ScrollView style={styles.container}>
          <Text style={styles.headerText}>
            {t("addRecordScreen.headerText")}
          </Text>

          {/* Name Input */}
          <View style={[styles.inputField, getInputStyle(name)]}>
            <Feather
              name="user"
              size={20}
              color={getIconColor(name)}
              style={styles.icon}
            />
            <TextInput
              placeholder={t("addRecordScreen.namePlaceholder")}
              placeholderTextColor={Colors.secondaryText}
              value={name}
              onChangeText={setName}
              style={styles.inputText}
              autoComplete="name"
            />
          </View>

          {/* Birth Date Picker */}
          <TouchableOpacity
            style={[styles.inputField, getInputStyle(birthDate ? "1" : "")]}
            onPress={() => {
              setIsDatePickerVisible(true);
            }}
          >
            <Feather
              name="calendar"
              size={20}
              color={getIconColor(birthDate ? "1" : "")}
              style={styles.icon}
            />
            {birthDate ? (
              <Text style={styles.inputText}>
                {birthDate.getDate().toString().padStart(2, "0") +
                  "/" +
                  (birthDate.getMonth() + 1).toString().padStart(2, "0") +
                  "/" +
                  birthDate.getFullYear()}
              </Text>
            ) : (
              <Text style={{ color: Colors.secondaryText }}>
                {t("addRecordScreen.birthDatePlaceholder")}
              </Text>
            )}
          </TouchableOpacity>

          {Platform.OS === "ios" && isDatePickerVisible && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={isDatePickerVisible}
              onRequestClose={() => {
                setIsDatePickerVisible(false);
              }}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={birthDate ? birthDate : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "calendar"}
                    onChange={onDateChange}
                    style={styles.dateTimePicker}
                  />
                  <View style={styles.dateTimePickerFooter}>
                    <TouchableOpacity
                      onPress={() => {
                        setIsDatePickerVisible(false);
                      }}
                      style={{ padding: 10 }}
                    >
                      <Text style={styles.dateTimePickerFooterText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setIsDatePickerVisible(false);
                      }}
                      style={{ padding: 10 }}
                    >
                      <Text style={styles.dateTimePickerFooterText}>Ok</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}

          {Platform.OS === "android" && isDatePickerVisible && (
            <DateTimePicker
              testID="dateTimePicker"
              value={birthDate ? birthDate : new Date()}
              mode="date"
              display="calendar"
              onChange={onDateChange}
            />
          )}

          {/* Gender Picker */}
          {Platform.OS === "android" && (
            <TouchableOpacity
              style={[
                styles.androidInputField,
                getInputStyle(gender ? "gender" : ""),
              ]}
              onPress={() => setIsGenderPickerVisible(!isGenderPickerVisible)}
            >
              <Feather
                name="users"
                size={20}
                color={getIconColor(gender ? "gender" : "")}
              />

              <Picker
                selectedValue={gender}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {
                  setGender(itemValue);
                  setIsGenderPickerVisible(!isGenderPickerVisible);
                }}
                style={styles.picker}
              >
                <Picker.Item
                  label="Select Gender"
                  style={{ color: Colors.secondaryText }}
                  value=""
                />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </TouchableOpacity>
          )}

          {Platform.OS === "ios" && (
            <>
              <TouchableOpacity
                style={[
                  styles.inputField,
                  getInputStyle(gender ? "gender" : ""),
                ]}
                onPress={() => setIsGenderPickerVisible(!isGenderPickerVisible)}
              >
                <Feather
                  name="users"
                  size={20}
                  color={getIconColor(gender ? "gender" : "")}
                  style={styles.icon}
                />
                {gender ? (
                  <Text style={styles.inputText}>{gender}</Text>
                ) : (
                  <Text style={{ color: Colors.secondaryText }}>
                    Select Gender
                  </Text>
                )}
              </TouchableOpacity>
              <Modal
                visible={isGenderPickerVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() =>
                  setIsGenderPickerVisible(!isGenderPickerVisible)
                }
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={gender}
                      onValueChange={(itemValue, itemIndex) => {
                        setGender(itemValue);
                        setIsGenderPickerVisible(!isGenderPickerVisible);
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Gender" value="" />
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                      <Picker.Item label="Other" value="Other" />
                    </Picker>
                  </View>
                </View>
              </Modal>
            </>
          )}

          {/* Hearing Status Picker */}
          {Platform.OS === "android" && (
            <TouchableOpacity
              style={[
                styles.androidInputField,
                getInputStyle(hearingStatus ? "hearingStatus" : ""),
              ]}
              onPress={() => setIsHearingPickerVisible(!isHearingPickerVisible)}
            >
              <Feather
                name="smile"
                size={20}
                color={getIconColor(hearingStatus ? "hearingStatus" : "")}
              />

              <Picker
                selectedValue={hearingStatus}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {
                  setHearingStatus(itemValue);
                  setIsHearingPickerVisible(!isHearingPickerVisible);
                }}
                style={styles.picker}
              >
                <Picker.Item
                  label="Hearing Status"
                  style={{ color: Colors.secondaryText }}
                  value=""
                />
                <Picker.Item label="Yes, I have hearing loss" value="Yes" />
                <Picker.Item label="No, I have no hearing loss" value="No" />
              </Picker>
            </TouchableOpacity>
          )}

          {Platform.OS === "ios" && (
            <>
              <TouchableOpacity
                style={[
                  styles.inputField,
                  getInputStyle(hearingStatus ? "hearingStatus" : ""),
                ]}
                onPress={() =>
                  setIsHearingPickerVisible(!isHearingPickerVisible)
                }
              >
                <Feather
                  name="smile"
                  size={20}
                  color={getIconColor(hearingStatus ? "hearingStatus" : "")}
                  style={styles.icon}
                />
                {hearingStatus ? (
                  <Text style={styles.inputText}>{hearingStatus}</Text>
                ) : (
                  <Text style={{ color: Colors.secondaryText }}>
                    Hearing Status
                  </Text>
                )}
              </TouchableOpacity>
              <Modal
                visible={isHearingPickerVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() =>
                  setIsHearingPickerVisible(!isHearingPickerVisible)
                }
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={hearingStatus}
                      onValueChange={(itemValue, itemIndex) => {
                        setHearingStatus(itemValue);
                        setIsHearingPickerVisible(!isHearingPickerVisible);
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item
                        label="Hearing Status"
                        style={{ color: Colors.secondaryText }}
                        value=""
                      />
                      <Picker.Item
                        label="Yes, I have hearing loss"
                        value="Yes, I have hearing loss"
                      />
                      <Picker.Item
                        label="No, I have no hearing loss"
                        value="No, I have no hearing loss"
                      />
                    </Picker>
                  </View>
                </View>
              </Modal>
            </>
          )}

          {/* Address Input */}
          <View style={[styles.inputField, getInputStyle(address)]}>
            <Feather
              name="map-pin"
              size={20}
              color={getIconColor(address)}
              style={styles.icon}
            />
            <TextInput
              placeholder={t("addRecordScreen.addressPlaceholder")}
              placeholderTextColor={Colors.secondaryText}
              value={address}
              onChangeText={setAddress}
              style={styles.inputText}
              autoComplete="off"
              autoCorrect={false}
            />
          </View>

          {/* Contact Number Input */}
          <View style={[styles.inputField, getInputStyle(contactNumber)]}>
            <Feather
              name="phone"
              size={20}
              color={getIconColor(contactNumber)}
              style={styles.icon}
            />
            <TextInput
              placeholder={t("addRecordScreen.contactNumberPlaceholder")}
              placeholderTextColor={Colors.secondaryText}
              value={contactNumber}
              onChangeText={setContactNumber}
              maxLength={10}
              style={styles.inputText}
              keyboardType="phone-pad"
            />
          </View>

          {/* Attachment Input */}
          <TouchableOpacity
            style={[styles.inputField, getInputStyle(photo)]}
            onPress={() => {
              Alert.alert(
                "Upload Photo",
                "Choose an option",
                [
                  { text: "Take Photo", onPress: handleTakePhoto },
                  { text: "Choose from Gallery", onPress: handlePickImage },
                  { text: "Cancel", style: "cancel" },
                ],
                { cancelable: true }
              );
            }}
          >
            <Feather
              name="camera"
              size={22}
              color={Colors.secondaryText}
              style={styles.icon}
            />
            <Text style={{ color: Colors.secondaryText }}>
              Take/Choose Photo
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <PrimaryButton
            style={{ marginTop: 20 }}
            type="large"
            disabled={isSubmitDisabled()}
            onPress={handleNext}
          >
            {t("addRecordScreen.nextButton")}
          </PrimaryButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    marginBottom: 20,
    fontSize: 14,
    textAlign: "center",
    color: Colors.secondaryText,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F9FAFB",
    height: 56,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 15,
  },
  androidInputField: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    height: 56,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  inputText: {
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Dim the background for modal
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  picker: {
    width: "100%",
  },
  dateTimePicker: {
    width: "100%",
    backgroundColor: "white",
  },
  dateTimePickerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  dateTimePickerFooterText: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#006ee6",
  },
});

```

`cleftCare/app/(tabs)/(index)/add-record/add-signature.tsx`:

```tsx
import { useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { UserInfo, useUserStore } from "@/lib/store";
import { addRecord } from "@/lib/api";
import SignatureBox from "@/components/SignatureBox";

export default function Screen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { getUser, updateUser } = useUserStore();

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [signatureBase64String, setSignatureBase64String] = useState("");

  const user = getUser();
  console.log("User data:", user);
  if (user) {
    Object.entries(user).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
  } else {
    console.log("No user data available");
  }

  const handleNext = async () => {
    if (!user) {
      console.error("No user data available");
      return;
    }

    // Prepare user data for API
    const userData = {
      name: user.name,
      birthDate: user.birthDate ? user.birthDate : null,
      gender: user.gender,
      hearingStatus: user.hearingStatus,
      address: user.address,
      contactNumber: user.contactNumber,
      photo: user.photo,
      parentConsent: user.parentConsent,
      signedConsent: true, // Explicitly set as signed
      communityWorkerId: user.communityWorkerId,
    };

    setIsLoading(true);
    setError("");

    try {
      const apiResponse = await addRecord(userData);

      console.log("API Response:", apiResponse);

      if (apiResponse && apiResponse.id) {
        updateUser({
          userId: apiResponse.id,
          signedConsent: true,
        });
        console.log("Success", "User added successfully!");
        router.push("/record/");
      } else {
        throw new Error("Invalid API response. Missing `id`.");
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
      setError(error.error || "Failed to add user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyle = (inputValue: string) => ({
    borderColor: inputValue ? Colors.tint : "#E5E7EB",
  });

  const getIconColor = (inputValue: string): string => {
    return inputValue ? Colors.tint : Colors.secondaryText;
  };

  const checkIfInputsAreFilled = !name || !signatureBase64String;

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={true}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>
          {t("addSignatureScreen.headerText")}
        </Text>

        <View style={[styles.inputField, getInputStyle(name)]}>
          <Feather
            name="user"
            size={20}
            color={getIconColor(name)}
            style={styles.icon}
          />
          <TextInput
            placeholder={t("addSignatureScreen.namePlaceholder")}
            placeholderTextColor={Colors.secondaryText}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View
          style={{
            height: "65%",
            width: "100%",
          }}
        >
          {/* <Text style={styles.formText}>Signature Box here</Text> */}
          <SignatureBox
            onOK={(signature) => setSignatureBase64String(signature)}
          />
        </View>

        {/* Submit Button */}
        <PrimaryButton
          style={{ marginTop: 20 }}
          type="large"
          onPress={handleNext}
          disabled={checkIfInputsAreFilled}
        >
          {t("addSignatureScreen.addSignatureButton")}
        </PrimaryButton>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    marginBottom: 20,
    fontSize: 14,
    textAlign: "center",
    color: Colors.tint,
  },
  icon: {
    marginRight: 10,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F9FAFB",
    height: 56,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 15,
  },
  formText: {
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Dim the background for modal
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  picker: {
    width: "100%",
  },
  dateTimePicker: {
    width: "100%",
    backgroundColor: "white",
  },
  dateTimePickerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  dateTimePickerFooterText: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#006ee6",
  },
});

```

`cleftCare/app/(tabs)/(index)/add-record/parent-consent.tsx`:

```tsx
import {
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import PrimaryButton from "@/components/PrimaryButton";
import { useUserStore } from "@/lib/store";

export default function Screen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { getUser, updateUser } = useUserStore();
  const user = getUser();
  console.log("User data:", user);
  if (user) {
    Object.entries(user).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
  } else {
    console.log("No user data available");
  }

  const handleNext = () => {
    updateUserStore();
    router.push("/add-record/add-signature");
  };

  const updateUserStore = () => {
    updateUser({
      parentConsent: true,
    });
  };

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={true}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 100 })}
      >
        <ScrollView style={styles.container}>
          <Text style={styles.headerText}>
            {t("parentConsentScreen.headerText")}
          </Text>

          <Text style={styles.formText}>
            {t("parentConsentScreen.formText")}
          </Text>

          {/* Submit Button */}
          <PrimaryButton
            style={{ marginTop: 20 }}
            type="large"
            onPress={handleNext}
          >
            {t("parentConsentScreen.addSignatureButton")}
          </PrimaryButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    marginBottom: 20,
    fontSize: 14,
    textAlign: "center",
    color: Colors.tint,
  },
  icon: {
    marginRight: 10,
  },
  formText: {
    fontSize: 16,
    marginVertical: 15,
    textAlign: "left",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Dim the background for modal
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  picker: {
    width: "100%",
  },
  dateTimePicker: {
    width: "100%",
    backgroundColor: "white",
  },
  dateTimePickerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  dateTimePickerFooterText: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#006ee6",
  },
});

```

`cleftCare/app/(tabs)/(index)/add-record/_layout.tsx`:

```tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function Layout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Add Children Record",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="parent-consent"
        options={{
          title: "Consent Form",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="add-signature"
        options={{
          title: "Add Signature",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}

```

`cleftCare/app/(tabs)/tutorials.tsx`:

```tsx
import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";

export default function Screen() {
  return (
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
            Tutorials
          </Animated.Text>
        </View>
      </View>
    </Page>
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
});

```

`cleftCare/app/+not-found.tsx`:

```tsx
import { Link, Stack } from "expo-router";
import { StyleSheet, View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});

```

`cleftCare/app/_layout.tsx`:

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import Colors from "@/constants/Colors";
import "react-native-get-random-values";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "@/i18n/locales/en.json";
import kn from "@/i18n/locales/kn.json";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "login",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const resources = {
    en: { translation: en },
    kn: { translation: kn },
  };

  // Initialize i18next
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Check if a language is stored in AsyncStorage
        const storedLanguage = await AsyncStorage.getItem("user-language");
        const languageToSet = storedLanguage || "en"; // Default to English
        await i18n.use(initReactI18next).init({
          compatibilityJSON: "v4",
          resources,
          lng: languageToSet,
          fallbackLng: "en",
          interpolation: {
            escapeValue: false,
          },
        });
        setLanguageLoaded(true); // Mark i18n as initialized
      } catch (err) {
        console.error("Error initializing i18n:", err);
        setLanguageLoaded(true); // Proceed even if initialization fails
      }
    };

    initializeLanguage();
  }, []);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && languageLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, languageLoaded]);

  if (!loaded || !languageLoaded) {
    return null; // Render nothing while fonts or language are loading
  }

  return <RootLayoutNav isFirstLaunch={isFirstLaunch} />;
}

function RootLayoutNav({ isFirstLaunch }: { isFirstLaunch: boolean }) {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modals)/help-center"
            options={{
              title: "Help Center",
              headerShadowVisible: false,
              headerStyle: { backgroundColor: "white" },
              headerLeft: () => <View />,
              headerRight: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="close-outline" size={30} color="black" />
                </TouchableOpacity>
              ),
              presentation: "fullScreenModal",
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

```

`cleftCare/app/(modals)/help-center.tsx`:

```tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  View,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "expo-router";

export default function Screen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");

  const getInputStyle = (inputValue: string) => ({
    borderColor: inputValue ? Colors.tint : "#E5E7EB",
  });

  const getIconColor = (inputValue: string): string => {
    return inputValue ? Colors.tint : Colors.secondaryText;
  };

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={true}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 100 })}
      >
        <ScrollView style={styles.container}>
          <Text style={styles.headerText}>
            {t("helpCenterScreen.headerText")}
          </Text>

          <View style={[styles.inputField, getInputStyle(mail)]}>
            <Feather
              name="mail"
              size={20}
              color={getIconColor(mail)}
              style={styles.icon}
            />
            <TextInput
              placeholder={t("helpCenterScreen.emailPlaceholder")}
              placeholderTextColor={Colors.secondaryText}
              value={mail}
              onChangeText={setMail}
            />
          </View>

          <View style={[styles.messageField, getInputStyle(message)]}>
            <TextInput
              placeholder={t("helpCenterScreen.messagePlaceholder")}
              placeholderTextColor={Colors.secondaryText}
              multiline
              numberOfLines={8}
              value={message}
              onChangeText={setMessage}
              style={{ textAlignVertical: "top" }}
            />
          </View>

          {/* Submit Button */}
          <PrimaryButton
            style={{ marginTop: 50 }}
            type="large"
            onPress={() => console.log("Message Sent")}
          >
            {t("helpCenterScreen.submitButton")}
          </PrimaryButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: Colors.secondaryText,
  },
  icon: {
    marginRight: 10,
  },
  inputField: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    height: 56,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 15,
  },
  messageField: {
    marginTop: 30,
    backgroundColor: "#F9FAFB",
    minHeight: 300,
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
});

```

`cleftCare/app.json`:

```json
{
  "expo": {
    "name": "Cleft Care",
    "slug": "cleftCare",
    "version": "1.0.2",
    "orientation": "portrait",
    "icon": "./assets/images/cleftcare-icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.amprow.cleftCare"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/cleftcare-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": ["android.permission.RECORD_AUDIO"],
      "package": "com.amprow.cleftCare"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos."
        }
      ],
      "expo-localization",
      [
        "expo-build-properties",
        {
          "android": {
            "usesCleartextTraffic": true
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}

```

`cleftCare/constants/Colors.ts`:

```ts
const tintColorLight = "#199A8E";

export default {
  text: "#000",
  secondaryText: "#7C7C7C",
  background: "#fff",
  tint: tintColorLight,
  tabIconDefault: "#ccc",
  tabIconSelected: tintColorLight,
};

```

`cleftCare/constants/SampleData.ts`:

```ts
import { UserInfo } from "@/lib/store";
import { randomUUID } from "expo-crypto";

export const SampleData: UserInfo[] = [
  {
    userId: randomUUID(),
    name: "Priya Patel",
    birthDate: new Date(),
    gender: "Female",
    hearingStatus: "Yes, I have hearing loss",
    address: "Mumbai",
    contactNumber: "1234567890",
    photo: "photo_url_1",
  },
  {
    userId: randomUUID(),
    name: "Vijay Agvanti",
    birthDate: new Date(),
    gender: "Male",
    hearingStatus: "Yes, I have hearing loss",
    address: "Pune",
    contactNumber: "1234567890",
    photo: "photo_url_2",
  },
  {
    userId: randomUUID(),
    name: "Anita Sharma",
    birthDate: new Date(1987, 4, 23),
    gender: "Female",
    hearingStatus: "No, I have no hearing loss",
    address: "Delhi",
    contactNumber: "9876543210",
    photo: "photo_url_3",
  },
  {
    userId: randomUUID(),
    name: "Rohit Mehra",
    birthDate: new Date(1990, 7, 17),
    gender: "Male",
    hearingStatus: "Yes, I have hearing loss",
    address: "Chennai",
    contactNumber: "9876543120",
    photo: "photo_url_4",
  },
  {
    userId: randomUUID(),
    name: "Sara Khan",
    birthDate: new Date(1995, 11, 11),
    gender: "Female",
    hearingStatus: "No, I have no hearing loss",
    address: "Hyderabad",
    contactNumber: "9654321098",
    photo: "photo_url_5",
  },
  {
    userId: randomUUID(),
    name: "Aman Verma",
    birthDate: new Date(2000, 6, 5),
    gender: "Male",
    hearingStatus: "No, I have no hearing loss",
    address: "Bangalore",
    contactNumber: "9765432180",
    photo: "photo_url_6",
  },
  {
    userId: randomUUID(),
    name: "Neha Gupta",
    birthDate: new Date(1998, 2, 22),
    gender: "Female",
    hearingStatus: "Yes, I have hearing loss",
    address: "Kolkata",
    contactNumber: "9876543109",
    photo: "photo_url_7",
  },
];

```

`cleftCare/README.md`:

```md
# Cleft Care

**Cleft Care**, a speech analysis mobile application built with **Expo**, **React Native**, **Docker**, **AWS**, **Google Cloud Run**, and **PostgreSQL**, designed to collect, process, and evaluate speech samples for clinicians globally. Includes a fine-tuned a **custom deep neural network model** for precise speech analysis, with backend APIs served via **Docker**, **AWS Lambda**, and **Google Cloud Run**. Seamless data workflows and efficient audio recording functionalities, enabling secure storage and real-time analysis through **AWS S3** and **OHM Model APIs**. Multilingual support and robust authentication mechanisms, enhancing clinicians' ability to access, analyze, and manage patient data effortlessly across borders.

- **Cleft Care API:** [Cleft Care API Repository](https://github.com/ameyalambat128/cleftcare-api)
- **OHM Model Inference API:** [OHM Inference API Repository](https://github.com/ameyalambat128/cleftcare-ohm-api)

## Features

### Core Functionalities:

- **User Authentication:** Secure login and user session management.
- **Record Management:** Add, edit, and manage patient records with details such as name, birthdate, gender, address, and hearing status.
- **Audio Recording:** Integrated audio recording and file uploads to AWS S3 for OHM analysis.
- **OHM Integration:** Real-time audio analysis with OHM Model API for predictive metrics.
- **Multilingual Support:** Available in **English** and **Kannada** using `i18n`.

## Setup and Installation

### **1. Prerequisites**

Ensure the following are installed:

- **Node.js** (v16+)
- **Expo CLI**
- **Android Studio** (For Android Emulator)
- **Xcode** (For iOS Simulator)

### **2. Installation**

Clone the repository and install dependencies:

```shell
git clone https://github.com/ameyalambat128/cleftcare-api.git
cd cleftCare
npm install
```

### **3. Build for Android**

To create a production build for Android:

```shell
cd android && ./gradlew assembleRelease
```

### **4. Install on Emulator with adb**

Deploy the APK to an emulator:

```shell
adb install /Users/ameya/Code/digitaldx/cleftCare/android/app/build/outputs/apk/release/app-release.apk
```

### **5. Start the Development Server**

Start the Expo development server:

```shell
bun start
```

Android Emulator TCP port re-mapping (for localhost API requests)

```shell
adb reverse tcp:3000 tcp:3000
```

```

`cleftCare/components/ExternalLink.tsx`:

```tsx
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';

export function ExternalLink(
  props: Omit<React.ComponentProps<typeof Link>, 'href'> & { href: string }
) {
  return (
    <Link
      target="_blank"
      {...props}
      // @ts-expect-error: External URLs are not typed.
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          e.preventDefault();
          // Open the link in an in-app browser.
          WebBrowser.openBrowserAsync(props.href as string);
        }
      }}
    />
  );
}

```

`cleftCare/components/RecordItem.tsx`:

```tsx
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type RecordItemProps = {
  userId: string;
  name: string;
  birthDate: string | null;
  onPress?: () => void;
};

export default function RecordItem({
  userId,
  name,
  birthDate,
  onPress,
}: RecordItemProps) {
  const formatBirthDate = (dateString: string | null): string => {
    if (!dateString) return "Not available";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Not available";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString(undefined, options);
  };

  const formattedBirthDate = formatBirthDate(birthDate);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.recordItem,
        pressed && styles.pressedRecordItem,
      ]}
    >
      {({ pressed }) => (
        <>
          <View style={styles.recordItemText}>
            <Text
              style={[styles.recordName, pressed && { color: Colors.tint }]}
            >
              {name}
            </Text>
            <Text style={styles.recordId}>
              Birth Date: {formattedBirthDate}
            </Text>
          </View>
          <Feather
            name="chevron-right"
            size={24}
            color={pressed ? Colors.tint : "black"}
          />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  recordItem: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 30,
  },
  pressedRecordItem: {
    backgroundColor: "rgba(25, 154, 142, 0.25)",
    borderColor: "rgba(25, 154, 142, 0.25)",
    color: Colors.tint,
  },
  recordItemText: {
    display: "flex",
    flexDirection: "column",
  },
  recordName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  recordId: {
    color: Colors.secondaryText,
    fontSize: 14,
  },
});

```

`cleftCare/components/PrimaryButton.tsx`:

```tsx
import Colors from "@/constants/Colors";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type ButtonProps = TouchableOpacity["props"] & {
  type: "large" | "medium" | "small";
};

export default function PrimaryButton({
  children,
  style,
  disabled,
  type,
  ...otherProps
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        type === "large"
          ? styles.buttonLarge
          : type === "medium"
          ? styles.buttonMedium
          : styles.buttonSmall,
        disabled ? styles.buttonDisabled : {},
        style,
      ]}
      disabled={disabled}
      {...otherProps}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonLarge: {
    backgroundColor: Colors.tint,
    width: "100%",
    borderRadius: 32,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonMedium: {
    backgroundColor: Colors.tint,
    width: "70%",
    borderRadius: 32,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSmall: {
    backgroundColor: Colors.tint,
    width: "50%",
    borderRadius: 32,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#d3d3d3", // Light gray color for disabled state
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

```

`cleftCare/components/useColorScheme.ts`:

```ts
export { useColorScheme } from 'react-native';

```

`cleftCare/components/SignatureBox.tsx`:

```tsx
import Colors from "@/constants/Colors";
import React, { useRef } from "react";
import { StyleSheet, View, Button } from "react-native";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";

type SignatureBoxProps = {
  onOK: (signature: string) => void;
};

export default function SignatureBox({ onOK }: SignatureBoxProps) {
  const ref = useRef<SignatureViewRef>(null);

  const handleSignature = (signature: string) => {
    // console.log(signature);
    onOK(signature);
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  const handleClear = () => {
    console.log("clear success!");
  };

  const handleEnd = () => {
    ref.current?.readSignature();
  };

  const style = `.m-signature-pad--footer .button {
      background-color: ${Colors.tint};
      color: #FFF;
    }{display: none; margin: 0px; color: black;}`;

  return (
    <View style={styles.container}>
      <SignatureScreen
        ref={ref}
        onOK={handleSignature}
        onEmpty={handleEmpty}
        onClear={handleClear}
        webStyle={style}
        descriptionText="Add Your Sign Here"
        confirmText="Save"
        clearText="Clear"
      />
      {/* <View style={styles.row}>
        <Button title="Clear" onPress={handleClear} />
        <Button title="Confirm" onPress={handleConfirm} />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    marginTop: 30,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
});

```

`cleftCare/components/Page.tsx`:

```tsx
import Colors from "@/constants/Colors";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ViewProps = View["props"] & {
  headerShown: boolean;
};

export default function Page(props: ViewProps) {
  const { children, style, headerShown, ...otherProps } = props;
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={[
        !headerShown && {
          paddingTop: top,
          backgroundColor: Colors.background,
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </View>
  );
}

```

`cleftCare/babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};

```

`cleftCare/package.json`:

```json
{
  "name": "cleftcare",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "prebuild": "expo prebuild",
    "doctor": "npx expo-doctor@latest",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "test": "jest --watchAll"
  },
  "jest": {
    "preset": "jest-expo"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.668.0",
    "@expo/config-plugins": "^7.8.0",
    "@expo/vector-icons": "^14.0.0",
    "@gorhom/bottom-sheet": "^4",
    "@react-native-async-storage/async-storage": "1.21.0",
    "@react-native-community/datetimepicker": "7.7.0",
    "@react-native-picker/picker": "2.6.1",
    "@react-navigation/native": "^6.0.2",
    "@types/uuid": "^10.0.0",
    "axios": "^1.7.7",
    "expo": "~50.0.20",
    "expo-av": "~13.10.6",
    "expo-build-properties": "~0.11.1",
    "expo-crypto": "~12.8.1",
    "expo-dev-client": "~3.3.12",
    "expo-file-system": "~16.0.9",
    "expo-font": "~11.10.3",
    "expo-image-picker": "~14.7.1",
    "expo-linking": "~6.2.2",
    "expo-localization": "~14.8.4",
    "expo-router": "~3.4.10",
    "expo-splash-screen": "~0.26.5",
    "expo-status-bar": "~1.11.1",
    "expo-system-ui": "~2.9.4",
    "expo-web-browser": "~12.8.2",
    "i18next": "^24.0.2",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-i18next": "^15.1.3",
    "react-native": "0.73.6",
    "react-native-gesture-handler": "~2.14.0",
    "react-native-get-random-values": "~1.8.0",
    "react-native-reanimated": "~3.6.2",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "react-native-signature-canvas": "^4.7.2",
    "react-native-web": "~0.19.6",
    "react-native-webview": "13.6.4",
    "uuid": "^10.0.0",
    "zustand": "^5.0.0-rc.2"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "jest": "^29.2.1",
    "jest-expo": "~50.0.4",
    "react-test-renderer": "18.2.0",
    "typescript": "^5.1.3"
  },
  "private": true
}

```

`cleftCare/lib/utils.ts`:

```ts
export const formatDuration = (durationMillis: number): string => {
  let totalSeconds = Math.round(durationMillis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Ensuring that the seconds are represented as a single digit with one decimal place
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${minutes}:${formattedSeconds}`;
};

```

`cleftCare/lib/api.ts`:

```ts
import axios from "axios";
import { UserInfo } from "./store";
// import { DEV_ENV, CLEFTCARE_API_KEY } from "@/constants/Data";

const OHM_API_BASE_URL = "https://cleftcare-ohm-1067608021780.us-east1.run.app";
const PROD = process.env.EXPO_PUBLIC_DEV_ENV === "production" ? true : false;
const API_BASE_URL = PROD
  ? "https://jkneev16h9.execute-api.us-east-1.amazonaws.com/"
  : "http://localhost:3000";
const CLEFTCARE_API_KEY =
  "1ddf243a713c55eedad668badabdbc4deb940ba454ef0fd770e4da1baedc0d90";

// const OHM_API_BASE_URL = "https://cleftcare-ohm-1067608021780.us-east1.run.app";
// const PROD = DEV_ENV === "production" ? true : false;
// const API_BASE_URL = PROD
//   ? "https://jkneev16h9.execute-api.us-east-1.amazonaws.com/"
//   : "http://localhost:3000";

export const predictOhmRating = async (
  userId: string,
  name: string,
  promptNumber: number,
  uploadFileName: string
) => {
  try {
    const response = await axios.post(`${OHM_API_BASE_URL}/predict`, {
      userId,
      name,
      promptNumber,
      uploadFileName,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending POST request:", error);
    throw error;
  }
};

export const testProdApi = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data;
  } catch (error: any) {
    console.error("Error testing API:", error.response?.data || error.message);
    throw error.response?.data || { error: "Network or server error" };
  }
};

export const validateLogin = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login?apiKey=${CLEFTCARE_API_KEY}`,
      {
        emailId: email,
      }
    );
    return response.data;
  } catch (error: any) {
    console.log(
      "Error validating login:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Network or server error" };
  }
};

export const getRecordsByCommunityWorkerId = async (
  communityWorkerId: string
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/community-workers/${communityWorkerId}/users?apiKey=${CLEFTCARE_API_KEY}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching records by community worker ID:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Failed to fetch records" };
  }
};

export const getRecordByUserId = async (userId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/users/${userId}?apiKey=${CLEFTCARE_API_KEY}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching record by User ID:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Failed to fetch record" };
  }
};

export const addRecord = async (record: Partial<UserInfo>) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/add-user?apiKey=${CLEFTCARE_API_KEY}`,
      record
    );
    return response.data;
  } catch (error: any) {
    console.error("Error adding user:", error.response?.data || error.message);
    throw error.response?.data || { error: "Failed to add user" };
  }
};

export const updateRecord = async (
  userId: string,
  record: Partial<UserInfo>
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/users/${userId}?apiKey=${CLEFTCARE_API_KEY}`,
      record
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Failed to update user" };
  }
};

```

`cleftCare/lib/aws.ts`:

```ts
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.EXPO_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_KEY,
  },
});

export { s3Client };

```

`cleftCare/lib/store.ts`:

```ts
import { create } from "zustand";

export type UserInfo = {
  userId: string;
  name: string;
  birthDate: Date | null;
  gender: "Male" | "Female" | "Other" | undefined;
  hearingStatus:
    | "Yes, I have hearing loss"
    | "No, I have no hearing loss"
    | undefined;
  address: string;
  contactNumber: string;
  photo: string;
  parentConsent: boolean;
  signedConsent: boolean;
  communityWorkerId: string;
};

type UserStore = {
  user: UserInfo | null;
  getUser: () => UserInfo | null;
  setUser: (user: UserInfo) => void;
  updateUser: (updatedUser: Partial<UserInfo>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,

  getUser: () => get().user,

  setUser: (user) =>
    set(() => ({
      user,
    })),

  updateUser: (updatedUser) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : null,
    })),

  clearUser: () =>
    set(() => ({
      user: null,
    })),
}));

type AllUsersStore = {
  users: UserInfo[]; // Array to hold multiple users
  addUser: (user: UserInfo) => void; // Function to add a new user
  updateUser: (id: string, updatedUser: Partial<UserInfo>) => void; // Function to update an existing user
  removeUser: (id: string) => void; // Function to remove a user
  getUserById: (id: string) => UserInfo | undefined; // Function to retrieve a user by their ID
  setUsers: (users: UserInfo[]) => void; // Load an array of users (e.g., from AsyncStorage)
};

export const useAllUsersStore = create<AllUsersStore>((set, get) => ({
  users: [],

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user], // Add new user to the array
    })),

  updateUser: (id, updatedUser) =>
    set((state) => ({
      users: state.users.map(
        (user) => (user.userId === id ? { ...user, ...updatedUser } : user) // Update only the matching user
      ),
    })),

  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.userId !== id), // Remove user by filtering them out
    })),

  getUserById: (id) => get().users.find((user) => user.userId === id), // Find a user by their ID

  setUsers: (users) =>
    set(() => ({
      users, // Set the entire array of users, useful for loading from persistence (e.g., AsyncStorage)
    })),
}));

```

`cleftCare/tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}

```

`cleftCare/i18n/locales/en.json`:

```json
{
  "homeScreen": {
    "title": "Cleft Care",
    "viewRecords": "View Children records",
    "noRecordsMessage": "Children's records are empty.",
    "addRecordPrompt": "Please add a new one."
  },
  "helpCenterScreen": {
    "headerText": "Need help? Please let us know",
    "emailPlaceholder": "Enter your email",
    "messagePlaceholder": "Enter your message here",
    "submitButton": "Submit"
  },
  "addRecordScreen": {
    "headerText": "Please enter child's information to continue with the audio recording",
    "namePlaceholder": "Enter your name",
    "birthDatePlaceholder": "Select Birth Date",
    "genderPlaceholder": "Select Gender",
    "genderMale": "Male",
    "genderFemale": "Female",
    "genderOther": "Other",
    "hearingStatusPlaceholder": "Hearing Status",
    "hearingYes": "Yes, I have hearing loss",
    "hearingNo": "No, I have no hearing loss",
    "addressPlaceholder": "Enter your Address",
    "contactNumberPlaceholder": "Contact number",
    "nextButton": "Next"
  },
  "parentConsentScreen": {
    "headerText": "Please carefully read and review the consent form to ensure the best care for your child.",
    "formText": "I, [Parent/Guardian Name], consent to my child, [Child’s Name], using the CleftCare app, which supports care management for cleft conditions by providing personalized resources, appointment tracking, and educational materials. I understand the app will collect and store necessary personal and health-related information, which will be securely handled in compliance with privacy regulations. I acknowledge that I can revoke this consent at any time by contacting CleftCare support at [support contact information].",
    "signatureLabel": "Add Signature",
    "addSignatureButton": "Add Signature"
  },
  "addSignatureScreen": {
    "headerText": "Please provide additional details and then add your full name as signature.",
    "namePlaceholder": "Enter your full name",
    "addSignatureButton": "Add Signature"
  },
  "recordingScreen": {
    "prompt1": "Crow's leg is black",
    "prompt2": "Father Patata",
    "startRecording": "Press the audio icon to start recording",
    "recordingStarted": "Recording started...",
    "uploading": "Audio is uploading...",
    "done": "Done",
    "reRecord": "To Re-Record press the mic button.",
    "nextButton": "Next",
    "recordings": "Recordings"
  },
  "audioSaveModal": {
    "title": "All audio is saved!",
    "subtitle": "Go to home to see the details of children records",
    "buttonText": "Back to Home"
  },
  "editRecordScreen": {
    "headerText": "Edit child's information based on your requirements",
    "namePlaceholder": "Enter your name",
    "birthDatePlaceholder": "Select Birth Date",
    "genderPlaceholder": "Select Gender",
    "genderMale": "Male",
    "genderFemale": "Female",
    "genderOther": "Other",
    "hearingStatusPlaceholder": "Hearing Status",
    "hearingYes": "Yes, I have hearing loss",
    "hearingNo": "No, I have no hearing loss",
    "addressPlaceholder": "Enter your Address",
    "contactNumberPlaceholder": "Contact number",
    "updateButton": "Update"
  }
}

```

`cleftCare/i18n/locales/kn.json`:

```json
{
  "homeScreen": {
    "title": "Cleft Care",
    "viewRecords": "ಮಕ್ಕಳ ದಾಖಲೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    "noRecordsMessage": "ಮಕ್ಕಳ ದಾಖಲೆಗಳು ಖಾಲಿಯಾಗಿದೆ.",
    "addRecordPrompt": "ದಯವಿಟ್ಟು ಹೊಸದನ್ನು ಸೇರಿಸಿ."
  },
  "helpCenterScreen": {
    "headerText": "ಸಹಾಯ ಬೇಕೇ? ದಯವಿಟ್ಟು ನಮಗೆ ತಿಳಿಸಿ",
    "emailPlaceholder": "ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ",
    "messagePlaceholder": "ಇಲ್ಲಿ ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ",
    "submitButton": "ಸಲ್ಲಿಸಿ"
  },
  "addRecordScreen": {
    "headerText": "ಆಡಿಯೊ ದಾಖಲೆಯನ್ನು ಮುಂದುವರಿಸಲು ದಯವಿಟ್ಟು ಮಗುವಿನ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ",
    "namePlaceholder": "ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    "birthDatePlaceholder": "ಜನ್ಮ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "genderPlaceholder": "ಲಿಂಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "genderMale": "ಗಂಡು",
    "genderFemale": "ಹೆಣ್ಣು",
    "genderOther": "ಇತರ",
    "hearingStatusPlaceholder": "ಶ್ರವಣ ಸ್ಥಿತಿ",
    "hearingYes": "ಹೌದು, ನನಗೆ ಶ್ರವಣದ ಕಳೆತ ಇದೆ",
    "hearingNo": "ಇಲ್ಲ, ನನಗೆ ಶ್ರವಣದ ಕಳೆತವಿಲ್ಲ",
    "addressPlaceholder": "ನಿಮ್ಮ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ",
    "contactNumberPlaceholder": "ಸಂಪರ್ಕ ಸಂಖ್ಯೆ",
    "nextButton": "ಮುಂದೆ"
  },
  "parentConsentScreen": {
    "headerText": "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮಗುವಿಗೆ ಉತ್ತಮ ಆರೈಕೆ ನೀಡಲು ಸಮಮತಿಯನ್ನು ಓದಿ ಮತ್ತು ಪರಿಶೀಲಿಸಿ.",
    "formText": "ನಾನು, [ಪೋಷಕರು/ಪೋಷಕರ ಹೆಸರು], ನನ್ನ ಮಗು [ಮಗುವಿನ ಹೆಸರು] ಕ್ಲೆಫ್ಟ್‌ಕೇರ್ ಆಪ್ ಅನ್ನು ಬಳಸಲು ಸಮಮತಿಯನ್ನು ನೀಡುತ್ತೇನೆ, ಇದು ವೈಯಕ್ತಿಕ ಸಂಪತ್ತುಗಳು, ನೇಮಕಾತಿ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಸಾಮಗ್ರಿಗಳನ್ನು ಒದಗಿಸುವ ಮೂಲಕ ಕ್ಲೆಫ್ಟ್ ಸ್ಥಿತಿಗಳಿಗೆ ಆರೈಕೆಯನ್ನು ನಿರ್ವಹಿಸಲು ಬೆಂಬಲಿಸುತ್ತದೆ. ಆಪ್ ಅಗತ್ಯವಾದ ವೈಯಕ್ತಿಕ ಮತ್ತು ಆರೋಗ್ಯ ಸಂಬಂಧಿತ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸು ಮತ್ತು ಸಂಗ್ರಹಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ, ಇದು ಗೌಪ್ಯತಾ ನಿಯಮಾವಳಿಗಳನ್ನು ಅನುಸರಿಸುವ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ನಿರ್ವಹಿಸಲಾಗುತ್ತದೆ. ನಾನು ಯಾವಾಗಲಾದರೂ [ಸಹಾಯ ಸಂಪರ್ಕ ಮಾಹಿತಿ] ನಲ್ಲಿ ಕ್ಲೆಫ್ಟ್‌ಕೇರ್ ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸುವ ಮೂಲಕ ಈ ಸಮಮತಿಯನ್ನು ಹಿಂತೆಗೆದುಕೊಳ್ಳಬಹುದು ಎಂಬುದನ್ನು ನಾನು ಒಪ್ಪುತ್ತೇನೆ.",
    "signatureLabel": "ಹಸ್ತಾಕ್ಷರವನ್ನು ಸೇರಿಸಿ",
    "addSignatureButton": "ಹಸ್ತಾಕ್ಷರವನ್ನು ಸೇರಿಸಿ"
  },
  "addSignatureScreen": {
    "headerText": "ದಯವಿಟ್ಟು ಹೆಚ್ಚಿನ ವಿವರಗಳನ್ನು ನೀಡಿರಿ ಮತ್ತು ನಂತರ ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಹೆಸರನ್ನು ಹಸ್ತಾಕ್ಷರವಾಗಿ ಸೇರಿಸಿ.",
    "namePlaceholder": "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    "addSignatureButton": "ಹಸ್ತಾಕ್ಷರವನ್ನು ಸೇರಿಸಿ"
  },
  "recordingScreen": {
    "prompt1": "ಕಾಗೆ ಕಾಲು ಕಪ್ಪು",
    "prompt2": "ಅಪ್ಪಾ ಪಟಾತಾ",
    "startRecording": "ಆಡಿಯೊ ಐಕಾನ್ ಒತ್ತಿ ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಲು",
    "recordingStarted": "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭವಾಗಿದೆ...",
    "uploading": "ಆಡಿಯೊ ಅಪ್ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    "done": "ಮುಗಿಯಿತು",
    "reRecord": "ಮತ್ತೊಮ್ಮೆ ರೆಕಾರ್ಡಿಂಗ್ ಮಾಡಲು ಮೈಕ್ ಬಟನ್ ಒತ್ತಿ.",
    "nextButton": "ಮುಂದೆ",
    "recordings": "ರೆಕಾರ್ಡಿಂಗ್‌ಗಳು"
  },
  "audioSaveModal": {
    "title": "ಎಲ್ಲಾ ಆಡಿಯೊ ಉಳಿಸಲಾಗಿದೆ!",
    "subtitle": "ಮಕ್ಕಳ ದಾಖಲೆಗಳ ವಿವರಗಳನ್ನು ನೋಡಲು ಹೋಮ್‌ಗೆ ಹೋಗಿ",
    "buttonText": "ಮನೆಗೆ ಹಿಂತಿರುಗಿ"
  },
  "editRecordScreen": {
    "headerText": "ನಿಮ್ಮ ಅವಶ್ಯಕತೆಗಳ ಆಧಾರದ ಮೇಲೆ ಮಗುವಿನ ಮಾಹಿತಿಯನ್ನು ಸಂಪಾದಿಸಿ",
    "namePlaceholder": "ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    "birthDatePlaceholder": "ಜನ್ಮ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "genderPlaceholder": "ಲಿಂಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "genderMale": "ಗಂಡು",
    "genderFemale": "ಹೆಣ್ಣು",
    "genderOther": "ಇತರ",
    "hearingStatusPlaceholder": "ಶ್ರವಣ ಸ್ಥಿತಿ",
    "hearingYes": "ಹೌದು, ನನಗೆ ಶ್ರವಣದ ಕಳೆತ ಇದೆ",
    "hearingNo": "ಇಲ್ಲ, ನನಗೆ ಶ್ರವಣದ ಕಳೆತವಿಲ್ಲ",
    "addressPlaceholder": "ನಿಮ್ಮ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ",
    "contactNumberPlaceholder": "ಸಂಪರ್ಕ ಸಂಖ್ಯೆ",
    "updateButton": "ನವೀಕರಿಸಿ"
  }
}

```