// Router for the statistiqs parts of the apps :

const express = require('express');
const router = express.Router();
const CalendarEventModel = require("../model/calendarEventModel");
const calendarDAO = require('../databaseAccess/calendarDA');
const StatByResourceModel = require('../model/statByResourcesModel');
const authMiddleware = require("../middleware/auth.middleware");


// get stats by resources : :
router.get("/get/byResources", authMiddleware.checkTokenMiddleware, async(req, res) => {
   console.log("-- /stat/get/byResources, get --");
   res.end(JSON.stringify(await calendarDAO.getStatByResources()));
});


router.get("/get/byUser", authMiddleware.checkTokenMiddleware,  async (req, res)=> {
   console.log("-- /stat/get/byUser, get --");
   res.end(JSON.stringify(await calendarDAO.getStatByUser()));
});


module.exports = router;