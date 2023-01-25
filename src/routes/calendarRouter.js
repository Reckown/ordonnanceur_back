

const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const calendarDAO = require('../databaseAccess/calendarDA');
const ressourceDAO = require('../databaseAccess/ressoucesDA')

router.get('/getAll', authMiddleware.checkTokenMiddleware, async (req, res) =>{
    console.log("-- /calendar/getAll, get --");
    res.end(JSON.stringify(await calendarDAO.getAll()));
});

router.post('/add', authMiddleware.checkTokenMiddleware, async (req, res) => {
   console.log("-- /calendar/add, post -- ");
    if(req.body[0].start && req.body[0].end && req.body[0].title && req.body[0].user && req.body[0].idResource){
        let eventToAdd = req.body;
        // Check que y'ait pas de conflicts dans la base de données :
        let conflict = false;
        for(let i=0; i<eventToAdd.length; i++){
            conflict = await calendarDAO.checkConflicts(eventToAdd[i]);
            if (conflict){
                let resource = await ressourceDAO.getById(conflict.idResource)
                return res.status(400).json({message: `Probleme dans la réservation de la ressource : ${resource[0].name}, la ressource est déjà réservé à ce moment`});
            }
        }
        // Si y'a pas de conflict on peut inserer l'ensemble des données dans la base :
        for(let i=0; i<eventToAdd.length; i++){
            res.end(JSON.stringify(await calendarDAO.insertNew(req.body[i])));
        }
    } else {
        res.status(400).json({message: "Erreur dans le contenu de la requête"});
    }

});

// Get all by the id of the ressource
router.get("/get/:id", authMiddleware.checkTokenMiddleware, async (req, res) => {
    console.log("-- /calendar/get/"+req.params.id + ", get --");
    res.end(JSON.stringify(await calendarDAO.getByIdRessource(req.params.id)));
});

// Get all the event for a user :
router.get("/get/user/:id", authMiddleware.checkTokenMiddleware, async(req, res) => {
    console.log("-- /calendar/get/user"+req.params.id +" , get --");
    res.end(JSON.stringify(await calendarDAO.getByIdUser(req.params.id)));
});

router.delete("/delete/:id", authMiddleware.checkTokenMiddleware, async (req, res) => {
    console.log("-- /calendar/delete/"+req.params.id + ", delete --")
    res.end(JSON.stringify(await calendarDAO.deleteById(req.params.id)));
});


module.exports = router;