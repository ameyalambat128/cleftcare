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

  const handleOK = (signature: string) => {
    console.log(signature);
    onOK(signature);
  };

  const handleClear = () => {
    ref.current?.clearSignature();
  };

  const handleConfirm = () => {
    console.log("end");
    ref.current?.readSignature();
  };

  const style = `.m-signature-pad--footer {display: none; margin: 0px; color: black;}`;

  return (
    <View style={styles.container}>
      <SignatureScreen
        ref={ref}
        onOK={handleOK}
        webStyle={style}
        descriptionText="Sign Here"
      />
      <View style={styles.row}>
        <Button title="Clear" onPress={handleClear} />
        <Button title="Confirm" onPress={handleConfirm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    padding: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
});
