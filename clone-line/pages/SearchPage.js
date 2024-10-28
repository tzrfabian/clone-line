import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { SEARCH_USER } from '../apollo/usersOperation';
import { ADD_FOLLOW } from '../apollo/followsOperation';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [userFound, setUserFound] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState(null);

  const { data, loading, error } = useQuery(SEARCH_USER, {
    variables: { name: keyword },
    skip: keyword === ''
  });

  // console.log(JSON.stringify(data, null, 2));

  const [addFollow] = useMutation(ADD_FOLLOW, {
    refetchQueries: 'SearchUser'
  });

  const handleFollow = async (userId, username) => {
    try {
      await addFollow({
        variables: {
          followingId: userId
        }
      })
      Alert.alert('Success', `You are following ${username}`)

    } catch (err) {
      console.log(err);
      Alert.alert('Error', err.message)
    }
  }

  // console.log(errorSearch);

  const handleSearch = async () => {
    setLoadingSearch(true);
    setErrorSearch(null);
    
    if (keyword !== '' && data && data.userByName) {
      setUserFound(data.userByName);
    } else {
      setUserFound([]);
      setErrorSearch('No user found');
    }

    setLoadingSearch(false);
  };

  if (loadingSearch) return (
    <View>
      <ActivityIndicator style={styles.loadingIndicator} />
    </View>
  )

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Find user here..."
        value={keyword}
        onChangeText={(text) => setKeyword(text)}
      />
      <Button title="Search" color={'#28a745'} onPress={handleSearch} />
      {errorSearch ? (
        <Text>{`Error: No user found!`}</Text>
      ) : userFound && userFound.length > 0 ? (
        <FlatList
          data={userFound}
          renderItem={({ item }) => (
            <View style={styles.userCardContainer}>
              <View style={styles.cardContent}>
                <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLY5sD28G41Sgw2GwK0TN6OCJcKW2MOQNBLA&s' }} style={styles.photo} />
                <View style={styles.userInfo}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.username}>@{item.username}</Text>
                </View>
                <Button 
                  title="Follow" 
                  color={'#35cc58'} 
                  style={styles.followButton} 
                  onPress={() => handleFollow(item._id, item.username)}
                />
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 20,
    width: '100%',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    borderRadius: 5,
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  userCardContainer: {
    width: '100%',
    marginTop: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: 'gray',
  },
  followButton: {
    alignSelf: 'flex-end',
  },
});