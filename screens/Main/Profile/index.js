import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, Image } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { signOut } from "firebase/auth";
import { query, collection, where, onSnapshot, doc } from "firebase/firestore";
import { updateAuthId } from "../../../redux/dataSlice";
import { useDispatch } from "react-redux";
import { db, auth } from "../../../firebase";
import Home from "./Home";

export default function Profile({ navigation }) {
  const dispatch = useDispatch();
  const [profileUserData, setProfileUserData] = useState();
  const [modal, setModal] = useState(false);
  const [countPosts, setCountPosts] = useState(0);
  const [countFollowers, setCountFollowers] = useState(0);
  const [countFollowing, setCountFollowing] = useState(0);

  const logout = () => {
    signOut(auth);
    navigation.replace("Login");
    dispatch(updateAuthId(""));

    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Logged out successfully",
      text: "You have been logged out successfully.",
      button: "close",
    });
  };

  useEffect(() => {
    const unsubscribeFollowing = onSnapshot(
      query(
        collection(db, "follows"),
        where("followerId", "==", auth?.currentUser?.uid)
      ),
      (snapshot) => {
        setCountFollowing(snapshot.size);
      }
    );

    return () => unsubscribeFollowing();
  }, [auth?.currentUser?.uid]);

  useEffect(() => {
    const unsubscribeFollowers = onSnapshot(
      query(
        collection(db, "users", auth?.currentUser?.uid, "followers"),
        where("followedId", "==", auth?.currentUser?.uid)
      ),
      (snapshot) => {
        setCountFollowers(snapshot.size);
      }
    );

    return () => unsubscribeFollowers();
  }, [auth?.currentUser?.uid]);

  useEffect(() => {
    const unsubscribePosts = onSnapshot(
      query(
        collection(db, "crimes"),
        where("fromId", "==", auth?.currentUser?.uid)
      ),
      (snapshot) => {
        setCountPosts(snapshot.size);
      }
    );

    return () => unsubscribePosts();
  }, [auth?.currentUser?.uid]);

  useEffect(() => {
    const unsubscribeProfileUserData = onSnapshot(
      doc(db, "users", auth?.currentUser?.uid),
      (doc) => {
        setProfileUserData(doc.data());
      }
    );

    return () => unsubscribeProfileUserData();
  }, [auth?.currentUser?.uid]);

  return (
    <>
      <View style={styles.header}>
        <View>
          <Text></Text>
        </View>
        <View>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>
            Profile
          </Text>
        </View>
        <View>
          <Text></Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
       <View
       style={{
          alignItems: "center",
          justifyContent: "center",
       }}
       >
       <TouchableOpacity activeOpacity={0.5} onPress={() => setModal(true)}>
       <Image
         source={{ uri: profileUserData?.profilePhoto }}
         style={styles.userImg}
       />
     </TouchableOpacity>

     <Text style={styles.userName}>
       {profileUserData?.firstName} {profileUserData?.lastName}
     </Text>
     <Text style={styles.aboutUser}>
       {profileUserData ? profileUserData?.email || "No email added." : ""}
     </Text>
       </View>

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>Phone</Text>
            <Text style={styles.userInfoSubTitle}>
              {profileUserData?.phone}
            </Text>
          </View>

          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>Status</Text>
            <Text style={styles.userInfoSubTitle}>verified</Text>
          </View>

          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>Posts</Text>
            <Text style={styles.userInfoSubTitle}>{countPosts}</Text>
          </View>
        </View>

        <View style={styles.userBtnWrapper}>
          <TouchableOpacity style={styles.userBtn} onPress={logout}>
            <Text style={styles.userBtnTxt}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View 
        style={{
          borderColor: "#88888888",
          borderWidth: 1,
          width: "100%",
          marginTop: 15,
        }}
        />
        <View><Text style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          color: "#0a7ff5",
        }}>My Post</Text></View>
        <Home navigation={navigation}/>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#0a7ff5",
    backgroundColor: "#0a7ff5",
    paddingTop: 45,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop:10
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#0a7ff5",
  },
  names: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: 0,
    color: "#0a7ff5",
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 25,
  },
  userBtn: {
    borderColor: "#0a7ff5",
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: "#0a7ff5",
  },
  userInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: "center",
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#0a7ff5",
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  modalView: {
    top: 50,
    width: "100%",
    backgroundColor: "#D3D3D3",
    padding: 0,
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
});
