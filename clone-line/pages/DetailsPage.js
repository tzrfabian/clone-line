
import { useMutation, useQuery } from '@apollo/client';
import { StyleSheet, Text, View, Image, FlatList, ScrollView, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ADD_COMMENT, ADD_LIKE, GET_POST } from '../apollo/postsOperation';
import { useEffect, useState } from 'react';

export default function DetailsPage({ route }) {
    const {postId} = route.params;

    const {loading, error, data} = useQuery(GET_POST, {
      variables: {
        id: postId
      }
    });
    // console.log(JSON.stringify(data));

    const [commentForm, setCommentForm] = useState({
      _id: String(data?.postById?._id),
      content: ''
    });
    // console.log(commentForm._id);

    const [addComment] = useMutation(ADD_COMMENT, {
      refetchQueries: 'GetOnePost'
    })

    const handleChange = (name, value) => {
      setCommentForm({
        ...commentForm,
        [name]: value
      })
    }

    const handleAddComment = async () => {
      try {
        await addComment({
          variables: {
            newComment: {
              _id: commentForm._id,
              content: commentForm.content
            }
          }
        })
        setCommentForm({
          _id: commentForm._id,
          content: ''
        })
      } catch (err) {
        console.log(err);
        Alert.alert('Error', err.message)
      }
    }

    const [addLike] = useMutation(ADD_LIKE, {
      refetchQueries: 'GetOnePost'
    });
    
    const handleAddLike = async () => {
      try {
        await addLike({
          variables: {
            newLike: {
              _id: data?.postById?._id
            }
          }
        })
      } catch (err) {
        console.log(err);
        Alert.alert('Error', err.message)
      }
    }

    useEffect(() => {
      if (data?.postById?._id) {
        setCommentForm({
          ...commentForm,
          _id: data.postById._id
        });
      }
    }, [data])

    if(loading) return (
      <View>
        <ActivityIndicator style={styles.loadingIndicator}/>
      </View>
    )
  
    if(error) return (
      <Text>{error.message}</Text>
    )
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Image source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLY5sD28G41Sgw2GwK0TN6OCJcKW2MOQNBLA&s" }} style={styles.profilePic} />
            <Text style={styles.username}>{data?.postById?.author.username}</Text>
            <Text style={styles.time}>45m</Text>
          </View>
          <Text style={styles.postText}>
            {data.postById.content}
          </Text>
          <Text style={{color: '#006aff', fontSize: 12, marginBottom: 3}}>
          {data.postById.tags.map((tag) => {
            return `#${tag} `
          })}
          </Text>
          <Image source={{ uri: data?.postById?.imgUrl }} alt='post img' style={styles.postImage} />
          <View style={styles.footer}>
            <View style={styles.like}>
              <Image source={{ uri: "https://images.vexels.com/media/users/3/157338/isolated/lists/4952c5bde17896bea3e8c16524cd5485-facebook-like-icon.png" }} style={styles.icon} />
              <Text style={styles.likeCount}>{data?.postById?.likes.length}</Text>
            </View>
            <Text style={styles.comments}>{data?.postById?.comments.length} comments</Text>
            <Text style={styles.shares}>1 shares</Text>
          </View>
          <View style={styles.actions}>
            <View style={styles.actionBtn}>
              <TouchableOpacity onPress={handleAddLike}>
                <Text style={styles.actionTxt}>Like</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionBtn}>
              <Text style={styles.actionTxt}>Comments</Text>
            </View>
            <View style={styles.actionBtn}>
              <Text style={styles.actionTxt}>Send</Text>
            </View>
            <View style={styles.actionBtn}>
              <Text style={styles.actionTxt}>Share</Text>
            </View>
          </View>
        </View>
        <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>Comments</Text>
        {
          data?.postById?.comments.length > 0 ?
          (
            data?.postById?.comments.map((comment, index) => {
              return (
                <View key={index} style={styles.comment}>
                  <Image source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLY5sD28G41Sgw2GwK0TN6OCJcKW2MOQNBLA&s" }} style={styles.commentProfilePic} />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUsername}>{comment.username}</Text>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                </View>
              )
            })
          ) : 
          (
            <Text style={{fontSize: 15, marginBottom: 10, color: '#a8a8a8'}}>No Comments found...</Text>
          )
        }
        </View>
      </ScrollView>

      <View style={styles.commentInputContainer}>
        <TextInput 
          style={styles.commentInput} 
          placeholder="Write a comment..." 
          onChangeText={(value) => handleChange('content', value)}
          value={commentForm.content}
        />
        <TouchableOpacity 
          style={styles.sendBtn}
          onPress={async() => handleAddComment()}
        >
          <Text style={styles.sendTxt}>Send</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: '#8bb5a0',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    marginVertical: 10,
    backgroundColor: '#ffff',
    padding: 10,
    borderRadius: 5
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  time: {
    fontSize: 12,
    color: '#ccc',
    marginLeft: 10,
  },
  postText: {
    fontSize: 14,
    marginBottom: 15,
  },
  postImage: {
    width: '100%',
    height: 300,
    marginBottom: 15,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  like: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  likeCount: {
    fontSize: 14,
    marginLeft: 8,
  },
  comments: {
    fontSize: 14,
    marginLeft: 'auto',
  },
  shares: {
    fontSize: 14,
    marginLeft: 16,
  },
  actions: {
    borderTopWidth: 1,
    borderColor: '#e1e3e1',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  },
  actionBtn: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionTxt: {
    fontSize: 12,
    color: '#888'
  },
  commentInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e1e3e1',
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentInput: {
    flex: 1,
    padding: 5,
    fontSize: 14,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10
  },
  sendBtn: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5
  },
  sendTxt: {
    color: '#fff',
    fontSize: 12
  },
  commentsContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e1e3e1',
    marginBottom: 50
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
  }
});