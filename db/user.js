const db = require('./db');

async function findUserByEmail (email) {
  return db('users')
    .select('*')
    .where({
      'email': email
    })
    .first();
}

async function findUserByEmailAndPassword (email, password) {
  return db('users')
    .select('*')
    .where({
      'email': email,
      'password': password
    })
    .first();
}

async function register (email, password) {
  if (await findUserByEmail(email)) {
    return 'User already exists';
  }
  await db('users').insert({ email, password });
}

async function updateUser ({ email, firstName, lastName, dob, address }) {
  await db('users')
    .where({
      email: email
    })
    .update({
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      address: address
    });
}

module.exports = {
  findUserByEmail,
  findUserByEmailAndPassword,
  register,
  updateUser
}
