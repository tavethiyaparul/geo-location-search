const express = require('express')
const cors = require('cors')
const app = express()
const errormiddleware = require("./middleware/error")

//passport use
const passport = require('passport');
app.use(passport.initialize());

app.set("trust proxy", true);
app.use(express.json());
app.use(cors({ origin: "*" }))
app.use(express.urlencoded({extended:true}))


// return full path api call
let path;
app.use((req, res, next) => {
  path = `Route Path ${req.method} = http://${req.hostname}:${process.env.PORT}${req.path} `;
  console.log(path);
  next(); // calling next middleware function or handler
});

app.use("/api/v1",require('./routes/user.router'))
app.use("/api/v1",require('./routes/post.router'))

app.use(errormiddleware)

module.exports = app