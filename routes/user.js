const express  = require('express');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcrypt');
// const withAuth = require('../middleware/withAuth');
// const adminAuth = require('../middleware/adminAuth');
const User     = require('../db/userModel');
const auth     = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const router   = express.Router();
const token_secret = process.env.TOKEN_SECRET;

/**
 * /api/checkToken
 * Checks if the current token is valid.
 * Used for protecting React Routes.
 */
router.get('/checkToken', auth, (req, res) => {
  res.json({auth: true, loggedIn: true});
});

router.get('/checkAdminAuth', adminAuth, (req, res) => {
  res.json({auth: true});
});

// router.get('/myAccount', withAuth, async (req, res) => {
//   const user = await User.findOne({email: req.email}).select(["-password", "-role", "-confirmed"]);
//   res.json({auth: true, user});
// });

router.post('/updateAccountInformation', async (req, res) => {
  const {username, password} = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    let p = await bcrypt.hash(password, salt);
    await User.findOneAndUpdate({username: username}, {password: p, confirmed: true, });
    res.json({auth: true});
  } catch (err) {
    res.json({auth: false, error: err});
  }
});

router.post('/checkUsername', async (req, res) => {
  const {username} = req.body;
  try {
    let doc = await User.findOne({username});
    if (doc) {
      res.json({found: true, confirmed: doc.confirmed});
    } else {
      res.json({found: false});
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
})

/**
 * /api/logout
 * Deletes the httpOnly cookie for the browser to
 * log out the user
 */
// router.post('/logout', withAuth, (req, res) => {
//   try {
//     res.clearCookie('token');
//     res.json({loggedOut: true, message: "Logged Out."});
//   } catch (err) {
//     res.json({message: 'Issue Logging Out', error: err.toString()});
//   }
// });

/**
 * /api/authenticate
 * Checks login credentials
 * Grants a token on successful login
 */
router.post('/authenticate', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) throw new Error("No user is found!");

    user.isCorrectPassword(password, (err, same) => {
      if (err) return res.sendStatus(500);
      if (!same) return res.sendStatus(401);

      let payload = { username };
      let token = jwt.sign(payload, token_secret, {expiresIn: '2h'});
      res.cookie('token', token, { httpOnly: true, sameSite: false, secure: true});
      res.json({auth: true, message: "Logged In"});
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;