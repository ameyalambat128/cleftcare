import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ViewProps = View["props"];

export default function Page(props: ViewProps) {
  const { children, style, ...otherProps } = props;
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </View>
  );
}
