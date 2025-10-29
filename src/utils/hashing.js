const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);
  return { passwordHash, salt };
}

async function comparePasswords(password, hash, salt) {
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePasswords };