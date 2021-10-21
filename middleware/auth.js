const jwt = require('jsonwebtoken');

exports.signin = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.TOKEN);
        next();
    } catch {
        res.status(401).json({ error: 'Utilisateur Non Authentifié!' });
    }
};

exports.getUserID = (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    return userId;
}