// Architecture model :
// Class that contain the model of the architecture (Intel, Amd, rsbpi...)

class ArchitectureModel {
    constructor(name, id=undefined) {
        this._id = id;
        this.name = name;
    }

}

module.exports = ArchitectureModel;
