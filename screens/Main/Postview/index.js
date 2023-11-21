import {
  View,
  StyleSheet,
  TextInput,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import Comments from "./Comments";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { Button } from "react-native-paper";
import Map from "./Map";
import { Video, ResizeMode } from "expo-av";

export default function Postview({ navigation, route }) {
  const { onwerId, crimeId } = route.params;
  const [profileUserData, setProfileUserData] = useState();
  const [profileUserData1, setProfileUserData1] = useState();
  const [post, setPost] = useState();
  const [countLikes, setCountLikes] = useState(0);
  const [see, setSee] = useState();
  const [comment, setComment] = useState("");
  const [countComment, setCountComment] = useState(0);
  const [modal, setModal] = useState(false);
  const video = useRef(null);
  const [status, setStatus] = useState({});

  const [posts1, setPosts1] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Post",
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

  useEffect(() => {
    const fetchComments = () => {
      const q = query(
        collection(db, "crimes", crimeId, "comments"),
        orderBy("timestamp", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPosts1(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

      return unsubscribe;
    };

    fetchComments();
  }, [crimeId]);

  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  useEffect(() => {
    const unsubscribeCountComment = onSnapshot(
      query(
        collection(db, "crimes", crimeId, "comments"),
        where("count", "==", false)
      ),
      (snapshot) => {
        setCountComment(snapshot.size);
      }
    );

    return () => unsubscribeCountComment();
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
          onwerId,
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
    const unsubscribeCountLikes = onSnapshot(
      query(
        collection(db, "crimes", crimeId, "likes"),
        where("liked", "==", true)
      ),
      (snapshot) => {
        setCountLikes(snapshot.size);
      }
    );

    return () => unsubscribeCountLikes();
  }, [crimeId]);

  useEffect(() => {
    const unsubscribeSee = onSnapshot(
      doc(db, "crimes", crimeId, "likes", auth?.currentUser?.uid),
      (doc) => {
        setSee(doc.data());
      }
    );

    return () => unsubscribeSee();
  }, [crimeId, auth?.currentUser?.uid]);

  useEffect(() => {
    const unsubscribeProfileUserData = onSnapshot(
      doc(db, "users", onwerId),
      (doc) => {
        setProfileUserData(doc.data());
      }
    );

    return () => unsubscribeProfileUserData();
  }, [onwerId]);

  useEffect(() => {
    const unsubscribeProfileUserData1 = onSnapshot(
      doc(db, "users", auth?.currentUser?.uid),
      (doc) => {
        setProfileUserData1(doc.data());
      }
    );

    return () => unsubscribeProfileUserData1();
  }, [auth?.currentUser?.uid]);

  useEffect(() => {
    const unsubscribePost = onSnapshot(doc(db, "crimes", crimeId), (doc) => {
      setPost(doc.data());
    });

    return () => unsubscribePost();
  }, [crimeId]);

  var t = new Date(post?.timestamp);
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

  const postComment = () => {
    Keyboard.dismiss();

    if (!comment) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Oops!",
        text: "Comment is required!",
        button: "close",
      });
    } else {
      try {
        const commentsRef = collection(db, "crimes", crimeId, "comments");
        addDoc(commentsRef, {
          comment,
          read: false,
          count: false,
          crimeId: crimeId,
          toId: onwerId,
          fromId: auth?.currentUser?.uid,
          timestamp: Date.now(),
        });

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success!",
          text: "Successfully added a comment!",
          button: "close",
        });
      } catch (error) {
        console.error("Error adding comment:", error);
        // Handle error - show an alert or log it as needed
      }

      setComment("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {post ? (
        <>
          <ScrollView style={styles.main}>
            <View style={styles.post}>
              <View style={styles.postHeader}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
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
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          marginLeft: 5,
                        }}
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
                        {post?.title} - {post?.category}
                      </Text>
                    </View>
                  </View>
                </View>

                <View>
                  <Feather name="more-horizontal" size={24} color="#0a7ff5" />
                </View>
              </View>

              {post?.fileType === "video" ? (
                <>
                  <View>
                    <Text
                      onTextLayout={onTextLayout}
                      numberOfLines={textShown ? undefined : 2}
                      style={{ lineHeight: 21 }}
                    >
                      {post?.description}
                    </Text>

                    {lengthMore ? (
                      <Text
                        onPress={toggleNumberOfLines}
                        style={{
                          lineHeight: 21,
                          marginTop: 6,
                          fontWeight: "bold",
                          color: "#88888888",
                        }}
                      >
                        {textShown ? "Read less..." : "Read more..."}
                      </Text>
                    ) : null}
                  </View>

                  <TouchableWithoutFeedback>
                    <Video
                      ref={video}
                      style={styles.video}
                      source={{
                        uri: post?.media,
                      }}
                      useNativeControls
                      resizeMode={ResizeMode.CONTAIN}
                    />
                  </TouchableWithoutFeedback>
                </>
              ) : (
                <>
                  <View>
                    <Text
                      onTextLayout={onTextLayout}
                      numberOfLines={textShown ? undefined : 2}
                      style={{ lineHeight: 21 }}
                    >
                      {post?.description}
                    </Text>

                    {lengthMore ? (
                      <Text
                        onPress={toggleNumberOfLines}
                        style={{
                          lineHeight: 21,
                          marginTop: 6,
                          fontWeight: "bold",
                          color: "#88888888",
                        }}
                      >
                        {textShown ? "Read less..." : "Read more..."}
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.postImage}>
                    <Image
                      style={{
                        height: 300,
                        width: "100%",
                        objectFit: "contain",
                        marginRight: 10,
                        borderRadius: 8,
                      }}
                      source={{ uri: post?.media }}
                    />
                  </View>
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
                    {abbrNum(countLikes, 1)}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome name="comment-o" size={24} color="#0a7ff5" />
                  <Text
                    style={{
                      marginLeft: 2,
                      fontSize: 16,
                      fontWeight: "500",
                      marginTop: 3,
                      color: "#0a7ff5",
                    }}
                  >
                    {abbrNum(countComment, 1)}
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

            {posts1.map(
              ({
                id,
                data: { fromId, read, count, timestamp, comment, toId },
              }) => (
                <Comments
                  key={id}
                  postId={crimeId}
                  navigation={navigation}
                  commentId={id}
                  fromId={fromId}
                  read={read}
                  count={count}
                  comment={comment}
                  toId={toId}
                  timestamp={timestamp}
                />
              )
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TextInput
              multiline={true}
              placeholder={`${profileUserData1?.firstName}, say something...`}
              style={styles.textInput}
              value={comment}
              onChangeText={(text) => setComment(text)}
            />
            {!comment ? (
              <Image
                source={{ uri: profileUserData1?.profilePhoto }}
                style={styles.avatar}
              />
            ) : (
              <TouchableOpacity onPress={postComment} activeOpacity={0.5}>
                <FontAwesome5
                  name="telegram-plane"
                  style={{ marginLeft: 8 }}
                  size={33}
                  color="#0a7ff5"
                />
              </TouchableOpacity>
            )}
          </View>

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
              <Map
                lat={post?.lat}
                long={post?.long}
                title={post?.title}
                description={post?.description}
              />
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
        </>
      ) : (
        <View style={styles.containerInducator}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  post: {},
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    marginLeft: 5,
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
  textInput: {
    //    bottom:0,
    height: 50,
    flex: 1,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 8,
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
