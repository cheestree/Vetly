import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import React from "react";
import { usePathname, useRouter } from "expo-router";
import SizedIcon from "../basic/SizedIcon";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import { RouterProps } from "@/lib/types";
import CustomDrawerItem from "./item/CustomDrawerItem";
import { FontAwesome5 } from "@expo/vector-icons";

type DrawerBehaviourProps = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

type CustomDrawerProps = DrawerContentComponentProps &
  RouterProps &
  DrawerBehaviourProps;

export default function CustomDrawerContent({
  routes,
  isCollapsed,
  toggleCollapse,
  ...props
}: CustomDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 768;

  return (
    <DrawerContentScrollView {...props} style={{ scrollbarWidth: "none" }}>
      <View
        style={[
          styles.drawerTop,
          { justifyContent: isCollapsed ? "center" : "space-between" },
        ]}
      >
        {!isCollapsed && <Text style={{ fontSize: 18 }}>Vetly</Text>}
        {isDesktop && (
          <TouchableOpacity onPress={toggleCollapse}>
            <FontAwesome5 name={"list"} size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {routes.map((element) => (
        <CustomDrawerItem
          key={element.label}
          label={isCollapsed ? "" : element.label}
          onPress={() => router.push(element.route)}
          icon={<SizedIcon icon={element.icon} />}
          style={[
            styles.drawerItem,
            pathname === element.route && styles.activeDrawerItem,
          ]}
          labelStyle={pathname === element.route && styles.activeLabel}
        />
      ))}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerTop: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 12,
  },
  drawerItem: {
    borderRadius: 8,
    marginVertical: 4,
    overflow: "hidden",
  },
  activeDrawerItem: {
    backgroundColor: "#e0e7ff",
  },
  activeLabel: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
