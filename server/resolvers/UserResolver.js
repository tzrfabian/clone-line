const User = require("../models/User");

// const users = [
//   {
//     "_id": 1,
//     "username": "john_doe",
//     "email": "john.doe@example.com",
//     "password": "hashedpassword123"
//   },
//   {
//     "_id": 2,
//     "username": "jane_smith",
//     "email": "jane.smith@example.com",
//     "password": "hashedpassword456"
//   },
//   {
//     "_id": 3,
//     "username": "alex_jones",
//     "email": "alex.jones@example.com",
//     "password": "hashedpassword789"
//   }
// ];

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const userResolvers = {
  Query: {
    users: async() => {
      return await User.findAll();

    },
    user: async (_, { _id }, contextValue) => {
      await contextValue.authentication();
      const user = await User.findById(_id);
      return user;
    },
    userByName: async(_, { name }, contextValue) => {
      await contextValue.authentication();
      const result = await User.searchByName(name);
      if (!result || result.length === 0) {
        throw new Error("No users found");
      }
      return result;
    }
  },
  Mutation: {
    register: async(parent, {name, username, email, password}, contextValue) => {
      const newUser = {
        name,
        username,
        email,
        password
      }
      if(!newUser.username) {
        throw new Error("Username is required");
      }
      if(!newUser.name) {
        throw new Error("Name is required");
      }
      if(!newUser.email) {
        throw new Error("Email is required");
      }
      const existingUser = await User.findByEmail(newUser.email);
      if (existingUser) {
        throw new Error("Email already exists");
      }
      if(!validateEmail(newUser.email)) {
        throw new Error("Invalid email format")
      }
      if(!newUser.password) {
        throw new Error("Password is required");
      }
      const result = await User.create(newUser);
      // console.log(result);
      return newUser;
    },
    login: async(parent, {username, password}, contextValue) => {
      const {user, access_token} = await User.login({username, password});
      return {user, access_token};
    }
  }
}

module.exports = {
    userResolvers
}