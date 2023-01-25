const config = require('./configDatabase');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const UserDA = {

    // Get all user in the base :
    getAll: async function(){
        const client = new MongoClient(config.url);

        try {
            await client.connect();
            const database = client.db(config.dbName);
            const userCollection = database.collection(config.userCollectionName);
            return await userCollection.find({}).toArray();
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    // Get one user by id :
    getById : async function(id){
        const client = new MongoClient(config.url);

        try {
            await client.connect();
            const database = client.db(config.dbName);
            const userCollection = database.collection(config.userCollectionName);
            return await userCollection.find({_id: new ObjectId(id)}).toArray();
        } catch (error){
            console.log(error);
        }
        finally {
            await client.close();
        }
    },

    // Get user by username :
    getByUsername: async function(name){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const userCollection = database.collection(config.userCollectionName);
            return await userCollection.findOne({pseudo: name});
        } catch (error ){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    // Add a new user :
    insertNew : async function(newUser){
        const client = new MongoClient(config.url);

        try {
            await client.connect();
            const database = client.db(config.dbName);
            const userCollection = database.collection(config.userCollectionName);
            return await userCollection.insertOne(newUser);
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    // Delete a user by id :
    deleteUser : async function(id){
        const client = new MongoClient(config.url);

        try {
            await client.connect();
            const database = client.db(config.dbName);
            const userCollection = database.collection(config.userCollectionName);
            return await userCollection.deleteOne({_id: new ObjectId(id)});
        } catch(error) {
            console.log(error);
        }
        finally {
            await client.close();
        }
    },

    // Try to log in :
    tryLogin: async function(username, password){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const userCollection = database.collection(config.userCollectionName);

            // We return the user if we find it in the base, else we don't return anything :
            return await userCollection.findOne({pseudo: username})
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    // Check if the user already exist in the database :
    checkUserExist: async function(username){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const userCollection = database.collection(config.userCollectionName);
            return await userCollection.findOne({pseudo: username});
        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    },

    // Edit user :
    editUser: async function(user){
        const client = new MongoClient(config.url);
        try{
            await client.connect();
            const database = client.db(config.dbName);
            const userCollection = database.collection(config.userCollectionName);
            return await userCollection.updateOne({_id: new ObjectId(user._id)},
                {$set:
                        {"pseudo": user.pseudo,
                        "name": user.name,
                        "surname": user.surname,
                        "idAvatar": user.idAvatar}});

        } catch (error){
            console.log(error);
        } finally {
            await client.close();
        }
    }
}

module.exports = UserDA;