import Colors from "@/constants/Colors";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type ButtonProps = TouchableOpacity["props"] & {
  type: "large" | "small";
};

export default function PrimaryButton(props: ButtonProps) {
  const { children, style, type, ...otherProps } = props;
  return (
    <TouchableOpacity
      style={[
        type === "large" ? styles.buttonLarge : styles.buttonSmall,
        style,
      ]}
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
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSmall: {
    backgroundColor: Colors.tint,
    width: "50%",
    borderRadius: 309,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
