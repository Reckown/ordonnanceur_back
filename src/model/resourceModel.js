// Resource Model :

const ArchitectureModel = require('../model/architectureModel');

class ResourceModel{
    constructor(name, architecture, id=undefined) {
        this._id = id;
        this.name = name;
        this.architecture = new ArchitectureModel(architecture.name, architecture._id);
    }
}

module.exports = ResourceModel;