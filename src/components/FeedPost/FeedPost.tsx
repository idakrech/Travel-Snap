import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export type FeedPostProps = {
  postID: string,
  username: string;
  userImage: string;
  image: string;
  caption: string;
  timestamp: Timestamp;
  latitude: number;
  longitude: number;
  locationName: string
};

const FeedPost = ({ username, image, caption, userImage, locationName, timestamp }: FeedPostProps) => {

  const [postLiked, setPostLiked] = useState<Boolean>(false);

  const handleLikePress = () => {
   setPostLiked(!postLiked)
  }
  
  const convertTimestamp = (timestamp: Timestamp): string => {
    const date = timestamp.toDate(); 
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0"); 
  
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };
  

  return (
    <View 
    style={{justifyContent: 'center'}}
    >
      <View 
      style={{width: '100%'}}
      >
        <View 
        style={{flexDirection: 'row', paddingRight: 8, paddingLeft: 8, paddingTop: 4, paddingBottom: 4}}
        >
          <Image
            source={{
              uri: userImage
                //"https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }}
            style={{width: 24, height: 24, borderRadius: 12}}
          />
          <Text 
          style={{fontSize: 16, paddingLeft: 8, paddingTop: 2}}
          >{username}</Text>
        </View>
        <Image
          source={{ uri: image }} // "https://images.unsplash.com/photo-1682685797406-97f364419b4a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          style={{width: '100%', height: 450}}
        />
      </View>
      <View 
      style={{flexDirection: 'row', paddingRight: 8, paddingLeft: 8, paddingTop: 4, paddingBottom: 4}}
      >

        <TouchableOpacity onPress={handleLikePress}>
          <Text 
          style={{marginLeft: 8}}
          >{postLiked ? "💜" : "🤍"}</Text>
        </TouchableOpacity>

        <Text 
        style={{fontSize: 16, marginLeft: 8}}
        >💬</Text>
        <Text style={{fontSize: 16, marginLeft: 8}}>📍 {locationName}</Text>
        <Text style={{fontSize: 16, marginLeft: 8}}>{convertTimestamp(timestamp)}</Text>
      </View>
      <View 
      style={{justifyContent: 'flex-start', paddingRight: 8, paddingLeft: 8, paddingTop: 4, paddingBottom: 4}}
      >
        <Text 
        style={{marginRight: 8}}
        >
          <Text 
          style={{fontWeight: 'bold'}}
          > {username} </Text>
          {caption}
        </Text>
      </View>
    </View>
  );
};

export default FeedPost;