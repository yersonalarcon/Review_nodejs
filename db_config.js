users = {
    name: 'users',
    email: 'email',
    position: 'position',
    area: 'area',
};
tasks = {
    name: 'tasks',
    description: 'description',
    startDate: 'startDate',
    endDate: 'endDate',
    status: 'status',
    priority: 'priority',
    responsables:[ users],
};


workSpace = {
    name: 'workSpace',
    description: 'description',
    workGroup: [users],
    tasks: [tasks],
};



db.createCollection("users",{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "email", "position", "area"],
            properties: {
                name: { bsonType: "string" },
                email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
                position: { bsonType: "string" },
                area: { bsonType: "string" }
            }
        }
    }
})

db.createCollection("tasks",{
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "description", "startDate", "endDate", "status", "priority", "responsables"],
            properties: {
                name:{bsonType:"string"},
                description:{bsonType:"string"},
                startDate:{bsonType:"date"},
                endDate:{bsonType:"date"},
                status:{bsonType:"string"},
                priority:{bsonType:"string"},
                responsables:
                {bsonType:"array",
                items:{
                    bsonType: "object",
                    required: ["name", "email", "position", "area"],
                    properties: {
                        name: { bsonType: "string" },
                        email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
                        position: { bsonType: "string" },
                        area: { bsonType: "string" }
                }
            }
            },
            }
        }
    }
})


db.createCollection("workSpace",{
    validator:{
        $jsonSchema:{
            bsonType:"object",
            required:["name","description","workGroup","tasks"],
            properties:{
                name: { bsonType: "string" },
                description: { bsonType: "string" },
                workGroup: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["name", "email", "position", "area"],
                        properties: {
                            name: { bsonType: "string" },
                            email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
                            position: { bsonType: "string" },
                            area: { bsonType: "string" }
                        }
                    }
                },
                tasks: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["name", "description", "startDate", "endDate", "status", "priority", "responsables"],
                        properties: {
                            name:{bsonType:"string"},
                            description:{bsonType:"string"},
                            startDate:{bsonType:"date"},
                            endDate:{bsonType:"date"},
                            status:{bsonType:"string"},
                            priority:{bsonType:"string"},
                            responsables:{bsonType:"array"}
                        }
                    }
                }
            }
        }
    }
});



