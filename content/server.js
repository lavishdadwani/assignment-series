const express = require("express")
const dotenv = require("dotenv")
const app = express()
const contentRoutes = require("./routes/contentRoutes")
const cors = require('cors')
dotenv.config({ path: '.env' });
require('./db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/Api/book',contentRoutes)
app.get('/', (req, res) => {
    res.send('hello world');
  });
  


app.listen(process.env.PORT || 8081,()=>{
    console.log("server start")
})