'use strict';

function minimumPermissionLevel(roles) {

    return function(req, res, next) {
        if (roles.indexOf(req.jwt.role) > -1) {

            if(req.method === 'PUT'){
                if(req.jwt.role === 'user' && req.jwt.id !== req.params.id){
                    return res.status(403).send({ auth: true, message: 'Invalid permission to access.' });
                }
            }
            
            return next();
            
        } else {
            return res.status(403).send({ auth: true, message: 'Invalid permission to access.' });
        }
    }
}

module.exports = minimumPermissionLevel;