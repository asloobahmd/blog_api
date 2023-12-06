import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/dbConfig.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import multer from "multer";
import cloudinary from "./config/cloudinary.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
  })
);

// Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "../client/public/images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });

// const upload = multer({ storage });

// app.post("/upload", upload.single("file"), (req, res) => {
//   const file = req.file;
//   if (!file) return res.status(401).json("Image is null");
//   res.status(200).json(file.filename);
// });

//cloudinary
app.post("/imgupload", async (req, res) => {
  const { image } = req.body;

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "Blog_app_images",
    });
    return res
      .status(200)
      .json({ public_id: result.public_id, url: result.secure_url });
  } catch (error) {
    console.log(error);
  }
});

//Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT 5000");
});
