const config = require('./configDatabase');
const { MongoClient, ObjectId} = require('mongodb');
const resourceDAO = require('./ressoucesDA');

const ArchitectureDA = {
    // Get all the architectures in the base :
    getAll: async function(){
        const client = new MongoClient(config.url);

        try {
            await client.connect();
            const database = client.db(config.dbName);
            const architectureCollection = database.collection(config.architectureCollectionName);
            return await architectureCollection.find({}).toArray();
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    // Get one architecture by id :
    getById : async function(id){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const architectureCollection = database.collection(config.architectureCollectionName);
            return await architectureCollection.find({_id: new ObjectId(id)}).toArray();
        } catch (error){
            console.log(error);
        }finally {
            await client.close();
        }
    },

    // Insert new architecture :
    insertNew : async function(newArchitecture){
        const client = new MongoClient(config.url);
        try {
            await client.connect();
            const database = client.db(config.dbName);
            const architectureCollection = database.collection(config.architectureCollectionName);
            return await architectureCollection.insertOne(newArchitecture);
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    // Return the element if it find it
    canInsert: async function(name){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const architectureCollection = database.collection(config.architectureCollectionName);
            return await architectureCollection.find({name: name}).toArray();
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    // Edit one architecture :
    edit: async function(architecture){
        const client = new MongoClient(config.url);
        try {
            await client.connect();
            const database = client.db(config.dbName);
            const architectureCollection = database.collection(config.architectureCollectionName);
            const resourceCollection = database.collection(config.ressourcesCollectionName);
            // Putting the new name into the architecture
            let ret =  await architectureCollection.updateOne({_id: new ObjectId(architecture._id)}, {$set: {"name": architecture.name}});
            // After modifiing the name we need to update all the resources using this architecture
            let resources = await resourceCollection.find({}).toArray();
            for(let i = 0; i<resources.length; i++){
                if(resources[i].architecture._id === architecture._id){
                    resources[i].architecture = architecture;
                    await resourceDAO.updateResource(resources[i]);
                }
            }
            return ret;
            // Af
        } catch (error){
            console.log(error);
        }
        finally {
            await client.close();
        }
    },

    isArchitectureUsed: async function(id) {
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const resourceCollection = database.collection(config.ressourcesCollectionName);
            let resources =  await resourceCollection.find({}).toArray();
            for(let i=0; i<resources.length; i++){
                if(resources[i].architecture._id === id){
                    return true;
                }
            }
            return false
        } catch (error){
            console.log(error)
        } finally {
            await client.close();
        }
    },

    delete: async function(id){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const architectureCollection = database.collection(config.architectureCollectionName);
            return await architectureCollection.deleteOne({_id: new ObjectId(id)});
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    }

}

module.exports = ArchitectureDA;