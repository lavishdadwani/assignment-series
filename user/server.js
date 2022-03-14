const express = require("express");
const dotenv = require("dotenv");
const app = express();
const userRoute = require("./routes/userRouts");
const cors = require("cors");
dotenv.config({ path: ".env" });
require("./db");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/Api/user", userRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});


// app.use((err, req, res, next) => {
//   console.log(err);
//   if (err.name === "Ststic Error") return res.status(400).send(err.message);
//   res.send(err.message);
// });

app.listen(process.env.PORT || 8080, () => {
  console.log("server start");
});
