const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect("YOUR_MONGO_URL")
  .then(async () => {
    console.log("DB connected");

    await Admin.deleteMany({}); // sab hatao

    await Admin.create({
      name: "Sachin",
      email: "admin@bhagatestates.com",
      password: "Admin@123456"
    });

    console.log("Admin created");
    process.exit();
  });