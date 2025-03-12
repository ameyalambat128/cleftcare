import Colors from "@/constants/Colors";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Button } from "react-native";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";

type SignatureBoxProps = {
  onOK: (signature: string) => void;
};

export default function SignatureBox({ onOK }: SignatureBoxProps) {
  const { t } = useTranslation();

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
        descriptionText={t("addSignatureScreen.signatureBoxDesc")}
        confirmText={t("addSignatureScreen.signatureBoxConfirm")}
        clearText={t("addSignatureScreen.signatureBoxClear")}
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
