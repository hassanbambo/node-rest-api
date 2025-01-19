const jwt = require('jsonwebtoken')
const JWT_SECRET = '123456'; // JWT SECRET KEY

const authenticationToken = function(req, res, next) {
    const token = req.header('Authentication')?.split(' ')[1];
    if(!token) return res.status(401).json({ message: 'Access Dennied! No Token Provided' })
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;    // Attach the user data to the request 
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or Expired Token' });
    }
}

module.exports = authenticationToken;