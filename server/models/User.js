const db = require('../config/mongodb');
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { ObjectId } = require('mongodb');
const { signToken } = require('../helpers/jwt');

class User {
    static coll = db.collection('users');
    static followColl = db.collection('follows');

    static async findAll() {
        return this.coll.find().toArray();
    }

    static async findById(_id) {
        const userPromise = this.coll.findOne({
            _id: new ObjectId(_id)
        });
        
        const followingsPromise = this.followColl.aggregate([
            {
                $match: {
                    followerId: new ObjectId(_id),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followingId",
                    foreignField: "_id",
                    as: "user"
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    "following.password": 0,
                },
            },
        ]).toArray();

        const followersPromise = this.followColl.aggregate([
            {
                $match: {
                    followingId: new ObjectId(_id),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followerId",
                    foreignField: "_id",
                    as: "user"
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    "follower.password": 0,
                },
            },
        ]).toArray();
    
        const [user, followings, followers] = await Promise.all([
            userPromise,
            followingsPromise,
            followersPromise
        ]);
        

        if(!user) throw new Error("User not found");
        user.followers = followers;
        user.followings = followings;

        // console.log(user);
        return user;
    }

    static async findByEmail(email) {
        return this.coll.findOne({ email });
    }

    static async searchByName(keyword) {
        const searchRegex = new RegExp(keyword, 'i');
        return this.coll.find({
            $or: [
                {name: { $regex: searchRegex }},
                {username: { $regex: searchRegex }},
            ]
        }).toArray();
    }

    static async create({name, username, email, password }) {
        let hashedPassword = hashPassword(password);
        return this.coll.insertOne({name, username, email, password: hashedPassword });
    }

    static async login({ username, password }) {
        const user = await this.coll.findOne({username});
        if(!user) throw new Error("Invalid username/password");
        const isValidPassword = comparePassword(password, user.password);
        if(!isValidPassword) throw new Error("Invalid username/password");

        const access_token = signToken({
            _id: new ObjectId(user._id),
            email: user.email,
            username: user.username
        });
        // console.log(access_token);

        return {
            user: {
                _id: new ObjectId(user._id),
                email: user.email
            },
            access_token
        };
    }
}

module.exports = User;