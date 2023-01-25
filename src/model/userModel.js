// User model,
// Contain the model of the user :

class UserModel {
    constructor(pseudo, password, name, surname, idAvatar) {
        this._id = undefined;
        this.pseudo = pseudo;
        // TODO : Encrypter le mot de passe :)
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.idAvatar = idAvatar;
        // Is admin is false, you can't create another admin
        this.isAdmin = false;
    }
}

module.exports = UserModel;