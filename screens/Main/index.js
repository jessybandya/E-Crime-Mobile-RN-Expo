import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons, AntDesign } from "react-native-vector-icons";
import Home from "./Home";
import Add from "./Add";
import Profile from "./Profile";
import { updateAuthIdVar } from "../../redux/dataSlice";

const Tab = createMaterialBottomTabNavigator();

export default function Main({ navigation }) {
  const authId = useSelector(updateAuthIdVar);

  if (!authId) {
    navigation.replace("Login");
  }

  return (
    <>
      <StatusBar style="light" />
      <Tab.Navigator
        initialRouteName="Feed"
        activeColor="#0a7ff5"
        inactiveColor="#fff"
        barStyle={{
          borderTopLeftRadius: 21,
          borderTopRightRadius: 21,
          backgroundColor: "#43A6C6",
          position: "absolute",
          bottom: 0,
          padding: 6,
          height: 75,
          zIndex: 8,
        }}
      >
        <Tab.Screen
          name="Feed"
          component={Home}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Add"
          component={Add}
          options={{
            tabBarLabel: "Post Crime",
            tabBarIcon: ({ color }) => (
              <AntDesign name="upload" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
