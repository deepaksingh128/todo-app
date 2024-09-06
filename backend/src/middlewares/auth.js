const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    const payload = req.headers.authorization;
    const words = payload.split(' ');
    const token = words[1];

    if(!token) {
        return res.status(401).json({msg: "Authntication failed!"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({msg: "Invalid token"});
    }
}

module.exports = { authenticate };