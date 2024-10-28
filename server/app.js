require("dotenv").config();
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone');
const { userTypeDefs } = require('./Schema/UserSchema');
const { userResolvers } = require('./resolvers/UserResolver');
const { postTypeDefs } = require("./Schema/PostSchema");
const { postResolvers } = require("./resolvers/PostResolver");
const authentication = require("./middlewares/authentication");
const { followTypeDefs } = require("./Schema/FollowSchema");
const { followResolvers } = require("./resolvers/FollowResolver");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
  introspection: true
});

const port = process.env.PORT || 4000;

async function run() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: port },
    context: ({ req, res }) => {
      return {
        messsage: "Hello World!",
        authentication: async () => await authentication(req)
      }
    }
  });
  console.log(`Server ready at: ${url}`);
}

run()