import { gql } from "@apollo/client";

export const ADD_FOLLOW = gql`
mutation AddFollow($followingId: ID!) {
  addFollow(followingId: $followingId) {
    _id
    followingId
    followerId
    createdAt
    updatedAt
  }
}
`;