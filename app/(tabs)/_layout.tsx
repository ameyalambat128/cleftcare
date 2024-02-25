import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { Octicons } from "@expo/vector-icons";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: 0 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.tint,
        tabBarStyle: {
          borderTopStartRadius: 20,
          borderTopEndRadius: 20,
        },
      }}
    >
      <Tabs.Screen
        name="(index)"
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons
              name="home"
              size={24}
              style={{ marginBottom: 0 }}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="mic-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tutorials"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="reader-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
