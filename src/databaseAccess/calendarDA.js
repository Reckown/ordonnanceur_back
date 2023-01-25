const config = require('./configDatabase');
const {MongoClient, ObjectId} = require('mongodb');

const CalendarDA = {
    // Get all events in the base :
    getAll: async function(){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const calendarCollection = database.collection(config.calendarCollectionName);
            return await calendarCollection.find({}).toArray();
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    // Insert a new event in the database :
    insertNew : async function(newEvent){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const calendarCollection = database.collection(config.calendarCollectionName);
            return await calendarCollection.insertOne(newEvent);
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    getByIdRessource: async function(idResource){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const calendarCollection = database.collection(config.calendarCollectionName);
            return await calendarCollection.find({"idResource": idResource}).toArray();
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    getByIdUser: async function(idUser){
        const client = new MongoClient(config.url);
        try {
            await client.connect();
            const database = client.db(config.dbName);
            const calendarCollection = database.collection(config.calendarCollectionName);
            return await calendarCollection.find({user: idUser}).toArray();
        } catch (error){
          console.log(error);
        } finally {
            await client.close();
        }
    },

    // Return true if there is no conflicts
    // Return false if there is a confict
    checkConflicts: async function(resourceToCheck){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const calendarCollection = database.collection(config.calendarCollectionName);
            return await calendarCollection.findOne({
                idResource: resourceToCheck.idResource,
                $or: [
                    {$and: [{start: {$gte: resourceToCheck.start}}, {start: {$lte: resourceToCheck.end}}]},
                    {$and: [{end: {$gte: resourceToCheck.start}}, {end: {$lte: resourceToCheck.end}}]},
                    {$and: [{start: {$lte: resourceToCheck.start}}, {end: {$gte: resourceToCheck.end}}]}
                ]
            });

        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    // Donne les stats sur les ressources,
    // [
    //      ressource : "nom de la ressource", value: "temps d'utilisation de la ressource"
    // ]
    getStatByResources: async function(){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const calendarCollection = database.collection(config.calendarCollectionName);
            // Liste des evenement dans la base
            let calendarEvent = await calendarCollection.find({}).toArray();
            // List des ressources dans la base :
            const resourceCollection = database.collection(config.ressourcesCollectionName);
            let resources = await resourceCollection.find({}).toArray();

            let ret = [];
            // Initial state of the return array:
            for(let i = 0; i<resources.length; i++){
                ret.push({
                    "resourceName": resources[i].name,
                    "resourceId": resources[i]._id.toString(),
                    "value": 0
                });
            }

            for(let i=0; i<calendarEvent.length; i++){
                let id = ret.find((elem) => elem.resourceId === calendarEvent[i].idResource);
                let startDate = new Date(calendarEvent[i].start);
                let endDate = new Date(calendarEvent[i].end);
                // On veut le temps en minutes :
                let seconds = (endDate.getTime() - startDate.getTime()) / 60000;
                id.value += seconds;
            }
            return ret;
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },



    // Donne les stats sur les utilisateurs,
    // [
    //      utilisateur : "nom de la utilsaiteur", value: "temps d'utilisation de la ressource"
    // ]
    getStatByUser: async function(){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const calendarCollection = database.collection(config.calendarCollectionName);
            // Liste des evenement dans la base
            let calendarEvent = await calendarCollection.find({}).toArray();
            // List des ressources dans la base :
            const userCollection = database.collection(config.userCollectionName);
            let users = await userCollection.find({}).toArray();

            let ret = [];
            // Initial state of the return array:
            for(let i = 0; i<users.length; i++){
                ret.push({
                    "pseudo":users[i].pseudo,
                    "userId": users[i]._id.toString(),
                    "value": 0
                });
            }

            for(let i=0; i<calendarEvent.length; i++){
                let id = ret.find((elem) => elem.userId === calendarEvent[i].user);
                let startDate = new Date( calendarEvent[i].start);
                let endDate = new Date(calendarEvent[i].end);
                // On veut le temps en minutes :
                let seconds = (endDate.getTime() - startDate.getTime()) / 60000;
                id.value += seconds;
            }
            return ret;
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    deleteById: async function(id){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const calendarCollection = database.collection(config.calendarCollectionName);
            return await calendarCollection.deleteOne({_id: new ObjectId(id)});
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    }
}

module.exports = CalendarDA;

