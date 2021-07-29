const jwt = require('jsonwebtoken');
const User = require('../db/userModel');
const token_secret = process.env.TOKEN_SECRET;

const adminAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.json({auth: false, message: "Unauthorized User."});
  } else {
    jwt.verify(token, token_secret, async (err, decoded) => {
      if (err) {
        res.status(401).send('Unauthorized. Invalid token.');
      } else {
        const user = await User.findOne({username: decoded.username});
        if (user.role === 'user') {
          return res.status(401).send('Unauthorized User.');
        } else if (user.role === 'admin') {
          next();
        } else {
          return res.status(401).send('Unauthorized.');
        }
      }
    });
  }
}

module.exports = adminAuth;