require("dotenv").config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://tzrfabian:${process.env.MONGODB_PASSWORD}@tzr-cluster.6qgfx.mongodb.net/?retryWrites=true&w=majority&appName=tzr-cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// async function run() {
//   try {
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

const database = client.db("clone-line_db");

module.exports = database