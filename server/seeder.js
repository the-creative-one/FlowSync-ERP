require("dotenv").config();

const mongoose = require("mongoose");

const Order = require("./models/Order");

const sampleOrders = require("./sampleData/orders");

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    await Order.insertMany(sampleOrders);

    console.log("Sample Orders Imported");

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

importData();