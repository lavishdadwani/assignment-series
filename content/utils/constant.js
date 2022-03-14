const dotenv = require("dotenv")
dotenv.config({ path: '.env' });

const hostName  = process.env.ENVIRONMENT === "DEVELOPMENT" ?   'http://localhost:8082' :  process.env.HOSTNAME 

module.exports =  hostName

// pass hostname