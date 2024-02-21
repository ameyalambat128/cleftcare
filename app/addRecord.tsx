import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Page from "@/components/Page";
import Colors from "@/constants/Colors";

export default function Screen() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  return (
    <Page style={{ flex: 1 }} headerShown={true}>
      <View style={styles.container}>
        <Text style={styles.headerText}>
          Please enter child's information to continue with the audio recording
        </Text>

        {/* Name Input */}
        <View style={styles.inputField}>
          <Feather name="user" size={20} color="#8E8E93" style={styles.icon} />
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#8E8E93"
            value={name}
            onChangeText={setName}
            style={styles.inputText}
          />
        </View>

        {/* Birth Date Picker */}
        <TouchableOpacity
          style={styles.inputField}
          onPress={() => {
            // You need to implement a way to show the date picker on press
          }}
        >
          <Feather
            name="calendar"
            size={20}
            color="#8E8E93"
            style={styles.icon}
          />
          <Text style={styles.inputText}>{formatDate(birthDate)}</Text>
        </TouchableOpacity>

        {/* Gender Picker */}
        <TouchableOpacity
          style={styles.inputField}
          onPress={() => setPickerVisible(!isPickerVisible)}
        >
          <Feather name="user" size={20} color="#8E8E93" style={styles.icon} />
          <Text style={styles.inputText}>
            {gender ? gender : "Select Gender"}
          </Text>
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

        {/* Address Input */}
        <View style={styles.inputField}>
          <Feather name="home" size={20} color="#8E8E93" style={styles.icon} />
          <TextInput
            placeholder="Enter your Address"
            placeholderTextColor="#8E8E93"
            value={address}
            onChangeText={setAddress}
            style={styles.inputText}
          />
        </View>

        {/* Contact Number Input */}
        <View style={styles.inputField}>
          <Feather name="phone" size={20} color="#8E8E93" style={styles.icon} />
          <TextInput
            placeholder="Contact number"
            placeholderTextColor="#8E8E93"
            value={contactNumber}
            onChangeText={setContactNumber}
            style={styles.inputText}
            keyboardType="phone-pad"
          />
        </View>

        {/* Attachment Input */}
        <View style={styles.inputField}>
          <Feather
            name="paperclip"
            size={20}
            color="#8E8E93"
            style={styles.icon}
          />
          <Text style={styles.inputText}>Attachment</Text>
          {/* Implement attachment functionality */}
        </View>
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
    fontSize: 16,
    textAlign: "center",
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F5",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  inputText: {
    flex: 1,
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim the background
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%", // You might need to adjust the width
    alignItems: "center",
  },
  picker: {
    width: "100%", // Picker should fill its container
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
