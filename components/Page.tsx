import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ViewProps = View["props"];

export default function Page(props: ViewProps) {
  const { children, style, ...otherProps } = props;
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={[
        {
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
