const Follow = require("../models/Follow");

const followResolvers = {
    Query: {
        follows: async() => {
            return await Follow.findAll();
        }
    },
    Mutation: {
        addFollow: async(parent, { followingId }, contextValue) => {
            const user = await contextValue.authentication()
            if (!user) {
                throw new Error("User not authenticated");
            }
            
            const followerId = user._id;
            
            const createdFollow = await Follow.createFollow({
                followingId,
                followerId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            return {
                _id: createdFollow.insertedId,
                followingId,
                followerId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        }
    }
}

module.exports = {
    followResolvers
}