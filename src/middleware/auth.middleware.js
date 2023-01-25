// Middleware d'authentification :
/* Récupération du header bearer */
const jwt = require("jsonwebtoken");


const AuthMiddleware = {
    SECRET: "key",

    extractBearerToken: function (headerValue){
        if (typeof headerValue !== 'string') {
            return false;
        }
        const matches = headerValue.match(/(bearer)\s+(\S+)/i);
        return matches && matches[2];
    },

    // Check si le JWT Token est valide ou pas
    checkTokenMiddleware: function(req, res, next){
        // Récupération du token de la requete
        const token = req.headers.authorization && AuthMiddleware.extractBearerToken(req.headers.authorization);
        // Présence d'un token
        if (!token) {
            return res.status(401).json({ message: 'Error. Need a token' });
        }
        // Vérification du token :
        jwt.verify(token, AuthMiddleware.SECRET, (err, decodedToken) => {
            if (err) {
                res.status(401).json({message: 'Error. Bad token'});
            } else {
                return next();
            }
        });
    },

    // Check si l'utilisateur est un admin et si il a le droit d'exécuter certaines actions :
    checkIsAdminMiddleware: function (req, res, next){
        // Récupération du token de la requete
        const token = req.headers.authorization && AuthMiddleware.extractBearerToken(req.headers.authorization);
        // Présence d'un token
        if (!token) {
            return res.status(401).json({ message: 'Error. Need a token' });
        }
        // Vérification du token :
        let decoded = jwt.verify(token, AuthMiddleware.SECRET, (err, decodedToken) => {
            if (err) {
                res.status(401).json({message: 'Error. Bad token'});
            } else {
                if(decodedToken.isAdmin === true){
                    return next();
                } else {
                    res.status(403).json({message: 'Vous devez etre administrateur pour effectuer cette action '});
                }
            }
        });
    }


}
module.exports = AuthMiddleware;