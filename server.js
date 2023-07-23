const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Load env vars
dotenv.config({ path: "./config/config.env" });

// connectDB();
const app = express();

//add cookie parser
app.use(cookieParser());

// const hospitals = require("./routes/hospitals.js");
// const register = require("./routes/auth");
const auth = require("./routes/auth");
const cart = require("./routes/cart");
const product = require("./routes/product");
// const appointments = require("./routes/appointments");

//Body parser
app.use(express.json());

//Enable CORS
app.use(cors());
app.use("/api/v1/auth", auth);
app.use("/api/v1/products", product);
app.use("/api/v1/cart", cart);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`);
});

process.on("unhandledRejection", (err, Promise) => {
  console.log(`Error : ${err.message}`);
  server.close(() => process.exit(1));
});
