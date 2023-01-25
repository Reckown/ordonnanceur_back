const express = require('express');
const router = express.Router();
const resourceDAO = require('../databaseAccess/ressoucesDA');
const ResourceModel = require('../model/resourceModel');
const authMiddleware = require("../middleware/auth.middleware");

// Add a new ressource to the application :
router.post('/add',authMiddleware.checkIsAdminMiddleware,  async (req, res) => {
   console.log("-- /resource/new, post --");
   if(req.body.name && req.body.architecture){
       // Check si l'element existe déjà dans la base de données ou pas :
       if((await resourceDAO.canInsert(req.body.name)).length > 0){
           res.status(400).json({message: `L'élement ${req.body.name} que vous essayé d'ajouter est déjà dans la base `});
       }
       else {
           let newResource = new ResourceModel(req.body.name, req.body.architecture);
           newResource = await resourceDAO.insertNew(newResource);
           res.end(JSON.stringify(newResource));
       }
   } else {
       res.status(400).json({message: "erreur dans le contenu de la requête"});
   }
});

// Get all the resources :
router.get('/getAll', authMiddleware.checkTokenMiddleware, async (req, res) => {
    console.log("-- /resource/getAll, get --");
    res.end(JSON.stringify(await resourceDAO.getAll()));
});

// Get one resource
router.get('/get/:id', authMiddleware.checkTokenMiddleware,  async (req, res) => {
   console.log("-- /resource/get/"+req.params.id+", get --");
   res.end(JSON.stringify(await resourceDAO.getById(req.params.id)));
});

// Delete one resource :
router.delete('/delete/:id', authMiddleware.checkIsAdminMiddleware, async (req, res) => {
   console.log("-- /resource/delete/"+req.params.id+", delete --");
   if(await resourceDAO.isRessourceUsed(req.params.id) > 0){
       res.status(400).json({message: "La ressource que vous essayé de supprimer possede encode des réservation"})
   } else {
       res.end(JSON.stringify(await resourceDAO.deleteById(req.params.id)));
   }
});

// Edit a resource :
router.post('/edit', authMiddleware.checkIsAdminMiddleware, async (req, res) => {
   console.log("-- /resource/edit, post --");
   if(req.body.name && req.body.architecture && req.body._id){
       // Check si l'element existe déjà dans la base de données ou pas :
       if((await resourceDAO.canInsert(req.body.name)).length > 0){
           res.status(400).json({message: `L'élement ${req.body.name} que vous essayé d'ajouter est déjà dans la base `});
       } else {
           let resource = new ResourceModel(req.body.name, req.body.architecture, req.body._id);
           res.end(JSON.stringify(await resourceDAO.updateResource(resource)));
       }
    }
   else {
       res.status(400).json({message: "Erreur dans le contenue de la requête"});
   }

});

module.exports = router;