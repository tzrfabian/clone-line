import { gql } from "@apollo/client";

export const GET_POSTS = gql`
query GetAllPosts {
  posts {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    author {
      _id
      username
      email
    }
  }
}
`;

export const GET_POST = gql`
query GetOnePost($id: ID!) {
  postById(_id: $id) {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content    
      username   
      createdAt  
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    author {
      _id
      username
      email
    }
  }
}
`;

export const ADD_POST = gql`
mutation AddPost($newPost: AddPostForm) {
  addPost(newPost: $newPost) {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
`;

export const ADD_COMMENT = gql`
mutation AddComment($newComment: AddCommentForm) {
  AddCommentForm(newComment: $newComment) {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
`;

export const ADD_LIKE = gql`
mutation AddLike($newLike: AddLikeForm) {
  AddLikeForm(newLike: $newLike) {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
`;