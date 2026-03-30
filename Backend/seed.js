const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("DB Connected");

  const user = new User({
    name: "Super Admin",
    email: "superadmin@example.com",
    phone: "9999999999",
    password: "Admin@123", // ✅ plain password
    role: "super_admin"
  });

  await user.save(); // 🔥 auto hash happens here

  console.log("Super Admin Created ✅");
  process.exit();
});