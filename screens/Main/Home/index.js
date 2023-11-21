import React, { useEffect, useState } from "react";
import {
  auth,
  collection,
  db,
  doc,
  onSnapshot,
  query,
} from "../../../firebase";
import { Image } from "react-native-elements";
import { Feather } from "@expo/vector-icons";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { orderBy } from "firebase/firestore";
import Post from "./Post";

export default function Home({ navigation }) {
  const [profileUserData, setProfileUserData] = useState();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", `${auth?.currentUser?.uid}`),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setProfileUserData(docSnapshot.data());
        } else {
          // Handle case when the document doesn't exist
          // For example, setProfileUserData(null);
        }
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const q = query(collection(db, "crimes"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const postData = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));
          setPosts(postData);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error @Fetching: ", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            source={{ uri: profileUserData?.profilePhoto }}
            style={styles.avatar}
          ></Image>
        </TouchableOpacity>
        <View>
          <View>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>
              Home
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            activeOpacity={0.4}
            onPress={() => navigation.navigate("Search")}
          >
            <Feather name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.feedContainer}>
        <ScrollView>
          {posts.length > 0 ? (
            posts.map(
              ({
                id,
                data: {
                  title,
                  description,
                  category,
                  fileType,
                  fromId,
                  timestamp,
                  lat,
                  long,
                  media,
                },
              }) => (
                <Post
                  key={id}
                  crimeId={id}
                  title={title}
                  description={description}
                  category={category}
                  fileType={fileType}
                  fromId={fromId}
                  timestamp={timestamp}
                  lat={lat}
                  long={long}
                  navigation={navigation}
                  media={media}
                />
              )
            )
          ) : (
            <View style={styles.containerInducator}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex:1,
    padding: 3,
    marginBottom: -10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#0a7ff5",
    backgroundColor: "#0a7ff5",
    paddingTop: 40,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 24,
  },
  feedContainer: {
    borderBottomColor: "pink",
    paddingBottom: 160,
  },
  container1: {
    marginTop: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  containerInducator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
