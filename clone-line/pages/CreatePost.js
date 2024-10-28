import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ADD_POST } from '../apollo/postsOperation';

export default function CreatePost({ navigation }) {
  const [form, setForm] = useState({
    content: '',
    tags: '',
    imgUrl: '',
  });

  const [addPost, {loading, error, data}] = useMutation(ADD_POST, {
    refetchQueries:[
      'GetAllPosts'
    ]
  })

  // console.log(JSON.stringify({
  //   loading, error, data
  // }, null, 2));

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Content"
        onChangeText={(value) => handleChange('content', value)}
        value={form.content}
      />
      <TextInput
        style={styles.input}
        placeholder="Tags"
        onChangeText={(value) => handleChange('tags', value)}
        value={form.tags}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        onChangeText={(value) => handleChange('imgUrl', value)}
        value={form.imgUrl}
      />
      <Button 
        title="Add Post" 
        color={'#28a745'} 
        onPress={async () => {
          await addPost({
            variables: {
              newPost: {
                ...form,
                tags: form.tags.split(",")
              }
            }
          })
          console.log(form, '<< form')
          setForm({
            content: '',
            tags: '',
            imgUrl: '',
          })
          navigation.goBack()
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderRadius: 5,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});