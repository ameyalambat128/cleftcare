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
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </View>
  );
}
