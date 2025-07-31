// CÓDIGO PARA TU ARCHIVO: menu.js
import readline from 'readline';
import dbManager from './CRUD.js'; // Importa el dbManager (asegúrate de que este archivo exista y esté bien)
import { crearHtml } from './crearhtml.js'; // Asegúrate de que esta ruta sea correcta
import fs from 'fs/promises'; // Para escribir archivos de forma asíncrona

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función auxiliar para preguntar y obtener una respuesta
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Función principal para iniciar la aplicación
async function runApplication() {
    try {
        await dbManager.openDb(); // Abre la conexión a la base de datos al inicio
        createMenu();
    } catch (error) {
        console.error("La aplicación no pudo iniciar debido a un error de conexión a la base de datos:", error.message);
        rl.close();
    }
}

async function createMenu() {
    console.log("\n--- Menú Principal ---");
    console.log("1. Gestión de Usuarios");
    console.log("2. Gestión de WorkSpaces");
    console.log("3. Gestión de Tareas"); // Agregado de nuevo
    console.log("4. Salir");
    rl.question("Seleccione una opción: ", async (opt) => {
        switch(opt) {
            case '1':
                await manageUsers();
                break;
            case '2':
                await manageWorkSpace();
                break;
            case '3': // Nuevo caso para Gestión de Tareas
                await manageTasks();
                break;
            case '4':
                await dbManager.closeDb(); // Cierra la conexión de la DB antes de salir
                rl.close();
                console.log("Aplicación finalizada.");
                break;
            default:
                console.log("Opción no válida. Intente de nuevo.");
                createMenu();
        }
    });
}

async function manageUsers() {
    console.log("\n--- Gestión de Usuarios ---");
    console.log("1. Crear Usuario");
    console.log("2. Listar Usuarios");
    console.log("3. Ver Usuario por ID");
    console.log("4. Actualizar Usuario");
    console.log("5. Eliminar Usuario");
    console.log("6. Volver al Menú Principal");

    const opt = await askQuestion("Seleccione una opción: ");
    switch(opt) {
        case '1':
            const userName = await askQuestion("Ingrese el nombre del usuario: ");
            const userEmail = await askQuestion("Ingrese el email del usuario: ");
            const userPosition = await askQuestion("Ingrese la posición del usuario: ");
            const userArea = await askQuestion("Ingrese el área del usuario: ");
            const newUser = { name: userName, email: userEmail, position: userPosition, area: userArea };
            await dbManager.createUser(newUser);
            manageUsers();
            break;
        case '2':
            await dbManager.listUsers();
            manageUsers();
            break;
        case '3':
            const userIdToShow = await askQuestion("Ingrese el ID del usuario a ver: ");
            await dbManager.showUser(userIdToShow);
            manageUsers();
            break;
        case '4':
            const userIdToUpdate = await askQuestion("Ingrese el ID del usuario a actualizar: ");
            const updateFieldName = await askQuestion("Ingrese el nombre del campo a actualizar (ej: name, email): ");
            const updateFieldValue = await askQuestion(`Ingrese el nuevo valor para ${updateFieldName}: `);
            const updates = { [updateFieldName]: updateFieldValue };
            await dbManager.updateUser(userIdToUpdate, updates);
            manageUsers();
            break;
        case '5':
            const userIdToDelete = await askQuestion("Ingrese el ID del usuario a eliminar: ");
            await dbManager.deleteUser(userIdToDelete);
            manageUsers();
            break;
        case '6':
            createMenu();
            break;
        default:
            console.log("Opción no válida. Intente de nuevo.");
            manageUsers();
    }
}

async function manageWorkSpace() {
    console.log("\n--- Gestión de WorkSpaces ---");
    console.log("1. Crear WorkSpace");
    console.log("2. Listar WorkSpaces");
    console.log("3. Ver WorkSpace por ID");
    console.log("4. Actualizar WorkSpace");
    console.log("5. Eliminar WorkSpace");
    console.log("6. Generar Reporte de WorkSpace");
    console.log("7. Volver al Menú Principal");

    const opt = await askQuestion("Seleccione una opción: ");
    switch(opt) {
        case '1':
            const wsName = await askQuestion("Ingrese el nombre del WorkSpace: ");
            const wsDesc = await askQuestion("Ingrese la descripción del WorkSpace: ");
            const newWorkSpace = {
                name: wsName,
                description: wsDesc,
                workGroup: [],
                tasks: []
            };
            await dbManager.createWorkSpace(newWorkSpace);
            manageWorkSpace();
            break;
        case '2':
            await dbManager.listWorkSpaces();
            manageWorkSpace();
            break;
        case '3':
            const wsIdToShow = await askQuestion("Ingrese el ID del WorkSpace a ver: ");
            await dbManager.showWorkSpace(wsIdToShow);
            manageWorkSpace();
            break;
        case '4':
            const wsIdToUpdate = await askQuestion("Ingrese el ID del WorkSpace a actualizar: ");
            const updateWsFieldName = await askQuestion("Ingrese el nombre del campo a actualizar (ej: name, description): ");
            const updateWsFieldValue = await askQuestion(`Ingrese el nuevo valor para ${updateWsFieldName}: `);
            const wsUpdates = { [updateWsFieldName]: updateWsFieldValue };
            await dbManager.updateWorkSpace(wsIdToUpdate, wsUpdates);
            manageWorkSpace();
            break;
        case '5':
            const wsIdToDelete = await askQuestion("Ingrese el ID del WorkSpace a eliminar: ");
            await dbManager.deleteWorkSpace(wsIdToDelete);
            manageWorkSpace();
            break;
        case '6':
            const reportWsId = await askQuestion("Ingrese el WorkSpace ID para el reporte: ");
            await generateWorkSpaceReport(reportWsId);
            manageWorkSpace();
            break;
        case '7':
            createMenu();
            break;
        default:
            console.log("Opción no válida. Intente de nuevo.");
            manageWorkSpace();
    }
}

async function manageTasks() {
    console.log("\n--- Gestión de Tareas ---");
    console.log("1. Crear Tarea");
    console.log("2. Listar Tareas");
    console.log("3. Ver Tarea por ID");
    console.log("4. Actualizar Tarea");
    console.log("5. Eliminar Tarea");
    console.log("6. Volver al Menú Principal");

    const opt = await askQuestion("Seleccione una opción: ");
    switch(opt) {
        case '1':
            const taskName = await askQuestion("Ingrese el nombre de la tarea: ");
            const taskDesc = await askQuestion("Ingrese la descripción de la tarea: ");
            const taskStartDate = new Date(await askQuestion("Ingrese la fecha de inicio (YYYY-MM-DD, ej: 2024-07-30): "));
            const taskEndDate = new Date(await askQuestion("Ingrese la fecha de fin (YYYY-MM-DD, ej: 2024-08-30): "));
            const taskStatus = await askQuestion("Ingrese el estado de la tarea: ");
            const taskPriority = await askQuestion("Ingrese la prioridad de la tarea: ");

            const newTask = {
                name: taskName,
                description: taskDesc,
                startDate: taskStartDate,
                endDate: taskEndDate,
                status: taskStatus,
                priority: taskPriority,
                responsables: [] 
            };
            await dbManager.createTask(newTask);
            manageTasks();
            break;
        case '2':
            await dbManager.listTasks();
            manageTasks();
            break;
        case '3':
            const taskIdToShow = await askQuestion("Ingrese el ID de la tarea a ver: ");
            await dbManager.showTask(taskIdToShow);
            manageTasks();
            break;
        case '4':
            const taskIdToUpdate = await askQuestion("Ingrese el ID de la tarea a actualizar: ");
            const updateTaskFieldName = await askQuestion("Ingrese el nombre del campo a actualizar (ej: status, priority): ");
            let updateTaskFieldValue = await askQuestion(`Ingrese el nuevo valor para ${updateTaskFieldName}: `);
            if (updateTaskFieldName === 'startDate' || updateTaskFieldName === 'endDate') {
                updateTaskFieldValue = new Date(updateTaskFieldValue);
            }
            const taskUpdates = { [updateTaskFieldName]: updateTaskFieldValue };
            await dbManager.updateTask(taskIdToUpdate, taskUpdates);
            manageTasks();
            break;
        case '5':
            const taskIdToDelete = await askQuestion("Ingrese el ID de la tarea a eliminar: ");
            await dbManager.deleteTask(taskIdToDelete);
            manageTasks();
            break;
        case '6':
            createMenu();
            break;
        default:
            console.log("Opción no válida. Intente de nuevo.");
            manageTasks();
    }
}

async function generateWorkSpaceReport(workSpaceId) {
    try {
        console.log(`Buscando WorkSpace con ID: ${workSpaceId}`);
        const workSpaceData = await dbManager.showWorkSpace(workSpaceId); 

        if (workSpaceData) {
            console.log("WorkSpace encontrado. Generando reporte...");
            const htmlContent = crearHtml('workspace-report', workSpaceData);
            const fileName = `report_workspace_${workSpaceId}.html`;
            await fs.writeFile(fileName, htmlContent); 
            console.log(`Reporte generado exitosamente: ${fileName}`);
        } else {
            console.log("WorkSpace no encontrado con ese ID o ID inválido.");
        }
    } catch (error) {
        console.error("Error al generar el reporte:", error);
    }
}

// Inicia la aplicación
runApplication();