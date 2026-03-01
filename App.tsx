import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { EmergencyScreen } from "./src/screens/EmergencyScreen";
import { AppointmentsScreen } from "./src/screens/AppointmentsScreen";
import { VaultScreen } from "./src/screens/VaultScreen";
import { ServicesScreen } from "./src/screens/ServicesScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Emergency" component={EmergencyScreen} />
        <Tab.Screen name="Appointments" component={AppointmentsScreen} />
        <Tab.Screen name="Vault" component={VaultScreen} />
        <Tab.Screen name="Services" component={ServicesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
