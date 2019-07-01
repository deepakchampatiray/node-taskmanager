const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async function(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});

        //console.log(token, decoded, user);
        if(!user)
            throw new Error();
        
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        res.status(401).send('Unauthenticated user');
    }
}

module.exports = auth;