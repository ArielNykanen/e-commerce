const path = require('path');
const  spawn  =  require('child_process').spawnSync;
const spawnOptions = { stdio: 'inherit' };
(async () => {
  // Our database URL
  const url = 'mysql://root@localhost:3306/node_shop'
  try {
    // Migrate the DB
    await spawn('./node_modules/.bin/sequelize', ['db:migrate', `--url=${url}`], spawnOptions);
    console.log('*************************');
    console.log('Migration successful');
  } catch (err) {
    // Oh no!
    console.log('*************************');
    console.log('Migration failed. Error:', err.message);
    process.exit(1);
  }
  process.exit(0);
})();