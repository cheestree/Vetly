import CustomDrawerContent from "@/components/drawer/CustomDrawerContent";
import PrivateHeader from "@/components/navigators/PrivateHeader";
import { filterRoutesByAccess } from "@/handlers/Handlers";
import { useAuth } from "@/hooks/useAuth";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { drawerItems } from "@/lib/types";
import Drawer from "expo-router/drawer";
import { useCallback, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

export default function PrivateLayout() {
  const { colours } = useThemedStyles();
  const { width } = useWindowDimensions();
  const { user, information } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isDesktop = Platform.OS === "web" && width >= 768;

  const filteredRoutes = filterRoutesByAccess(
    drawerItems,
    user != null,
    information?.roles || [],
  );

  const HeaderComponent = useCallback(
    ({ navigation }) => (
      <PrivateHeader onToggleDrawer={() => navigation.toggleDrawer()} />
    ),
    [],
  );

  const getDrawerWidth = () => {
    if (!isDesktop) {
      return undefined;
    }
    return isCollapsed ? 68 : 240;
  };

  return (
    <Drawer
      backBehavior="history"
      drawerContent={(props) => (
        <CustomDrawerContent
          routes={filteredRoutes}
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
          {...props}
        />
      )}
      screenOptions={{
        drawerType: isDesktop ? "permanent" : "front",
        drawerStyle: {
          width: getDrawerWidth(),
          backgroundColor: colours.secondaryBackground,
          borderRightColor: colours.border,
          borderRightWidth: 1,
        },
        headerStyle: {
          backgroundColor: colours.secondaryBackground,
          borderBottomColor: colours.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colours.fontHeader,
        headerTitleStyle: {
          color: colours.fontHeader,
        },
        header: HeaderComponent,
      }}
    />
  );
}
