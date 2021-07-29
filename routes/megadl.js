const auth     = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const router   = express.Router();

router.post('/megadl', adminAuth, async (req, res) => {
  console.log(req.body);
  const command = await exect('command to exec');
  console.log(command);
});