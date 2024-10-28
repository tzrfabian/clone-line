import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import AuthContext from '../context/authContext';
import * as SecureStore from 'expo-secure-store'
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../apollo/usersOperation';

export default function Profile() {
  const authContext = useContext(AuthContext);
  const userId = SecureStore.getItem('userId');
  // console.log(userId);

  const {loading, error, data} = useQuery(GET_USER_BY_ID, {
    variables: {
      id: userId
    }
  })

  if (loading) return <ActivityIndicator style={styles.loadingIndicator}/>;
  if (error) return <Text>Error: {error.message}</Text>;
  console.log(error);

  const user = data.user;
  // console.log(JSON.stringify(user, null, 2));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLY5sD28G41Sgw2GwK0TN6OCJcKW2MOQNBLA&s'}} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.location}>📍Metaverse, Mementos</Text>
          <View style={styles.logoutContainer}>
            <TouchableOpacity 
              style={styles.logoutBtn}
              onPress={async () => {
                await SecureStore.deleteItemAsync("access_token")
                authContext.setIsLoggedIn(false)
              }}
            >
              <Text style={styles.logoutTxt}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button]}>
          <Text style={styles.buttonText}>Following: {user?.followings.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button]}>
          <Text style={styles.buttonText}>Followers: {user?.followers.length}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#ccf0db',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#aaa',
  },
  logoutContainer: {
    marginTop: 10,
    alignItems: 'flex-start'
  },
  logoutBtn: {
    padding: 3,
    width: 60,
    backgroundColor: '#de093e',
    borderRadius: 3,
  },
  logoutTxt: {
    textAlign: 'center',
    fontSize: 12,
    color: '#fff'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#8a8a8a',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});