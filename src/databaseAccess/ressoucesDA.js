const config = require('./configDatabase');
const { MongoClient, ObjectId} = require('mongodb');
const CalendarDAO = require('./calendarDA');


const RessourcesDAO = {
    // Get all the ressources in the base :
    getAll: async function(){
        const client = new MongoClient(config.url);
        try {
            await client.connect();
            const database = client.db(config.dbName);
            const resourceCollection = database.collection(config.ressourcesCollectionName);
            return await resourceCollection.find({}).toArray();
        } catch (error){
            console.log(error)
        } finally {
            await client.close();
        }
    },

    // Insert new resources :
    insertNew : async function(newResource){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const resourceCollection = database.collection(config.ressourcesCollectionName);
            return await resourceCollection.insertOne(newResource);
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    // Update a resource
    updateResource: async function(resource){
        const client = new MongoClient(config.url);
        try {
            await client.connect();
            const database = client.db(config.dbName);
            const resourceCollection= database.collection(config.ressourcesCollectionName)
            return await resourceCollection.updateOne({_id: new ObjectId(resource._id)}, {
                $set:
                    {"name": resource.name,
                        "architecture":
                            {"name": resource.architecture.name, "_id": resource.architecture._id}}}
            );
        } catch(error){
            console.log(error)
        } finally {
            await client.close();
        }
    },

    canInsert: async function(name){
      const client = new MongoClient(config.url);
      try{
          await client.connect();
          const database = client.db(config.dbName);
          const resourceCollection = database.collection(config.ressourcesCollectionName);
          return await resourceCollection.find({name: name}).toArray();
      } catch (error){
        console.log(error);
      } finally {
          await client.close();
      }
    },

    // Get a resource by id :
    getById: async function(id){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const resourceCollection = database.collection(config.ressourcesCollectionName);
            return await resourceCollection.find({_id: new ObjectId(id)}).toArray();
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    // Return true if the resource is used, false else :
    isRessourceUsed: async function(id){
        let ressources = await CalendarDAO.getByIdRessource(id);
        return ressources.length
    },

    // Delete a resource by id :
    deleteById: async function(id){
        const client = new MongoClient(config.url);
        try {
            await client.connect();
            const database = client.db(config.dbName);
            const resourceCollection = database.collection(config.ressourcesCollectionName);
            return await resourceCollection.deleteOne({_id: new ObjectId(id)});
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

}
module.exports = RessourcesDAO;