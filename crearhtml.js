import { ObjectId } from 'mongodb'; 

export function crearHtml(tipoReporte, datos) {
    let html = `<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte ${tipoReporte} - Acme Corporate</title>
        <style>
            ${getCSS()}
        </style>
    </head>
    <body>
        <header>
            <div class="logo-container">
                <img src="data:image/svg+xml;base64,${getLogoBase64()}" alt="Logo Acme Corporate" class="logo">
                <h1>Acme Corporate</h1>
            </div>
            <p class="report-title">${getReportTitle(tipoReporte)}</p>
            <p class="report-date">Generado el: ${new Date().toLocaleDateString()}</p>
        </header>
        
        <main>
            ${generateReportContent(tipoReporte, datos)}
        </main>
        
        <footer>
            <p>WorkSpace</p>
        </footer>
    </body>
    </html>`;
    
    return html;
}

function getLogoBase64() {
    return 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U3NGMzYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1zaXplPSIyMCI+QUNNRTwvdGV4dD48L3N2Zz4=';
}

function getReportTitle(tipoReporte) {
    const titles = {
        'workspace-report': 'WorkSpace Report', // Agregada para tu caso
        'error': 'Error en el reporte' // Se mantiene para manejo de errores generales
    };
    return titles[tipoReporte] || 'Reporte de Acme Corporate';
}

/**
 * Función auxiliar para formatear valores antes de mostrarlos en HTML.
 * Convierte ObjectIds a strings y maneja valores nulos/indefinidos.
 * Ahora también maneja objetos y arrays.
 * @param {*} value El valor a formatear.
 * @returns {string} El valor formateado como string.
 */
function formatValueForHtml(value) {
    if (value === null || value === undefined || value === '') {
        return 'N/A';
    }
    // Verifica si es un ObjectId de MongoDB y lo convierte a string hexadecimal
    // Solo si ObjectId fue importado y se usa en tus datos.
    if (typeof value === 'object' && value instanceof ObjectId) {
        return value.toHexString();
    }
    // Si es una fecha, formatearla
    if (value instanceof Date) {
        return value.toLocaleDateString(); // O value.toLocaleString() para fecha y hora
    }
    // Si es un array, unirlos con coma (o un formato más específico si se requiere)
    if (Array.isArray(value)) {
        if (value.length === 0) return 'N/A';
        return value.map(item => formatValueForHtml(item)).join(', ');
    }
    // Si es un objeto, intentar serializarlo a string (ej. para debugging) o acceder a propiedades específicas
    if (typeof value === 'object') {
        try {
            if (value instanceof ObjectId) return value.toHexString();
            return JSON.stringify(value);
        } catch (e) {
            return '[Objeto Ilegible]';
        }
    }
    // Para otros tipos (números, strings, booleans), simplemente convertirlos a string
    return value.toString();
}

function generateReportContent(tipoReporte, datos) {
    switch(tipoReporte) {
        case 'workspace-report': // Único caso de reporte específico
            return generateWorkSpaceReport(datos);
        case 'error': // Caso para errores generales
            return generateErrorReport(datos);
        default:
            return '<p>Tipo de reporte no válido o no especificado para WorkSpace.</p>';
    }
}

function generateErrorReport(errorData) {
    return `
    <div class="error-container">
        <h2>${formatValueForHtml(errorData.titulo)}</h2>
        <p class="error-message">${formatValueForHtml(errorData.mensaje)}</p>
        ${errorData.detalles ? `<div class="error-details">${formatValueForHtml(errorData.detalles)}</div>` : ''}
    </div>
    `;
}

// FUNCIÓN ESPECÍFICA PARA EL REPORTE DE WORKSPACE
function generateWorkSpaceReport(workspaceData) {
    if (!workspaceData || typeof workspaceData !== 'object') {
        return `
        <div class="no-data">
            <p>Datos de WorkSpace no válidos o no proporcionados.</p>
        </div>
        `;
    }

    let html = `
        <div class="report-section">
            <h2>WorkSpace: ${formatValueForHtml(workspaceData.name)}</h2>
            <p><strong>Description:</strong> ${formatValueForHtml(workspaceData.description)}</p>
        </div>

        <div class="report-section">
            <h3>Work Group</h3>
            ${workspaceData.workGroup && Array.isArray(workspaceData.workGroup) && workspaceData.workGroup.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Position</th>
                            <th>Area</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${workspaceData.workGroup.map(user => `
                            <tr>
                                <td>${formatValueForHtml(user.name)}</td>
                                <td>${formatValueForHtml(user.email)}</td>
                                <td>${formatValueForHtml(user.position)}</td>
                                <td>${formatValueForHtml(user.area)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : '<p>No work group members assigned.</p>'}
        </div>

        <div class="report-section">
            <h3>Tasks</h3>
            ${workspaceData.tasks && Array.isArray(workspaceData.tasks) && workspaceData.tasks.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Responsables</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${workspaceData.tasks.map(task => `
                            <tr>
                                <td>${formatValueForHtml(task.name)}</td>
                                <td>${formatValueForHtml(task.description)}</td>
                                <td>${formatValueForHtml(task.startDate)}</td>
                                <td>${formatValueForHtml(task.endDate)}</td>
                                <td>${formatValueForHtml(task.status)}</td>
                                <td>${formatValueForHtml(task.priority)}</td>
                                <td>
                                    ${task.responsables && Array.isArray(task.responsables) && task.responsables.length > 0 
                                        ? task.responsables.map(r => formatValueForHtml(r.name)).join(', ') 
                                        : 'N/A'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : '<p>No tasks assigned to this workspace.</p>'}
        </div>
    `;
    return html;
}


function getCSS() {
    return `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    body {
        color: #333;
        line-height: 1.6;
    }
    
    header {
        background-color: #2c3e50;
        color: white;
        padding: 20px;
        text-align: center;
        border-bottom: 5px solid #e74c3c;
    }
    
    .logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;
    }
    
    .logo {
        height: 50px;
        margin-right: 15px;
    }
    
    .report-title {
        font-size: 1.5em;
        font-weight: bold;
        margin: 10px 0;
    }
    
    .report-date {
        font-size: 0.9em;
        opacity: 0.8;
    }
    
    main {
        padding: 20px;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    
    th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    
    th {
        background-color: #f2f2f2;
        font-weight: bold;
    }
    
    tr:hover {
        background-color: #f5f5f5;
    }
    
    .report-section {
        margin-bottom: 30px;
        padding: 15px;
        background-color: #f9f9f9;
        border-left: 4px solid #3498db; /* Un color diferente para las secciones de WorkSpace */
        border-radius: 5px;
    }
    
    .report-section h2, .report-section h3 {
        color: #2c3e50;
        margin-top: 0;
        margin-bottom: 15px;
    }
    
    .no-data {
        text-align: center;
        padding: 20px;
        background-color: #ffe0b2; /* Color más suave para mensajes de no datos */
        border: 1px solid #ffcc80;
        border-radius: 5px;
        color: #e65100;
        font-weight: bold;
    }

    /* Estilos para errores */
    .error-container {
        background-color: #ffeeee;
        border: 1px solid #ffcccc;
        padding: 20px;
        margin: 20px 0;
        border-radius: 5px;
    }
    
    .error-message {
        color: #d9534f;
        font-weight: bold;
        margin: 10px 0;
    }
    
    .error-details {
        margin-top: 15px;
        padding: 10px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 3px;
        font-family: monospace;
        white-space: pre-wrap;
    }
    
    footer {
        text-align: center;
        padding: 15px;
        background-color: #f2f2f2;
        margin-top: 20px;
        font-size: 0.9em;
    }
    `;
}
