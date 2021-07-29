const {promisify} = require('util');
const exec = promisify(require('child_process').exec);

async function test() {
  const test = await exec('');
  console.log(test.stdout);
}

test();