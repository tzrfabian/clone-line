import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    user {
      _id
      email
    }
    access_token
  }
}
`

export const REGISTER = gql`
mutation Register($name: String!, $username: String!, $email: String!, $password: String!) {
  register(name: $name, username: $username, email: $email, password: $password) {
    name
    username
    email
  }
}
`

export const SEARCH_USER = gql`
query SearchUser($name: String!) {
  userByName(name: $name) {
    _id
    name
    username
  }
}
`;

export const GET_USER_BY_ID = gql`
query GetUserById($id: ID!) {
  user(_id: $id) {
    _id
    name
    username
    email
    followings {
      followingId
      followerId
      createdAt
      updatedAt
      user {
        name
        _id
        username
        email
      }
    }
    followers {
      followingId
      followerId
      createdAt
      updatedAt
      user {
        name
        _id
        username
        email
      }
    }
  }
}
`;