const { ObjectId } = require('mongodb');
const db = require('../config/mongodb');

class Follow {
    static collection() {
        return db.collection("follows");
    }

    static coll = db.collection('follows');

    static async findAll() {
        return this.coll.find().toArray();
    }

    static async createFollow({followingId, followerId, createdAt, updatedAt}) {
        return this.coll.insertOne({
            followingId: new ObjectId(followingId), followerId, createdAt, updatedAt
        });
    }
}

module.exports = Follow;