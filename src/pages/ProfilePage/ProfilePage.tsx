import { Text, ScrollView, Image, View, Button, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import FeedPost, { FeedPostProps } from "../../components/FeedPost/FeedPost";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  QueryDocumentSnapshot,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../../firebase";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../components/Navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import ButtonBlue from "../../components/Button/ButtonBlue";
import { LinearGradient } from "expo-linear-gradient";
import GalleryPost from "../../components/GalleryPost/GalleryPost";
import Icon from "react-native-vector-icons/Feather"

export type ProfilePageNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

function ProfilePage() {
  const navigation = useNavigation<ProfilePageNavigationProp>();
  const [posts, setPosts] = useState<FeedPostProps[]>([]);
  const userId = auth.currentUser!.uid;
  const [username, setUsername] = useState<string>("");
  const [profileImg, setProfileImg] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");

  useEffect(() => {
    const userDocRef = doc(db, `users`, userId);

    const unsubscribeUser = onSnapshot(userDocRef, (userDocSnapshot) => {
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUsername(userData?.username || "");
        setProfileImg(userData?.profileImg || "");
        setBio(userData?.profileBio || "");
      } else {
        console.log(
          "User document does not exist SO I CANNOT GET USERNAME GRHHH!"
        );
        setUsername("");
      }
    });

    const unsubscribePosts = onSnapshot(
      query(
        collection(db, `posts/${userId}/userPosts`),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setPosts(
          snapshot.docs.map((doc: QueryDocumentSnapshot) => {
            const data = doc.data();
            findLocationName(data.coords.latitude, data.coords.longitude);
            console.log("LOCATION FROM PROFILEPAGE USEEFFECT: " + locationName);
            return {
              postID: doc.id,
              username: username,
              userImage: profileImg,
              image: data.image,
              caption: data.caption,
              timestamp: data.timestamp,
              latitude: data.coords.latitude,
              longitude: data.coords.longitude,
              locationName: locationName,
            };
          })
        );
      }
    );

    return () => {
      console.log("Cleaning up...");
      unsubscribeUser();
      unsubscribePosts();
    };
  }, [db, userId, username, profileImg, bio]);

  const findLocationName = async (lat: number, long: number) => {
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: long,
    });

    if (reverseGeocode && reverseGeocode.length > 0) {
      setLocationName(reverseGeocode[0]?.city || "Unknown Location");
    }
  };

  return (
    <View>
      <ScrollView>
        <LinearGradient colors={['#ffc0a0', '#ffe7a0']}>
          <View>
            <View 
            style={{display: "flex", flexDirection: 'row', justifyContent: 'space-between'}}
            >
              <ButtonBlue
                label="Log out"
                onPress={() => console.log("Log out pressed")}
                // onPress={() => navigation.navigate("ProfileSetupPage")}
              />
              {/* <Image 
                source={require('../../../assets/ikon.png')}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              /> */}
              <ButtonBlue
                label="Edit profile"
                onPress={() => navigation.navigate("ProfileSetupPage")}
              />
            </View>
          <View 
          style={{display: "flex", flexDirection: 'row', padding: 16, justifyContent: 'space-between'}}
          >
            <View>
              <Image source={{ uri: profileImg }} 
              style={{width: 112, height: 112, borderRadius: 56, marginBottom: 8}}
              />
            </View>
            <View 
            style={{marginLeft: 16, flex: 1}}
            >
              <Text 
              style={{fontWeight: 'bold', fontSize: 24, marginBottom: 4}}
              >{username}</Text>
              <View>
                <Text 
                style={{fontWeight: 'bold'}}
                >About: 
                  <Text 
                  style={{fontWeight: 'normal'}}
                  > {bio}</Text>
                </Text>
              </View>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View 

        style={{borderBottomColor: 'gray', borderBottomWidth: 1}}
        />
      </ScrollView>
      {posts.length > 0 ? (
      <FlatList
        numColumns={3}
        data={posts}
        keyExtractor={(item) => item.postID.toString()}
        refreshing={false}
        style={{ height: "72%"}}
        onRefresh={() => console.log("Refreshed")}
        renderItem={({ item }) => (
          <GalleryPost
            key={item.postID}
            postID={item.postID}
            username={item.username}
            userImage={item.userImage}
            image={item.image}
            caption={item.caption}
            timestamp={item.timestamp}
            latitude={item.latitude}
            longitude={item.longitude}
            locationName={item.locationName}
          />
        )}
      />
      ) : (
        <View 
        style={{alignItems: 'center', justifyContent: 'center', marginTop: 96}}
        >
          <Icon 
            name="camera-off"
            size={50}
          />
          <Text 
          style={{padding: 8}}
          >No posts yet</Text>
        </View>
      )}
  </View>
  );
}

export default ProfilePage;
