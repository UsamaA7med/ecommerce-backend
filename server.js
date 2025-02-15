const express = require("express");
const connectToMongo = require("./config/connectToMongo");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const adminRouter = require("./routes/adminRouter");
const userRouter = require("./routes/userRouter");
const cartRouter = require("./routes/cartRouter");
const addressRouter = require("./routes/addressRouter");
const orderRouter = require("./routes/orderRouter");

require("dotenv").config();
const app = express();

connectToMongo();

app.listen(process.env.PORT_NUMBER, () => {
  console.log(`Server is running on port ${process.env.PORT_NUMBER}`);
});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/shop", orderRouter);

app.get("/", async (req, res, next) => {
  res.send("Hello World!");
});

app.use((error, req, res, next) => {
  res
    .status(error.statusCode || 500)
    .json({ status: error.status || "Error", message: error.message });
});
