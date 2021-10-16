require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const path = require("path");
const cors = require("cors");

// Listen for requests
const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");

// Kết nối database
connectDB();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Static folder
app.use("/static", express.static(path.join(__dirname, "public")));

app.use(cors());

// Routes
const apiRoute = require("./routes/api.route");

app.use("/api", apiRoute);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
