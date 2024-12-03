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
