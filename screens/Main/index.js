import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {MaterialCommunityIcons, AntDesign, Entypo, FontAwesome5} from 'react-native-vector-icons';
import Home from './Home';
import Add from './Add';
import Profile from './Profile';
import { useState } from 'react';
import { updateAuthIdVar } from '../../redux/dataSlice';
import Map from './Map';

const Tab = createMaterialBottomTabNavigator();

export default function Main({ navigation }) {
  const [badgeCount,setBadgeCount] = useState(5)
  const authId = useSelector(updateAuthIdVar);

  if(!authId){
    navigation.replace("Login")
}

  
  return (
    <>
    <StatusBar style="light" />
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="#0a7ff5"
      inactiveColor="#fff"
      barStyle={{    
        borderTopLeftRadius:21, 
        borderTopRightRadius:21,
        backgroundColor:"#43A6C6",
        position:'absolute',
        bottom: 0,
        padding:6,
        height: 75,
        zIndex: 8 
       }}
    >
      <Tab.Screen
        name="Feed"
        component={Home}
        options={{
          tabBarLabel: 'Trendings',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Add"
        component={Add}
        options={{
          tabBarLabel: 'Post Crime',
          tabBarIcon: ({ color }) => (
            <AntDesign name="upload" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
      name="Map"
      component={Map}
      options={{
        tabBarLabel: 'Map',
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="map-marked-alt" color={color} size={26} />
        ),
      }}
    />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
    </>
  );
}
