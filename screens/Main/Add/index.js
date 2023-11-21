import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, Image } from "react-native";
import { Button as ButtonRN } from "react-native";
import { TextInput } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Firebase from "firebase/storage";
import { auth, collection, db, doc, setDoc, storage } from "../../../firebase";
import { Video, ResizeMode } from "expo-av";
import * as Location from "expo-location";
import { ALERT_TYPE, Toast, Dialog } from "react-native-alert-notification";

export default function Add({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [media, setMedia] = useState("");
  const [fileType, setType] = useState("");
  const [uploadMediaLoading, setUploadMediaLoading] = useState(false);
  const crimeId = doc(collection(db, "crimes")).id;
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [progress, setProgress] = useState(0);

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      // upload the image
      await uploadImage(result.assets[0].uri, "image");
    }
  }

  async function pickVideo() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri, "video");
    }
  }

  async function uploadImage(uri, fileType) {
    const response = await fetch(uri);
    const blob = await response.blob();
    setType(fileType);

    const storageRef = Firebase.ref(storage, `media/${crimeId}`);
    const uploadTask = Firebase.uploadBytesResumable(storageRef, blob);

    // listen for events
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(progress.toFixed());
        setModal(false);
      },
      (error) => {
        // handle error
      },
      () => {
        Firebase.getDownloadURL(uploadTask.snapshot.ref).then(
          async (downloadURL) => {
            console.log("File available at", downloadURL);
            // save record
            // await saveRecord(fileType, downloadURL, new Date().toISOString());
            setMedia(downloadURL);
          }
        );
      }
    );
  }

  const uploadMediaToFirestore = async () => {
    setUploadMediaLoading(true);

    if (!title) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Oops!",
        textBody: "Title is required!",
        button: "close",
      });
      setUploadMediaLoading(false);
    } else if (!description) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Oops!",
        textBody: "Description is required!",
        button: "close",
      });
      setUploadMediaLoading(false);
    } else if (!category) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Oops!",
        textBody: "Category is required!",
        button: "close",
      });
      setUploadMediaLoading(false);
    } else if (!media) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Oops!",
        textBody: "Video/Photo is required!",
        button: "close",
      });
      setUploadMediaLoading(false);
    } else if (lat === 0 || long === 0) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Oops!",
        textBody: "Crime Location is required!",
        button: "close",
      });
      setUploadMediaLoading(false);
    } else {
      setUploadMediaLoading(true);
      try {
        await setDoc(doc(db, "crimes", crimeId), {
          crimeId: crimeId,
          media,
          fileType,
          title,
          description,
          category,
          lat,
          long,
          timestamp: Date.now(),
          status: "pending",
          fromId: auth?.currentUser?.uid,
        });
        setUploadMediaLoading(false);
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Crime posted successfully!",
          button: "close",
        });
        navigation.navigate("Feed");
        setTitle(""),
          setDescription(""),
          setCategory(""),
          setMedia(""),
          setType(""),
          setLat(0),
          setLong(0);
      } catch (error) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Success",
          textBody: error,
          button: "close",
        });
        setUploadMediaLoading(false);
      }
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location?.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
    } else {
      try {
        let { coords } = await Location?.getCurrentPositionAsync({});

        // Extract latitude and longitude from coords
        const { latitude, longitude } = coords;
        setLat(latitude);
        setLong(longitude);

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Crime Location taken successfully!",
          button: "close",
        });

        // You can use latitude and longitude as needed in your application
      } catch (error) {
        Alert.alert(error.message);
      }
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View>
          <Text></Text>
        </View>
        <View>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>
            Post Crime
          </Text>
        </View>
        <View>
          <Text></Text>
        </View>
      </View>

      <View style={styles.container}>
        <StatusBar style="light" />
        <TextInput
          placeholder="Title..."
          value={title}
          style={styles.input}
          onChangeText={(text) => setTitle(text)}
        />

        <TextInput
          placeholder="Descriptions..."
          editable
          multiline
          numberOfLines={4}
          value={description}
          style={{
            margin: 12,
            borderWidth: 1,
            borderColor: "#88888888",
            borderRadius: 8,
            padding: 10,
          }}
          onChangeText={(text) => setDescription(text)}
        />

        <View
          style={{
            margin: 10,
            borderColor: "#88888888",
            borderWidth: 1,
            borderRadius: 8,
          }}
        >
          <RNPickerSelect
            onValueChange={(value) => setCategory(value)}
            items={[
              { label: "Category A", value: "Category A" },
              { label: "Category B", value: "Category B" },
              { label: "Category C", value: "Category C" },
            ]}
          />
        </View>

        <View style={{ margin: 10, marginTop: 10 }}>
          <ButtonRN
            title="Upload Photo/Video"
            onPress={() => setModal(true)}
            style={{ margin: 12 }}
          />
        </View>

        <View
          style={{
            marginRight: 50,
            marginLeft: 50,
          }}
        >
          {progress > 0 && progress < 100 ? (
            <View style={styles.progressiveBarContainer}>
              <View style={[styles.bar, { width: progress }]} />
              <Text style={{ alignSelf: "center" }}>{progress}%</Text>
            </View>
          ) : (
            <>
              {media && (
                <>
                  {fileType === "image" ? (
                    <Image
                      source={{ uri: media }}
                      style={{
                        width: "100%",
                        height: 150,
                        resizeMode: "contain",
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    <>
                      <Video
                        ref={video}
                        style={styles.video}
                        source={{
                          uri: media,
                        }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                        onPlaybackStatusUpdate={(status) =>
                          setStatus(() => status)
                        }
                      />
                      <View style={styles.buttons}>
                        <Button
                          title={status.isPlaying ? "Pause" : "Play"}
                          onPress={() =>
                            status.isPlaying
                              ? video.current.pauseAsync()
                              : video.current.playAsync()
                          }
                        />
                      </View>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </View>

        <View style={{ margin: 10 }}>
          <ButtonRN
            title="Crime Location"
            onPress={getCurrentLocation}
            style={{ margin: 12 }}
          />
        </View>

        <Button
          style={styles.button}
          mode="contained"
          onPress={uploadMediaToFirestore}
        >
          {loading ? "Posting..." : "Post Crime"}
        </Button>

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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                padding: 10,
              }}
            >
              <Button
                mode="outlined"
                style={{
                  borderColor: "#0a7ff5",
                  borderWidth: 1,
                  color: "#0a7ff5",
                }}
                onPress={pickImage}
              >
                <Text style={{ color: "#0a7ff5" }}>Upload Photo </Text>{" "}
                <Ionicons name="image" size={17} color="#0a7ff5" />
              </Button>

              <Button
                mode="outlined"
                style={{
                  borderColor: "#0a7ff5",
                  borderWidth: 1,
                  color: "#0a7ff5",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={pickVideo}
              >
                <Text style={{ color: "#0a7ff5" }}>Upload Video </Text>
                <Ionicons name="videocam" size={17} color="#0a7ff5" />
              </Button>
            </View>

            <Button onPress={() => setModal(false)}>
              <Text style={{ color: "#0a7ff5", fontSize: 15 }}>Cancel</Text>
            </Button>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType={"none"}
          visible={uploadMediaLoading}
          onRequestClose={() => setUploadMediaLoading(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <Text>Posting Crime...</Text>
              <ActivityIndicator size={30} animating={uploadMediaLoading} />
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#0a7ff5",
    backgroundColor: "#0a7ff5",
    paddingTop: 40,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#88888888",
    borderRadius: 8,
    padding: 10,
  },
  button: {
    width: "100%",
    marginTop: 10,
    backgroundColor: "#0a7ff5",
    color: "white",
    marginTop: 5,
  },
  modalView: {
    position: "absolute",
    bottom: 1,
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#0a7ff5",
    borderWidth: 2,
    borderRadius: 8,
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 150,
    width: 150,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
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
  progressiveBarContainer: {
    height: 20,
    backgroundColor: "#ccc",
    borderRadius: 10,
    margin: 10,
  },
  bar: {
    height: 20,
    backgroundColor: "#0a7ff5",
    borderRadius: 10,
  },
});
