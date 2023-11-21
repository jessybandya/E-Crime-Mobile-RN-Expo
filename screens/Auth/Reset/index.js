import { StatusBar } from "expo-status-bar";
import { useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { Button } from "react-native-paper";
import { Input } from "react-native-elements";
import { useState } from "react";
import { useRef } from "react";
import { Animated } from "react-native";
import { useEffect } from "react";
import { Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";
import { auth } from "../../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function Reset({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1400, // Adjust the duration as needed for the rotation speed
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Reset Password",
      headerStyle: {
        backgroundColor: "#0a7ff5",
      },
      headerTitleAlign: "center",

      headerTitleStyle: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 23,
      },
      headerLeft: () => (
        <View>
          <TouchableOpacity activeOpacity={0.5} onPress={navigation.goBack}>
            <Ionicons name="chevron-back" size={35} color="white" />
          </TouchableOpacity>
        </View>
      ),

      headerRight: () => <View></View>,
    });
  }, []);

  const resetFun = async () => {
    setLoading(true);

    if (!email) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Oops!",
        textBody: "Email field is empty!",
      });
      setLoading(false);
    } else {
      try {
        const config = {
          url: `https://electronic-crime-app.web.app/complete-reset-alert`,
          handleCodeInApp: true,
        };

        await sendPasswordResetEmail(auth, email, config)
          // await auth.generatePasswordResetLink(email, config)
          .then(() => {
            Dialog.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Success",
              textBody: `Link has been sent to "${email}" for reset password!`,
              button: "close",
            });
            setLoading(false);
            setEmail("");
            navigation.navigate("Login");
          });
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Oops!",
          textBody: error.message,
          button: "close",
        });
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Animated.Image
        style={{
          width: 85,
          height: 85,
          resizeMode: "contain",
          transform: [{ rotate: spin }],
        }}
        source={{
          uri: "https://flowbite.s3.amazonaws.com/brand/logo-dark/mark/flowbite-logo.png",
        }}
      />

      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          containerStyle={{ color: "#FF1493" }}
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <Button style={styles.button} mode="contained" onPress={resetFun}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>

        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => navigation.navigate("Login")}
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <Text style={{ color: "#0a7ff5" }}>Go back to Sign In Page</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: 300,
    color: "#FF1493",
  },
  button: {
    width: "100%",
    marginTop: 10,
    backgroundColor: "#0a7ff5",
    color: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
});
