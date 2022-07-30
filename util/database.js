const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://root:root@cluster0.chtnfx7.mongodb.net/?retryWrites=true&w=majority";

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log("connected");
      callback(client);
    })
    .catch((err) => console.log(err));
};

module.exports = mongoConnect;
