// Router of the architecture part of the app :

const express = require('express');
const router = express.Router();
const architectureDAO = require('../databaseAccess/architectureDA');
const ArchitectureModel = require('../model/architectureModel');
const authMiddleware = require("../middleware/auth.middleware");

// Add a new architecture to the application :
router.post('/add', authMiddleware.checkIsAdminMiddleware,async (req, res, next) => {
    console.log("-- /architecture/new, post --");
    // Checking if the request is valid :
    if (req.body.name) {
        let newArchitecture = new ArchitectureModel(req.body.name);
        let find = await architectureDAO.canInsert(req.body.name);
        // Si l'élement est déjà dans la base de donénes on ne peut pas le remettre :
        if(find.length > 0){
            res.status(400).json({message: `L'élement ${req.body.name} que vous essayé d'ajouter est déjà dans la base `});
        } else {
            newArchitecture = await architectureDAO.insertNew(newArchitecture);
            res.end(JSON.stringify(newArchitecture));
        }
    } else {
        return res.status(400).json({message: "Erreur dans le contenu de la requete"})
    }
});

// Get all the existing architecture available in the database :
router.get('/getAll', authMiddleware.checkTokenMiddleware, async (req, res) => {
    console.log("-- /architecture/getAll, get --");
    res.end(JSON.stringify(await architectureDAO.getAll()));
});

// Get a specified architecture by id :
router.get('/get/:id', authMiddleware.checkTokenMiddleware, async (req, res) => {
    console.log("-- /architecture/get/"+req.params.id+", get --");
    res.end(JSON.stringify(await architectureDAO.getById(req.params.id)))
});

router.post('/edit', authMiddleware.checkIsAdminMiddleware, async (req, res) => {
    console.log("-- /architecture/edit, post--");
    // Check if the request is valid :
    if(req.body._id && req.body.name){
        let architecture = new ArchitectureModel(req.body.name, req.body._id);
        // Checking if the architecture name we want to put isn't already in the base :
        let find = await architectureDAO.canInsert(req.body.name);
        if(find.length > 0){
            res.status(400).json({message: `L'élement ${req.body.name} que vous essayé d'ajouter est déjà dans la base `});
        } else {
            res.end(JSON.stringify(await architectureDAO.edit(architecture)));
        }

    } else {
        res.status(400).json({message: "erreur dans le contenu de la requete"});
    }
});

// Delete an architecture by id ;
router.delete('/delete/:id', authMiddleware.checkIsAdminMiddleware, async (req, res) => {
   console.log("-- /architecture/delete"+req.params.id+", delete --");
   // Vérification de si l'architecture est utilisé ou pas :
    if(!await architectureDAO.isArchitectureUsed(req.params.id)){
        res.end(JSON.stringify(await architectureDAO.delete(req.params.id)));
    } else {
        res.status(400).json({message: "L'architecture est utilisé"});
    }
});


module.exports = router;