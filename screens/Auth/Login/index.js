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
import { useDispatch } from "react-redux";
import { updateAuthId } from "../../../redux/dataSlice";
import { auth, signInWithEmailAndPassword } from "../../../firebase";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(updateAuthId(user?.uid));
      }
    });
    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Sign In",
      headerStyle: {
        backgroundColor: "#0a7ff5",
      },
      headerTitleAlign: "center",

      headerTitleStyle: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 23,
      },
      headerLeft: () => <View></View>,

      headerRight: () => <View></View>,
    });
  }, []);

  const signIn = async () => {
    setLoading(true);

    if (!email) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Oops!",
        textBody: "Email is required!",
        button: "close",
      });
      setLoading(false);
    } else if (!password) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Oops!",
        textBody: "Password is required!",
        button: "close",
      });
      setLoading(false);
    } else {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password).then((auth) => {
          dispatch(updateAuthId(auth?.user?.uid));
          navigation.replace("Home");
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Success",
            textBody: "Welcome Back to E-Crime App!",
            button: "close",
          });
          setLoading(false);
        });
      } catch (err) {
        console.error(err);
        setLoading(false);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Oops!",
          textBody: "Invalid Email or Password!",
          button: "close",
        });
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

        <Input
          placeholder="Password"
          containerStyle={{ color: "#FF1493" }}
          type="password"
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />

        <Button style={styles.button} mode="contained" onPress={signIn}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => navigation.navigate("Reset")}
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <Text style={{ color: "#0a7ff5" }}>Forgotten Password?</Text>
        </TouchableOpacity>

        <Button
          onPress={() => navigation.navigate("Register")}
          mode="outlined"
          style={{
            marginTop: 50,
            borderColor: "#0a7ff5",
            borderWidth: 1,
            color: "#0a7ff5",
          }}
        >
          <Text style={{ color: "#0a7ff5" }}>Create A New Account</Text>
        </Button>
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
