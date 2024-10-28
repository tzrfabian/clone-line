const { gql } = require('apollo-server')
const followTypeDefs = gql`#graphql
type Follow {
    _id: ID!
    followingId: ID
    followerId: ID
    user: User
    createdAt: String
    updatedAt: String
}

type Query {
    follows: [Follow]
}

type Mutation {
    addFollow(followingId: ID!): Follow!
}

`;

module.exports = {
    followTypeDefs
}