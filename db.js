const Mongoose = require("mongoose");

//const localDB = `mongodb://localhost:27017/role_auth`;
const localDB = 'mongodb+srv://asuljagic1:sarajevo2022@clusterwebdes2.aihhbit.mongodb.net/?retryWrites=true&w=majority';

const connectDB = async () => {
  await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB;
