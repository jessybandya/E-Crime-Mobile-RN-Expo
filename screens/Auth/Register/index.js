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
import { useDispatch } from "react-redux";
import { auth } from "../../../firebase";
import { sendSignInLinkToEmail } from "firebase/auth";

function Register({ navigation }) {
  const [email, setEmail] = useState("");
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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Sign Up",
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
          <TouchableOpacity activeOpacity={0.4} onPress={navigation.goBack}>
            <Ionicons name="chevron-back" size={35} color="white" />
          </TouchableOpacity>
        </View>
      ),

      headerRight: () => <View></View>,
    });
  }, []);

  const register = async () => {
    setLoading(true);

    if (!email) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Oops!",
        textBody: "Email is required!",
        button: "close",
      });
      setLoading(false);
    } else {
      try {
        setLoading(true);
        const config = {
          handleCodeInApp: true,
          url: "https://electronic-crime-app.web.app/complete-registration",
        };

        await sendSignInLinkToEmail(auth, email, config).then(() => {
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Success",
            textBody: `Verification email sent to "${email}"!`,
            button: "close",
          });
          setLoading(false);
          setEmail("");
          navigation.navigate("Login");
        });
        //   const res = await createUserWithEmailAndPassword(auth, email, password);
        //   const user = res.user;
        //   await setDoc(doc(db, "users", user.uid), {
        //     uid: user.uid,
        //     firstName,
        //     lastName,
        //     phone,
        //     profilePhoto: "https://avatars.githubusercontent.com/u/69303168?v=4",
        //     timestamp: Date.now(),
        //     authProvider: "local",
        //     email,
        //   }).then((auth) => {
        //     dispatch(updateAuthId(auth?.user?.uid))
        //     setLoading(false);
        //     Dialog.show({
        //       type: ALERT_TYPE.SUCCESS,
        //       title: "Success",
        //       textBody: "You've successfully registered!",
        //       button: "close",
        //     });
        //     navigation.replace("Login")
        //   });
        // } catch (err) {
        //   if(err.code === 'auth/email-already-in-use'){
        //     Dialog.show({
        //               type: ALERT_TYPE.DANGER,
        //               title: 'Oops!',
        //               textBody: 'Email entered already in use!',
        //               button: 'close',
        //             })
        //   }else if(err.code === 'auth/invalid-email'){
        //     Dialog.show({
        //               type: ALERT_TYPE.DANGER,
        //               title: 'Oops!',
        //               textBody: 'Invalid Email entered!',
        //               button: 'close',
        //             })
        //   }else{
        //     Dialog.show({
        //               type: ALERT_TYPE.DANGER,
        //               title: 'Oops!',
        //               textBody: err.message,
        //               button: 'close',
        //             })
        //   }
        //                   setLoading(false)
        // }
      } catch (err) {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.log(errorCode, errorMessage);

        throw err;
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

        <Button style={styles.button} mode="contained" onPress={register}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>

        <Button
          onPress={() => navigation.navigate("Login")}
          mode="outlined"
          style={{
            marginTop: 50,
            borderColor: "#0a7ff5",
            borderWidth: 1,
            color: "#0a7ff5",
          }}
        >
          <Text style={{ color: "#0a7ff5" }}>Already have an account?</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Register;

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
