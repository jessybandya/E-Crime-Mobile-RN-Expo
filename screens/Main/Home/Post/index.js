import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../../firebase";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import Map from "./Map";
import { Video, ResizeMode } from "expo-av";

function Post({
  crimeId,
  title,
  description,
  category,
  fileType,
  fromId,
  timestamp,
  lat,
  long,
  navigation,
  media,
}) {
  const [profileUserData, setProfileUserData] = useState([]);
  const [countLikes, setCountLikes] = useState([]);
  const [countComment, setCountComment] = useState(0);
  const [see, setSee] = useState();
  const [modal, setModal] = useState(false);
  const video = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    const unsubscribeComment = onSnapshot(
      query(
        collection(db, "crimes", crimeId, "comments"),
        where("count", "==", false)
      ),
      (snapshot) => {
        setCountComment(snapshot.size);
      }
    );

    return () => unsubscribeComment();
  }, [crimeId]);

  const likePost = async () => {
    try {
      const likeQuery = query(
        collection(db, "crimes", crimeId, "likes"),
        where("fromId", "==", auth?.currentUser?.uid),
        where("crimeId", "==", crimeId)
      );

      const snap = await getDocs(likeQuery);

      if (snap.docs.length > 0) {
        snap.forEach((doc) => {
          deleteDoc(doc.ref)
            .then(() => {
              // Like removed
            })
            .catch((error) => {
              console.error("Error removing post:", error);
            });
        });
      } else {
        const likeRef = doc(
          db,
          "crimes",
          crimeId,
          "likes",
          auth?.currentUser?.uid
        );
        await setDoc(likeRef, {
          fromId: auth?.currentUser?.uid,
          onwerId: fromId,
          crimeId,
          timestamp: Date.now(),
          liked: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const unsubscribeLikes = onSnapshot(
      query(
        collection(db, "crimes", crimeId, "likes"),
        where("liked", "==", true)
      ),
      (snapshot) => {
        setCountLikes(snapshot.size);
      }
    );

    return () => unsubscribeLikes();
  }, [crimeId]);

  useEffect(() => {
    const unsubscribeLikes = onSnapshot(
      doc(db, "crimes", crimeId, "likes", auth?.currentUser?.uid),
      (doc) => {
        setSee(doc.data());
      }
    );

    return () => unsubscribeLikes();
  }, [crimeId, auth?.currentUser?.uid]);

  useEffect(() => {
    const unsubscribeUserData = onSnapshot(doc(db, "users", fromId), (doc) => {
      setProfileUserData(doc.data());
    });

    return () => unsubscribeUserData();
  }, [fromId]);

  var t = new Date(timestamp);
  var hours = t.getHours();
  var minutes = t.getMinutes();
  var newformat = t.getHours() >= 12 ? "PM" : "AM";

  // Find current hour in AM-PM Format
  hours = hours % 12;

  // To display "0" as "12"
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var formatted =
    t.toString().split(" ")[0] +
    ", " +
    ("0" + t.getDate()).slice(-2) +
    "/" +
    ("0" + (t.getMonth() + 1)).slice(-2) +
    "/" +
    t.getFullYear() +
    " - " +
    ("0" + t.getHours()).slice(-2) +
    ":" +
    ("0" + t.getMinutes()).slice(-2) +
    " " +
    newformat;

  function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10, decPlaces);

    // Enumerate number abbreviations
    var abbrev = ["K", "M", "B", "T"];

    // Go through the array backwards, so we do the largest first
    for (var i = abbrev.length - 1; i >= 0; i--) {
      // Convert array index to "1000", "1000000", etc
      var size = Math.pow(10, (i + 1) * 3);

      // If the number is bigger or equal do the abbreviation
      if (size <= number) {
        // Here, we multiply by decPlaces, round, and then divide by decPlaces.
        // This gives us nice rounding to a particular decimal place.
        number = Math.round((number * decPlaces) / size) / decPlaces;

        // Add the letter for the abbreviation
        number += abbrev[i];

        // We are done... stop
        break;
      }
    }

    return number;
  }

  const viewPost = (ownerId, crimeId) => {
    navigation.navigate("Postview", {
      onwerId: ownerId,
      crimeId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.main}>
        <View style={styles.post}>
          <View style={styles.postHeader}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Image
                  style={{ height: 60, width: 60, borderRadius: 60 / 2 }}
                  source={{ uri: profileUserData?.profilePhoto }}
                />
              </View>
              <View>
                <View>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", marginLeft: 5 }}
                  >
                    {profileUserData?.firstName} {profileUserData?.lastName}
                  </Text>
                </View>
                <View>
                  <Text style={{ marginLeft: 5, color: "#666" }}>
                    {formatted}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      marginTop: 8,
                      color: "#AEAEAE",
                      alignSelf: "center",
                    }}
                  >
                    {title} - {category}
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <Feather name="more-horizontal" size={24} color="#0a7ff5" />
            </View>
          </View>

          {fileType === "image" ? (
            <>
              <TouchableWithoutFeedback
                onPress={() => viewPost(fromId, crimeId)}
              >
                <View style={styles.postImage}>
                  <Image
                    style={{
                      height: 350,
                      width: "100%",
                      objectFit: "contain",
                      marginRight: 10,
                      borderRadius: 8,
                    }}
                    source={{ uri: media }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </>
          ) : (
            <>
              <TouchableWithoutFeedback
                onPress={() => viewPost(fromId, crimeId)}
              >
                <Video
                  ref={video}
                  style={styles.video}
                  source={{
                    uri: media,
                  }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                />
              </TouchableWithoutFeedback>
            </>
          )}

          <View style={styles.postFooter}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              {/* <AntDesign name="like2" size={24} color="#0a7ff5" /> */}
              {see?.liked === true && (
                <AntDesign
                  name="like1"
                  size={24}
                  color="#0a7ff5"
                  onPress={likePost}
                />
              )}
              {see?.liked !== true && (
                <AntDesign
                  name="like2"
                  size={24}
                  color="#0a7ff5"
                  onPress={likePost}
                />
              )}
              <Text
                style={{
                  marginLeft: 2,
                  fontSize: 16,
                  fontWeight: "500",
                  marginTop: 3,
                  color: "#0a7ff5",
                }}
              >
                {abbrNum(countLikes, 0)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome
                onPress={() => navigation.navigate("Postview")}
                name="comment-o"
                size={24}
                color="#0a7ff5"
              />
              <Text
                style={{
                  marginLeft: 2,
                  fontSize: 16,
                  fontWeight: "500",
                  marginTop: 3,
                  color: "#0a7ff5",
                }}
              >
                {abbrNum(countComment, 0)}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={() => setModal(true)}
            >
              <Feather name="map-pin" size={24} color="#0a7ff5" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false);
        }}
        style={{
          zIndex: 100,
        }}
      >
        <View style={styles.modalView}>
          <Map lat={lat} long={long} title={title} description={description} />
          <Button
            onPress={() => setModal(false)}
            style={{
              backgroundColor: "#0a7ff5",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 0,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 14 }}>Close Modal</Text>
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default Post;

const styles = StyleSheet.create({
  post: {
    borderWidth: 1,
    borderColor: "#0a7ff5",
    borderRadius: 10,
    padding: 5,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    height: 55,
    backgroundColor: "#ecf0f1",
    alignItems: "center",
    borderRadius: 15,
    marginTop: 5,
  },
  postImage: {},
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  main: {
    backgroundColor: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    backgroundColor: "#ecf0f1",
    width: 180,
    borderRadius: 20,
    padding: 5,
  },
  headerText: {
    color: "blue",
    fontSize: 18,
    fontWeight: "400",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "#fff",
  },
  modalView: {
    position: "absolute",
    bottom: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  containerInducator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    alignSelf: "center",
    width: 500,
    height: 150,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
