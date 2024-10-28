import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import Profile from './pages/Profile';
import Homepage from './pages/Homepage'
import CreatePost from './pages/CreatePost'
import DetailsPage from './pages/DetailsPage';
import SearchPage from './pages/SearchPage';
import AuthContext from './context/authContext';
import { useContext, useEffect, useState } from 'react';
import { getItemAsync } from 'expo-secure-store';
import { ActivityIndicator, View } from 'react-native';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Create Post') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          }
          return <Ionicons name={iconName} size={18} color={color} />;
        },
        tabBarIconStyle: {
          alignItems: 'center'
        },
        tabBarShowIcon: true,
        tabBarLabelStyle: { fontSize: 8 },
        tabBarStyle: { 
          backgroundColor: '#69cf94',
          height: 60
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'white',
      })}
    >
      <Tab.Screen name="Home" component={Homepage} />
      <Tab.Screen name="Create Post" component={CreatePost} />
      <Tab.Screen name="Search" component={SearchPage} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const authContext = useContext(AuthContext);
  // console.log(authContext, "<< navigation");
  const [ready, setReady] = useState(false)

  useEffect(() => {
    getItemAsync("access_token")
      .then((data) => {
        if(data) {
          authContext.setIsLoggedIn(true)
        }
        setReady(true);
      })
  }, [])

  if(!ready) {
    return <ActivityIndicator style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}/>;
      
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
      {
        authContext.isLoggedIn ?
        (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Details" component={DetailsPage} />
          </>
        ) :
        (
          <>
            <Stack.Screen name='Login' component={LoginPage}/>
            <Stack.Screen name='Register' component={RegisterPage}/>
          </>
        )
      }
      </Stack.Navigator>
    </NavigationContainer>
  );
}