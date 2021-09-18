const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbInit = require('./config/db')
const userRoute = require('./user/routes')
const passport = require('passport')
const {variables} = require('./config/variables')
const app = express();

require('./middlewears/passport')(passport);
app.use(passport.initialize());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())

dbInit();

// ------_Routes------------

app.use(userRoute)

// --------Server-------------

app.listen(variables.PORT, ()=>{
    console.log('connected to 4300');
})