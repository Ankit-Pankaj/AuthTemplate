const dotenv= require('dotenv')
dotenv.config();

const PORT = process.env.PORT;
const SERVER = process.env.SERVER;
const CLIENT_SERVER = process.env.CLIENT_SERVER
const MONGODB_URL = process.env.MONGODB_URL
const JWT_SECRET = process.env.JWT_SECRET

module.exports.variables={
    PORT,
    SERVER,
    CLIENT_SERVER,
    MONGODB_URL,
    JWT_SECRET
}