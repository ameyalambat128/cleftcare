import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import Page from "@/components/Page";
import RecordItem from "@/components/RecordItem";
import Colors from "@/constants/Colors";
import { SampleData } from "@/constants/SampleData";
import { UserInfo } from "@/lib/store";

export default function Screen() {
  const router = useRouter();

  const handleSearchPress = () => {
    router.push("/search-record");
  };

  const handleHelpPress = () => {
    router.push("/(modals)/help-center");
  };

  const handleAddRecordPress = () => {
    router.push("/add-record/");
  };

  const handleEditRecordPress = (id: string) => {
    router.push(`/edit-record/${id}`);
  };

  const getRecordCount = () => {
    return SampleData.length;
  };

  return (
    <Page style={{ flex: 1 }} headerShown={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Animated.Text
            entering={FadeInLeft.springify()}
            exiting={FadeOutLeft}
            style={styles.title}
          >
            Cleft Care
          </Animated.Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.icon} onPress={handleSearchPress}>
              <Feather name="search" size={25} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icon}
              onPress={handleAddRecordPress}
            >
              <Feather name="edit" size={23} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={handleHelpPress}>
              <Feather name="mail" size={25} color={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Records */}
        <View style={styles.recordsContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.recordsTitle}>View Children record</Text>
            <Text
              style={styles.recordsCount}
            >{`${getRecordCount()} records`}</Text>
          </View>

          {getRecordCount() === 0 ? (
            <View style={styles.noRecordsContainer}>
              <Feather name="edit" size={23} color={Colors.secondaryText} />
              <Text style={styles.noRecordsText}>
                Children's records are empty.
              </Text>
              <Text style={styles.noRecordsSubtext}>Please add a new one.</Text>
            </View>
          ) : (
            <View style={styles.recordListContainer}>
              <FlatList
                data={SampleData}
                renderItem={({ item }: { item: UserInfo }) => (
                  <RecordItem
                    userId={item.userId}
                    name={item.name}
                    birthDate={item.birthDate}
                    onPress={() => handleEditRecordPress(item.userId)}
                  />
                )}
                keyExtractor={(item) => item.userId}
                style={{ width: "100%" }}
              />
            </View>
          )}
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    marginLeft: 25,
  },
  recordsContainer: {
    paddingTop: 30,
    alignItems: "center",
    height: "94%",
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  recordsCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.tint,
  },
  noRecordsContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  noRecordsText: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 20,
  },
  noRecordsSubtext: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 10,
  },
  recordListContainer: {
    marginTop: 30,
  },
});
