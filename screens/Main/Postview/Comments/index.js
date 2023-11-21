import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Card } from "react-native-paper";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase";

function Comments({ fromId, timestamp, comment, commentId }) {
  const [profileUserData, setProfileUserData] = useState();

  useEffect(() => {
    const unsubscribeProfileUserData1 = onSnapshot(
      doc(db, "users", fromId),
      (doc) => {
        setProfileUserData(doc.data());
      }
    );

    return () => unsubscribeProfileUserData1();
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

  return (
    <View style={styles.container}>
      <Card
        key={commentId}
        style={[styles.containerImage, { marginTop: 10 }]}
        // onPress={()=> commentReply({ownerId:fromId,commentId:commentId,postId:postId})}
      >
        <View style={styles.feedItem}>
          <Image
            source={{ uri: profileUserData?.profilePhoto }}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <>
                  <View>
                    <Text style={styles.name1}>
                      {profileUserData?.firstName} {profileUserData?.lastName}
                    </Text>
                  </View>
                </>

                <Text style={[styles.post, { maxWidth: 250 }]}>{comment}</Text>
              </View>

              {/* <MaterialIcons name="more-horiz" size={24} color="#73788B" onPress={() => setModal(true)} /> */}
            </View>
            <Text style={[styles.timestamp, { marginTop: 10 }]}>
              {formatted}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

export default Comments;

const styles = StyleSheet.create({
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#FFF",
    padding: 5,
    flexDirection: "row",
    // marginVertical: 8,
    paddingBottom: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#454D65",
  },
  name1: {
    fontSize: 15,
    fontWeight: "500",
    color: "#454D65",
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4,
  },
  post: {
    marginTop: 4,
    fontSize: 14,
    color: "#838899",
  },
  postImage: {
    width: undefined,
    height: 300,
    borderRadius: 5,
    marginVertical: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    //    bottom:0,
    height: 80,
    flex: 1,
    //    marginRight:15,
    //    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 15,
  },
  modalView: {
    //  position: "absolute",
    top: 50,
    //  width:"100%",
    backgroundColor: "#D3D3D3",
    padding: 10,
    margin: 20,
  },
  modalButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  textInput: {
    //    bottom:0,
    height: 80,
    flex: 1,
    //    marginRight:15,
    //    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 15,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
});
