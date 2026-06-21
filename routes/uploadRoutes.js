const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");


// =========================
// CREATE UPLOADS FOLDER
// =========================
const uploadPath = path.join(__dirname, "../public/uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}


// =========================
// STORAGE
// =========================
const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    }
});


// =========================
// FILE FILTER
// =========================
const fileFilter = (req, file, cb) => {

    const allowed = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp"
    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Only PNG, JPG, JPEG, WEBP allowed"), false);
    }
};


// =========================
// MULTER
// =========================
const upload = multer({

    storage,
    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});


// =========================
// UPLOAD IMAGE
// =========================
router.post(
    "/image",
    upload.single("image"),

    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    success: false,
                    error: "No image uploaded"
                });
            }

            const imageUrl =
                "/uploads/" + req.file.filename;

            res.json({
                success: true,
                url: imageUrl,
                filename: req.file.filename
            });

        } catch (err) {

            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }
);


// =========================
// DELETE IMAGE
// =========================
router.delete("/image/:name", async (req, res) => {

    try {

        const filePath = path.join(
            uploadPath,
            req.params.name
        );

        if (fs.existsSync(filePath)) {

            fs.unlinkSync(filePath);

            return res.json({
                success: true,
                message: "Image deleted ✔"
            });
        }

        res.status(404).json({
            success: false,
            error: "Image not found"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


module.exports = router;