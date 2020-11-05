const bcrypt = require('bcrypt')
const salting = 10


module.exports.hashPW = (plainPW) => {
  return bcrypt.hash(plainPW, salting)
}

module.exports.checkPW = (plainPW, hashedPW) => {
  return bcrypt.compare(plainPW, hashedPW)
}