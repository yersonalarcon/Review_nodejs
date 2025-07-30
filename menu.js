import readline from 'readline';
import {mongodb,objectId} from 'mongodb';
import Crud from './CRUD';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });

const db = mongodb.MongoClient.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

async function createMenu() {
    console.log("Menu:")
    console.log("1. Usuarios")
    console.log("2. workSpace")
    console.log("3. Salir")
    rl.question("Seleccione una opción: ", async (opt) => {
        switch(opt) {
            case '1':
                await manageUsers();
                break;
            case '2':
                await manageWorkSpace();
                break;
            case '3':
                rl.close();
                break;
            default:
                console.log("Opción no válida. Intente de nuevo.");
                createMenu();
        }
    })
};

async function manageUsers() {
    console.log("Gestión de Usuarios:")
    console.log("1. Crear Usuario")
    console.log("2. Listar Usuarios")
    console.log("3. Ver Usuarios")
    console.log("4. Actualizar Usuario")
    console.log("5. Eliminar Usuario")
    console.log("6. Volver al Menú Principal")
    
    rl.question("Seleccione una opción: ", async (opt) => {
        switch(opt) {
            case '1':
                await createUser(db);
                break;
            case '2':
                await listUsers(db);
                break;
            case '3':
                await showUser(db);
                break;
            case '4':
                await updateUser(db);
                break;
            case '5':
                deleteUser(db);
                break;
            case '5':
                createMenu();
                break;
            default:
                console.log("Opción no válida. Intente de nuevo.");
                manageUsers();
        }
    });
}

