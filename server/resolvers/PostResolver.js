const Post = require("../models/Post");
const Redis = require('ioredis');
const redis = new Redis({
    port: process.env.REDIS_PORT,   // Redis port
    host: process.env.REDIS_HOST,   // Redis host
    password: process.env.REDIS_PASSWORD,
    db: 0
});

const postResolvers = {
    Query: {
        posts: async(_, __, contextValue) => {
            await contextValue.authentication();
            
            // cek apakah ada cache tersimpan di redis
            const cache = await redis.get("posts");

            // jika ada return data nya
            if(cache) {
                // console.log('Get data from cache');
                return JSON.parse(cache);
            }

            // kalau ga ada ambil dari db
            const posts = await Post.findAll();

            // lalu simpan ke cache
            await redis.set("posts", JSON.stringify(posts));

            // console.log("get data from database");
            return posts;
        },
        postById: async(_, { _id }, contextValue) => {
            await contextValue.authentication();
            const post = await Post.findById(_id);
            return post[0]
        }
    },
    Mutation: {
        addPost: async(parent, { newPost }, contextValue) => {
            const user = await contextValue.authentication();

            const authorId = user._id;

            const createdPost = await Post.createPost({
                content: newPost.content,
                tags: newPost.tags,
                imgUrl: newPost.imgUrl,
                authorId: authorId,
                comments: [],
                likes: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            await redis.del("posts")

            return {
                _id: createdPost.insertedId,
                content: newPost.content,
                tags: newPost.tags,
                imgUrl: newPost.imgUrl,
                authorId: authorId,
                comments: [],
                likes: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        },

        AddCommentForm: async(parent, { newComment }, contextValue) => {
            const user = await contextValue.authentication();

            const comment = {
                content: newComment.content,
                username: user.username,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            await Post.addComment(newComment._id, comment);
            const post = await Post.findById(newComment._id);
            await redis.del("posts")
            return post[0];
        },

        AddLikeForm: async(parent, { newLike }, contextValue) => {
            const user = await contextValue.authentication();

            const like = {
                username: user.username,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            await Post.addLike(newLike._id, like);
            const post = await Post.findById(newLike._id);
            await redis.del("posts")
            return post[0];
        }
    }
}

module.exports = {
    postResolvers
}