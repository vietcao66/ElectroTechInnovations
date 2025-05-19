import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import DB_MONGO from "./app/config/db.config.js";
import _CONST from "./app/config/constant.js";

import authRoute from "./app/routers/auth.js";
import userRoute from "./app/routers/user.js";
import productRoute from "./app/routers/product.js";
import categoryRoute from "./app/routers/category.js";
import uploadFileRoute from "./app/routers/uploadFile.js";
import orderRoute from "./app/routers/order.js";
import statisticalRoute from "./app/routers/statistical.js";
import paymentRoute from "./app/routers/paypal.js";
import supplierRoute from "./app/routers/supplier.js";
import newsRoute from "./app/routers/news.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

mongoose
  .connect(
    "mongodb+srv://ducviet:Viet362003@electrotechinnovations.8hhe1.mongodb.net/?retryWrites=true&w=majority&appName=ElectroTechInnovations"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/uploadFile", uploadFileRoute);
app.use("/api/statistical", statisticalRoute);
app.use("/api/order", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/suppliers", supplierRoute);
app.use("/api/news", newsRoute);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || _CONST.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

import { v2 as cloudinary } from "cloudinary";

(async function () {
  // Configuration
  cloudinary.config({
    cloud_name: "dz9zsaofp",
    api_key: "168521695948769",
    api_secret: "168521695948769", // Click 'View API Keys' above to copy your API secret
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        public_id: "shoes",
      }
    )
    .catch((error) => {
      console.log(error);
    });

  console.log(uploadResult);

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url("shoes", {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log(optimizeUrl);

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url("shoes", {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
  });

  console.log(autoCropUrl);
})();
