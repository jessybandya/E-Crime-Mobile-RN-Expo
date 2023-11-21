import { Provider } from "react-redux";
import { persistor, store } from "./redux/configureStore";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { PersistGate } from "redux-persist/integration/react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Auth/Login";
import Register from "./screens/Auth/Register";
import Reset from "./screens/Auth/Reset";
import Postview from "./screens/Main/Postview";
import Main from "./screens/Main";
import Search from "./screens/Main/Search";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AlertNotificationRoot>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Reset" component={Reset} />
              <Stack.Screen name="Postview" component={Postview} />
              <Stack.Screen
                name="Home"
                component={Main}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="Search" component={Search} />
            </Stack.Navigator>
          </NavigationContainer>
        </AlertNotificationRoot>
      </PersistGate>
    </Provider>
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
