class users{
    constructor(name,email,position,area){
        this.name = name;
        this.email = email;
        this.position = position;
        this.area  = area
    }
    methodToString() {
        return `Name: ${this.name}, Email: ${this.email}, Position: ${this.position}, Area: ${this.area}`;
    }

}
class tasks{
    constructor(name,description,startDate,endDate,status,priority,responsables){
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.priority = priority;
        this.responsables = responsables; 
    }
    methodToString() {
        return `Name: ${this.name}, Description: ${this.description}, Start Date: ${this.startDate}, End Date: ${this.endDate}, Status: ${this.status}, Priority: ${this.priority}, Responsables: ${this.responsables.map(user => user.methodToString()).join(', ')}`;
    }
}

class workSpaces{
    constructor(name,description,workGroup,tasks){
        this.name = name;
        this.description = description;
        this.workGroup = workGroup; 
        this.tasks = tasks; 
    }
    methodToString() {
        return `Name: ${this.name}, Description: ${this.description}, Work Group: ${this.workGroup.map(user => user.methodToString()).join(', ')}, Tasks: ${this.tasks.map(task => task.methodToString()).join('; ')}`;
    }
}

class factory{
    static createUser(name, email, position, area) {
        return new users(name, email, position, area);
    }

    static createTask(name, description, startDate, endDate, status, priority, responsables) {
        return new tasks(name, description, startDate, endDate, status, priority, responsables);
    }

    static createWorkSpace(name, description, workGroup, tasks) {
        return new workSpaces(name, description, workGroup, tasks);
    }
}

module.exports = factory;
