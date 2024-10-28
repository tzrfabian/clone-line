const { gql } = require('apollo-server')
const postTypeDefs = gql`#graphql
type Post {
    _id: ID!
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID!
    comments:[Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
    author: User
}

type Comment {
    content: String!
    username: String!
    createdAt: String
    updatedAt: String
}

type Like {
    username: String!
    createdAt: String
    updatedAt: String
}

type Query {
    posts: [Post]
    postById(_id: ID!): Post

}

input AddPostForm {
    content: String!, 
    tags: [String], 
    imgUrl: String,
}

input AddCommentForm {
    _id: ID! # ini id dari Post
    content: String!
}

input AddLikeForm {
    _id: ID! # ini id dari Post
}

type Mutation {
    addPost(newPost: AddPostForm): Post!
    AddCommentForm(newComment: AddCommentForm): Post!
    AddLikeForm(newLike: AddLikeForm): Post!
}

`;

module.exports = {
    postTypeDefs
}