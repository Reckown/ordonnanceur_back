// Router for the user part of the application :

const express = require('express');
const router = express.Router();
const userDAO = require('../databaseAccess/userDA');
const UserModel = require('../model/userModel');
const authMiddleware = require("../middleware/auth.middleware");
const bcrypt = require('bcrypt');

// Add a new user to the application :
router.post('/new', authMiddleware.checkIsAdminMiddleware,async (req, res) => {
   console.log("-- /user/new, post --");

    // Checking if the request is valid or no :
    if(req.body.pseudo && req.body.password &&
        req.body.name && req.body.surname) {
        let password;

        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            password = hash;
            let newUser = new UserModel(req.body.pseudo, password,
                req.body.name, req.body.surname);

            // If the request is valid, we need to check that the user don't already exist in the base :
            let allUserList = await userDAO.getAll();
            let alreadyInDatabase = false;
            for (let i = 0; i < allUserList.length; i++) {
                if (allUserList[i].pseudo === newUser.pseudo) {
                    alreadyInDatabase = true;
                }
            }
            if (alreadyInDatabase === false) {
                newUser = await userDAO.insertNew(newUser);
                res.end(JSON.stringify(newUser));
            } else {
                // If the user already exist, we send the 403 error code
                res.sendStatus(400)
            }
        });


    } else {
        res.sendStatus(400);
    }
});

// Get all user in the base :
router.get('/getAll', authMiddleware.checkTokenMiddleware, async (req, res) => {
    console.log("-- /user/getAll, get --");
    res.end(JSON.stringify(await userDAO.getAll()));
});

// Get a user by id :
router.get('/get/:id', authMiddleware.checkTokenMiddleware, async (req, res) => {
   console.log("-- user/get/"+ req.params.id + " , get --");
   res.end(JSON.stringify(await userDAO.getById(req.params.id)));
});

router.get('/getByName/:name', authMiddleware.checkTokenMiddleware, async (req, res) => {
    console.log("-- user/getByName/"+req.params.name+" , get --");
    res.end(JSON.stringify(await userDAO.getByUsername(req.params.name)))
});

// Delete a user by id :
router.delete('/delete/:id', authMiddleware.checkIsAdminMiddleware, async (req, res) => {
   console.log("-- user/delete/" + req.params.id + " , delete--");
    res.end(JSON.stringify(await userDAO.deleteUser(req.params.id)));
});

// Edit a user by id :
router.post('/edit', authMiddleware.checkTokenMiddleware, async (req, res) => {
    console.log("-- user/edit/, post -- ");
    res.end(JSON.stringify(await userDAO.editUser(req.body)));

});

module.exports = router;