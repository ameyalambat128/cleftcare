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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import Page from "@/components/Page";
import Colors from "@/constants/Colors";

export default function Screen() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [gender, setGender] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

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
      <View style={styles.container}>
        <Text style={styles.headerText}>
          Please enter child's information to continue with the audio recording
        </Text>
        {/* Name Input */}
        <View style={styles.inputField}>
          <Feather
            name="user"
            size={20}
            color={Colors.secondaryText}
            style={styles.icon}
          />
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor={Colors.secondaryText}
            value={name}
            onChangeText={setName}
            style={styles.inputText}
          />
        </View>

        {/* Birth Date Picker */}
        <TouchableOpacity
          style={styles.inputField}
          onPress={() => {
            setIsDatePickerVisible(true);
          }}
        >
          <Feather
            name="calendar"
            size={20}
            color={Colors.secondaryText}
            style={styles.icon}
          />
          {birthDate ? (
            <Text style={styles.inputText}>
              {(birthDate.getMonth() + 1).toString().padStart(2, "0") +
                "/" +
                birthDate.getDate().toString().padStart(2, "0") +
                "/" +
                birthDate.getFullYear()}
            </Text>
          ) : (
            <Text style={{ color: Colors.secondaryText }}>
              Select Birth Date
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
                    <Text style={styles.dateTimePickerFooterText}>Cancel</Text>
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
            style={styles.dateInputField}
            onPress={() => setPickerVisible(!isPickerVisible)}
          >
            <Feather name="users" size={20} color={Colors.secondaryText} />

            <Picker
              selectedValue={gender}
              mode="dropdown"
              onValueChange={(itemValue, itemIndex) => {
                setGender(itemValue);
                setPickerVisible(!isPickerVisible);
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
              style={styles.inputField}
              onPress={() => setPickerVisible(!isPickerVisible)}
            >
              <Feather
                name="users"
                size={20}
                color={Colors.secondaryText}
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
              visible={isPickerVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setPickerVisible(!isPickerVisible)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue, itemIndex) => {
                      setGender(itemValue);
                      setPickerVisible(!isPickerVisible);
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

        {/* Address Input */}
        <View style={styles.inputField}>
          <Feather name="home" size={20} color="#8E8E93" style={styles.icon} />
          <TextInput
            placeholder="Enter your Address"
            placeholderTextColor={Colors.secondaryText}
            value={address}
            onChangeText={setAddress}
            style={styles.inputText}
          />
        </View>

        {/* Contact Number Input */}
        <View style={styles.inputField}>
          <Feather
            name="phone"
            size={20}
            color={Colors.secondaryText}
            style={styles.icon}
          />
          <TextInput
            placeholder="Contact number"
            placeholderTextColor={Colors.secondaryText}
            value={contactNumber}
            onChangeText={setContactNumber}
            style={styles.inputText}
            keyboardType="phone-pad"
          />
        </View>

        {/* Attachment Input */}
        <TouchableOpacity
          style={styles.inputField}
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
          <Text style={{ color: Colors.secondaryText }}>Take/Choose Photo</Text>
        </TouchableOpacity>
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
    color: Colors.secondaryText,
  },
  inputField: {
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
  dateInputField: {
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
