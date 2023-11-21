import { StatusBar } from "expo-status-bar";
import { useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Search({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Search",
      headerStyle: {
        backgroundColor: "#0a7ff5",
      },

      headerTitleStyle: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 23,
        alignSelf: "center",
      },
      headerLeft: () => (
        <View>
          <TouchableOpacity activeOpacity={0.4} onPress={navigation.goBack}>
            <Ionicons name="chevron-back" size={35} color="white" />
          </TouchableOpacity>
        </View>
      ),

      headerRight: () => <View></View>,
    });
  }, []);
  return (
    <>
      <View style={styles.container}>
        <Text>Search Screen!</Text>
        <StatusBar style="light" />
      </View>
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
