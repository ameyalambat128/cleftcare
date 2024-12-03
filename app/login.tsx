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

  const handleLoginPress = () => {
    let isValid = true;
    if (!email) {
      setEmailError("* You must enter your email ID");
      isValid = false;
    } else if (!email.includes("@")) {
      setEmailError("* The Email ID you entered is wrong");
      isValid = false;
    } else if (!validEmails.includes(email)) {
      setEmailError("* The Email ID you entered is not registered");
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
