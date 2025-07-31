// CÓDIGO PARA TU ARCHIVO: CRUD.js (¡Todo en mayúsculas!)
import { MongoClient, ObjectId } from 'mongodb';

class dbManager {
    static uri = "mongodb://localhost:27017";
    static client = undefined;
    static dbName = "SuperWork"; // Nombre de la base de datos
    static db = undefined; // Para almacenar la instancia de la base de datos

    static async openDb(){
        if (!this.client) {
            this.client = new MongoClient(this.uri);
            try {
                await this.client.connect();
                this.db = this.client.db(this.dbName);
                console.log("Conexión a la DB abierta exitosamente.");
            } catch (error) {
                console.error("Error al conectar con la DB:", error);
                throw error; // Es importante relanzar el error para manejarlo en el menú
            }
        } else {
            // Si el cliente ya existe, solo nos aseguramos de que la instancia de DB esté configurada.
            // .connect() es idempotente; si ya está conectado, no intentará una nueva conexión.
            if (!this.db) {
                 this.db = this.client.db(this.dbName);
            }
            console.log("El cliente de la DB ya estaba inicializado.");
        }
    }

    static async closeDb(){
        if (this.client) {
            await this.client.close();
            this.client = undefined; // Resetea el cliente después de cerrar
            this.db = undefined;     // Resetea la DB después de cerrar
            console.log("Conexión a la DB cerrada.");
        }
    }

    // --- CRUD de Usuarios ---
    static async createUser(userDoc) {
        try {
            const collection = this.db.collection('users');
            const result = await collection.insertOne(userDoc);
            console.log(`Usuario creado con ID: ${result.insertedId}`);
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    }

    static async listUsers() {
        try {
            const collection = this.db.collection('users');
            const users = await collection.find({}).toArray();
            if (users.length > 0) {
                console.log("Lista de Usuarios:");
                users.forEach(user => console.table(`ID: ${user._id}, Nombre: ${user.name}, Email: ${user.email}, Posición: ${user.position}, Área: ${user.area}`));
            } else {
                console.log("No hay usuarios registrados.");
            }
            return users;
        } catch (error) {
            console.error("Error al listar usuarios:", error);
            return [];
        }
    }

    static async showUser(id) {
        try {
            const collection = this.db.collection('users');
            const user = await collection.findOne({ _id: new ObjectId(id) }); // Convierte a ObjectId
            if (user) {
                console.log("Detalles del Usuario:");
                console.log(`ID: ${user._id}`);
                console.log(`Nombre: ${user.name}`);
                console.log(`Email: ${user.email}`);
                console.log(`Posición: ${user.position}`);
                console.log(`Área: ${user.area}`);
            } else {
                console.log("Usuario no encontrado.");
            }
            return user;
        } catch (error) {
            console.error("Error al mostrar usuario:", error);
            return null;
        }
    }

    static async updateUser(id, updates) {
        try {
            const collection = this.db.collection('users');
            const result = await collection.updateOne(
                { _id: new ObjectId(id) }, // Convierte a ObjectId
                { $set: updates }
            );
            if (result.matchedCount > 0) {
                console.log("Usuario actualizado exitosamente.");
            } else {
                console.log("Usuario no encontrado o no se realizaron cambios.");
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
        }
    }

    static async deleteUser(id) {
        try {
            const collection = this.db.collection('users');
            const result = await collection.deleteOne({ _id: new ObjectId(id) }); // Convierte a ObjectId
            if (result.deletedCount > 0) {
                console.log("Usuario eliminado exitosamente.");
            } else {
                console.log("Usuario no encontrado.");
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    }

    // --- CRUD de Tareas ---
    static async createTask(taskDoc) {
        try {
            const collection = this.db.collection('tasks');
            const result = await collection.insertOne(taskDoc);
            console.log(`Tarea creada con ID: ${result.insertedId}`);
        } catch (error) {
            console.error("Error al crear tarea:", error);
        }
    }

    static async listTasks() {
        try {
            const collection = this.db.collection('tasks');
            const tasks = await collection.find({}).toArray();
            if (tasks.length > 0) {
                console.log("Lista de Tareas:");
                tasks.forEach(task => console.log(`ID: ${task._id}, Nombre: ${task.name}, Estado: ${task.status}`));
            } else {
                console.log("No hay tareas registradas.");
            }
            return tasks;
        } catch (error) {
            console.error("Error al listar tareas:", error);
            return [];
        }
    }

    static async showTask(id) {
        try {
            const collection = this.db.collection('tasks');
            const task = await collection.findOne({ _id: new ObjectId(id) }); // Convierte a ObjectId
            if (task) {
                console.log("Detalles de la Tarea:", task);
            } else {
                console.log("Tarea no encontrada.");
            }
            return task;
        } catch (error) {
            console.error("Error al mostrar tarea:", error);
            return null;
        }
    }

    static async updateTask(id, updates) {
        try {
            const collection = this.db.collection('tasks');
            const result = await collection.updateOne(
                { _id: new ObjectId(id) }, 
                { $set: updates }
            );
            if (result.matchedCount > 0) {
                console.log("Tarea actualizada exitosamente.");
            } else {
                console.log("Tarea no encontrada o no se realizaron cambios.");
            }
        } catch (error) {
            console.error("Error al actualizar tarea:", error);
        }
    }

    static async deleteTask(id) {
        try {
            const collection = this.db.collection('tasks');
            const result = await collection.deleteOne({ _id: new ObjectId(id) }); 
            if (result.deletedCount > 0) {
                console.log("Tarea eliminada exitosamente.");
            } else {
                console.log("Tarea no encontrada.");
            }
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
            return null; 
        }
    }

    // --- CRUD de WorkSpaces ---
    static async createWorkSpace(workSpaceDoc) {
        try {
            const collection = this.db.collection('workSpaces');
            const result = await collection.insertOne(workSpaceDoc);
            console.log(`WorkSpace creado con ID: ${result.insertedId}`);
        } catch (error) {
            console.error("Error al crear WorkSpace:", error);
        }
    }

    static async listWorkSpaces() {
        try {
            const collection = this.db.collection('workSpaces');
            const workSpaces = await collection.find({}).toArray();
            if (workSpaces.length > 0) {
                console.log("Lista de WorkSpaces:");
                workSpaces.forEach(ws => console.log(`ID: ${ws._id}, Nombre: ${ws.name}, Descripción: ${ws.description}`));
            } else {
                console.log("No hay WorkSpaces registrados.");
            }
            return workSpaces;
        } catch (error) {
            console.error("Error al listar WorkSpaces:", error);
            return [];
        }
    }

    static async showWorkSpace(id) {
        try {
            const collection = this.db.collection('workSpaces');
            const workSpace = await collection.findOne({ _id: new ObjectId(id) }); 
            if (workSpace) {
                console.log("Detalles del WorkSpace:", workSpace);
            } else {
                console.log("WorkSpace no encontrado.");
            }
            return workSpace;
        } catch (error) {
            console.error("Error al mostrar WorkSpace:", error);
            return null;
        }
    }

    static async updateWorkSpace(id, updates) {
        try {
            const collection = this.db.collection('workSpaces');
            const result = await collection.updateOne(
                { _id: new ObjectId(id) }, 
                { $set: updates }
            );
            if (result.matchedCount > 0) {
                console.log("WorkSpace actualizado exitosamente.");
            } else {
                console.log("WorkSpace no encontrado o no se realizaron cambios.");
            }
        } catch (error) {
            console.error("Error al actualizar WorkSpace:", error);
        }
    }

    static async deleteWorkSpace(id) {
        try {
            const collection = this.db.collection('workSpaces');
            const result = await collection.deleteOne({ _id: new ObjectId(id) }); 
            if (result.deletedCount > 0) {
                console.log("WorkSpace eliminado exitosamente.");
            } else {
                console.log("WorkSpace no encontrado.");
            }
        } catch (error) {
            console.error("Error al eliminar WorkSpace:", error);
        }
    }
}

export default dbManager;