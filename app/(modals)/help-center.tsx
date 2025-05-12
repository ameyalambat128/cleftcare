import { useState } from "react";
import {
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  View,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "expo-router";

export default function Screen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [mail, setMail] = useState("cleftcareasu@gmail.com");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleNext = () => {
    setShowModal(true);
    console.log("Message Sent", mail, message);
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.replace("/");
  };

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
              editable={false}
              style={{ color: Colors.text }}
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
            onPress={handleNext}
          >
            {t("helpCenterScreen.submitButton")}
          </PrimaryButton>

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
                <Text style={styles.modalTitle}>
                  {t("helpCenterMailSentModal.title")}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {t("helpCenterMailSentModal.subtitle")}
                </Text>
                <PrimaryButton
                  style={{ marginTop: 20 }}
                  type="medium"
                  onPress={handleModalClose}
                >
                  {t("helpCenterMailSentModal.buttonText")}
                </PrimaryButton>
              </View>
            </TouchableOpacity>
          </Modal>
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
