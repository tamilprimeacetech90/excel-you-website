const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const bcrypt = require("bcrypt");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");const createAdmin = async () => {
    try {
        await connectDB();

        await Admin.deleteMany({}); // optional reset

        const password = "admin123";

        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.create({
            username: "master",
            password: hashedPassword
        });

        console.log("✅ Admin created successfully");
console.log("BODY:", require.body);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
createAdmin();