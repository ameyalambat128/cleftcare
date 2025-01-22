import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Page from "@/components/Page";
import RecordItem from "@/components/RecordItem";
import Colors from "@/constants/Colors";
import { SampleData } from "@/constants/SampleData";
import { UserInfo } from "@/lib/store";
import { getRecordsByCommunityWorkerId } from "@/lib/api";

export default function Screen() {
  const router = useRouter();
  const { i18n, t } = useTranslation();

  const [records, setRecords] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false); // For pull-to-refresh
  const [error, setError] = useState<string>("");
  const [role, setRole] = useState<string | null>("");

  // Fetch records based on communityWorkerId
  const fetchRecords = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true); // Show loader only for initial fetch
    setError("");
    try {
      const communityWorkerId = await AsyncStorage.getItem("user-id");
      if (!communityWorkerId) {
        throw new Error("Community Worker ID is missing from storage.");
      }

      const response = await getRecordsByCommunityWorkerId(communityWorkerId);

      const mappedRecords: UserInfo[] = response.map((record: any) => ({
        userId: record.id,
        name: record.name,
        birthDate: record.birthDate,
        gender: record.gender,
        hearingLossStatus: record.hearingLossStatus,
        address: record.address,
        contactNumber: record.contactNumber,
        photo: record.photo,
        parentConsent: record.parentConsent,
        signedConsent: record.signedConsent,
        communityWorkerId: record.communityWorkerId,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }));

      setRecords(mappedRecords);
    } catch (err: any) {
      console.error("Failed to fetch records:", err);
      setError(err.error || "Failed to load records.");
    } finally {
      if (isRefresh) {
        setIsRefreshing(false); // End pull-to-refresh loader
      } else {
        setIsLoading(false); // End initial loader
      }
    }
  };

  const logUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem("user-id");
      const userRole = await AsyncStorage.getItem("user-role");

      console.log(
        "Onboarding status:",
        await AsyncStorage.getItem("onboarded")
      );

      setRole(userRole);
      if (userId !== null) {
        console.log("User ID:", userId);
        console.log("User Role:", userRole);
      } else {
        console.log("No user ID found");
      }
    } catch (error) {
      console.error("Error retrieving user ID:", error);
    }
  };
  logUserId();

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true); // Start pull-to-refresh loader
    fetchRecords(true); // Pass `true` to indicate refresh
  }, []);

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDevPress = () => {
    router.push("/add-record/add-signature");
  };

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
    return records.length;
  };

  const currentLanguage = i18n.language;
  console.log("Current language:", currentLanguage);
  return (
    <Page style={{ flex: 1 }} headerShown={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Animated.Text
            entering={FadeInLeft.springify()}
            exiting={FadeOutLeft}
            style={styles.title}
          >
            {t("homeScreen.title")}
          </Animated.Text>
          <View style={styles.iconsContainer}>
            {role == "Admin" && (
              <TouchableOpacity style={styles.icon} onPress={handleDevPress}>
                <Feather name="code" size={25} color={Colors.tint} />
              </TouchableOpacity>
            )}
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
            <Text style={styles.recordsTitle}>
              {t("homeScreen.viewRecords")}
            </Text>
            <Text
              style={styles.recordsCount}
            >{`${getRecordCount()} records`}</Text>
          </View>

          {isLoading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : getRecordCount() === 0 ? (
            <View style={styles.noRecordsContainer}>
              <Feather name="edit" size={23} color={Colors.secondaryText} />
              <Text style={styles.noRecordsText}>
                {t("homeScreen.noRecordsMessage")}
              </Text>
              <Text style={styles.noRecordsSubtext}>
                {t("homeScreen.addRecordPrompt")}
              </Text>
            </View>
          ) : (
            <View style={styles.recordListContainer}>
              <FlatList
                data={records}
                renderItem={({ item }: { item: UserInfo }) => (
                  <RecordItem
                    key={item.userId}
                    userId={item.userId}
                    name={item.name}
                    birthDate={
                      item.birthDate ? item.birthDate.toString() : null
                    }
                    onPress={() => handleEditRecordPress(item.userId)}
                  />
                )}
                keyExtractor={(item) => item.userId}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    tintColor={Colors.tint}
                  />
                }
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
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
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
