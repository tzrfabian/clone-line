import { StyleSheet, Text, View, Image, FlatList, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
// import posts from '../data.json'
import { GET_POSTS } from '../apollo/postsOperation';
import { useQuery } from '@apollo/client';

const renderItem = ({ item, navigation }) => {
  // console.log(item.tags);
  return (
      <TouchableOpacity onPress={() => navigation.navigate('Details', {postId: item._id})}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Image source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLY5sD28G41Sgw2GwK0TN6OCJcKW2MOQNBLA&s"}} style={styles.profilePic} />
            <Text style={styles.username}>{item.author.username}</Text>
            <Text style={styles.time}>45m</Text>
          </View>
          <Text style={styles.postText}>
            {item.content}
          </Text>
          <Text style={{color: '#006aff', fontSize: 12, marginBottom: 3}}>
          {item.tags.map((tag) => {
            return `#${tag} `
          })}
          </Text>
          <Image source={{uri: item.imgUrl}} alt='post img' style={styles.postImage} />
          <View style={styles.footer}>
            <View style={styles.like}>
              <Image source={{uri: "https://images.vexels.com/media/users/3/157338/isolated/lists/4952c5bde17896bea3e8c16524cd5485-facebook-like-icon.png"}} style={styles.icon} />
              <Text style={styles.likeCount}>{item.likes.length}</Text>
            </View>
            <Text style={styles.comments}>{item.comments.length} comments</Text>
            <Text style={styles.shares}>1 shares</Text>
          </View>
          <View style={styles.actions}>
            <View style={styles.actionBtn}>
              <Text style={styles.actionTxt}>Like</Text>
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
      </TouchableOpacity>
      )
}

export default function Homepage({ navigation }) {
  const {loading, error, data} = useQuery(GET_POSTS);
  // console.log({loading, error, data});

  if(loading) return (
    <View>
      <ActivityIndicator style={styles.loadingIndicator}/>
    </View>
  )

  if(error) return (
    <Text>{error.message}</Text>
  )

  return (
      <FlatList
        data={data.posts}
        renderItem={({ item }) => renderItem({ item, navigation })}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.container}
      />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#8bb5a0',
  },
  card: {
    marginVertical: 10,
    backgroundColor: '#ffff',
    padding: 10,
    borderRadius: 5
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  }
});
