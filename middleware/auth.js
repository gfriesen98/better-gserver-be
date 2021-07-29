const jwt = require('jsonwebtoken');
const token_secret = process.env.TOKEN_SECRET;

const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.json({auth: false, message: 'Unauthorized: No token provided.'});
  } else {
    jwt.verify(token, token_secret, (err, decoded) => {
      if (err) {
        res.json({auth: false, message: 'Invalid Token.'});
      } else {
        req.username = decoded.username;
        next();
      }
    })
  }
}

module.exports = auth;