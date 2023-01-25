const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.middleware");
const userDao = require("../databaseAccess/userDA");
const bcrypt = require("bcrypt");
const UserModel = require("../model/userModel");
const userDAO = require("../databaseAccess/userDA");

// Connexion endpoint :
router.post('/login', async (req, res) => {
    console.log("-- /user/login -- post");
    // Invalid request
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: 'Error. Please enter the correct username and password'});
    }
    // Checking with the database if the user exist
    const user = await userDao.tryLogin(req.body.username, req.body.password);
    // Invalid user
    if (!user) {
        return res.status(401).json({message: 'Error. Wrong login or password'});
    }
    // Load hash from the db, which was preivously stored
    await bcrypt.compare( req.body.password, user.password, function(err, result) {
        if(result === true){
            const token = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin
            }, authMiddleware.SECRET, {expiresIn: '3 hours'});
            return res.json({access_token: token});
        }
        else {
            return res.status(401).json({message: 'Error. Wrong login or password'});
        }
    });

});

router.post('/register', async (req, res) => {
    // Check if the request is valid :
    if (!req.body.pseudo || !req.body.password) {
        return res.status(400).json({message: 'Error. Please enter username and password'});
    }
    // Check if the user already exist :
    const userExisting = await userDao.checkUserExist(req.body.pseudo);
    if (userExisting) {
        return res.status(400).json({message: `Error. User ${req.body.username} already existing`});
    }
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        password = hash;
        let newUser = new UserModel(req.body.pseudo, password,
            req.body.name, req.body.surname);

        // If the request is valid, we need to check that the user don't already exist in the base :
        newUser = await userDAO.insertNew(newUser);
        res.end(JSON.stringify(newUser));
    });
});

module.exports = router;