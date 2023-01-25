const express = require('express');
const port = 3000;
const path = require("path");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');


const app = express();

// TODO : rajouter les sécuritées sur les delete :) 
// TODO Dans le choix des dates faire en sorte qu'on puisse pas prendre une date avant la date courante
// Faire en sorte que ladate de début peut pas etre avant la fin

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true}));



// Router :
const architectureRouter = require('./src/routes/architectureRouter');
const userRouter = require('./src/routes/userRouter');
const resourceRouter = require('./src/routes/resourceRouter');
const loginRouter = require('./src/routes/loginRouter');
const calendarRouter = require('./src/routes/calendarRouter');
const statRouter = require('./src/routes/statsRouter');

// Routes :
app.use("/architecture", architectureRouter);
app.use("/user", userRouter);
app.use("/resource", resourceRouter);
app.use("/connect", loginRouter);
app.use("/calendar", calendarRouter);
app.use("/stat", statRouter);

app.listen(port, () => {
    console.log(`Listening on port : ${port}`);
});