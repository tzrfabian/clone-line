const { ObjectId } = require('mongodb');
const db = require('../config/mongodb');

class Post {
    static collection() {
        return db.collection("posts");
    }

    static coll = db.collection('posts');

    static async findAll() {
        return this.coll.aggregate([
            {
                '$lookup': {
                  'from': 'users', 
                  'localField': 'authorId', 
                  'foreignField': '_id', 
                  'as': 'author'
                }
            },
            {
                '$unwind': '$author'
            },
            {
                '$sort': { 'createdAt': -1 }
            }
        ]).toArray();
    }

    static async findById(_id) {
        return this.coll.aggregate([
            {
                '$match': { _id: new ObjectId(String(_id)) }
            },
            {
                '$lookup': {
                  'from': 'users', 
                  'localField': 'authorId', 
                  'foreignField': '_id', 
                  'as': 'author'
                }
            },
            {
                '$unwind': '$author'
            },
        ]).toArray();
    }

    static async createPost({content, tags, imgUrl, authorId, comments, likes, createdAt, updatedAt}) {
        return this.coll.insertOne({
            content, tags, imgUrl, authorId, comments, likes, createdAt, updatedAt
        });
    }

    static async addComment(_id, comment) {
        return this.coll.updateOne(
            {_id: new ObjectId(_id) },
            { 
                $push: {comments: comment}, 
                $set: { updatedAt: new Date().toISOString() }
            }
        );
    }

    static async addLike(_id, like) {
        return this.coll.updateOne(
            {_id: new ObjectId(_id) },
            { 
                $push: {likes: like}, 
                $set: { updatedAt: new Date().toISOString() }
            }
        );
    }

}

module.exports = Post;