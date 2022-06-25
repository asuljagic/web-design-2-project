const Mongoose = require("mongoose");
require('dotenv').config({ path: 'MONGO_URL' });

//const localDB = `mongodb://127.0.0.1:27017/role_auth`;
const localDB = process.env.MONGO_URL;
//const localDB = `mongodb+srv://asuljagic1:sarajevo2022@clusterwebdes2.aihhbit.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = async () => {
  await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB;
