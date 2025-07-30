import { MongoClient,ObjectId } from 'mongodb';

class dbManager {
    static uri = "mongodb://localhost:27017";
    static client = undefined
    static dbName = "eantion"

    static async openDb(){
        client = new MongoClient(uri);
        await this.client.connect();
        this.db = this.client.db(dbName);
    }

    static async closeDb(){
        await this.client.close()
    }

    static async createUser(collection,doc){
        await this.db.collection(collection).insertOne(doc)
        console.log("Creando usuario")
    }
    static async listUsers(collection){
        await this.db.collection(collection).find()
        console.log("Lista de usuarios")
    }
    
    static async showUser(collection,_id){
        await this.db.collection(collection).find(_id)
        console.log("Ver usuarios por Id")
    }
    
    static async updateUser(collection,_id,doc){
        await this.db.collection(collection).set(_id)
        console.log("Usuario Actualizado")
    }
    
    static async deleteUser(collection,_id){
        await this.db.collection(collection).drop(doc)
        console.log("Usuario Eliminado")
    }
    
}


export default Crud;

