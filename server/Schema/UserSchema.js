const { gql } = require('apollo-server')
const userTypeDefs = gql`#graphql
type User {
    _id: ID!
    name: String
    username: String
    email: String
    password: String

    followings: [Follow]
    followers: [Follow]
}

type LoginResponse {
    user: User!        
    access_token: String!
}

type Query {
    users: [User]
    user(_id: ID!): User
    userByName(name: String!): [User]!
}

type Mutation {
    register(name: String!, username: String!, email: String!, password: String!): User!
    login(username: String!, password: String!): LoginResponse!
}

`;

module.exports = {
    userTypeDefs
}