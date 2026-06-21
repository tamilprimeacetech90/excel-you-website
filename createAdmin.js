const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const bcrypt = require("bcrypt");

const connectDB = require("./config/db");
const Admin = require("./models/Admin");


// =====================
// CREATE ADMIN
// =====================
const createAdmin = async () => {

    try {

        // ✅ CONNECT DATABASE
        await connectDB();

        console.log("✅ MongoDB Connected");

        // =====================
        // ADMIN DETAILS
        // =====================
        const username = "master";
        const password = "admin123";

        // =====================
        // DELETE OLD ADMINS
        // =====================
        await Admin.deleteMany({});

        console.log("🗑 Old admins removed");

        // =====================
        // HASH PASSWORD
        // =====================
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // =====================
        // CREATE ADMIN
        // =====================
        await Admin.create({
            username,
            password: hashedPassword
        });

        console.log("✅ Admin created successfully");
        console.log("👤 Username:", username);
        console.log("🔑 Password:", password);

        process.exit();

    } catch (err) {

        console.error("❌ ERROR:", err);

        process.exit(1);
    }
};


// RUN
createAdmin();