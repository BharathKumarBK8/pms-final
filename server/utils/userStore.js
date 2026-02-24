const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "../users.json");

function readUsers() {
  if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, "[]");
  return JSON.parse(fs.readFileSync(usersFile));
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function findUserById(id) {
  return readUsers().find((u) => u.id === id);
}

function findUserByEmail(email) {
  return readUsers().find((u) => u.email === email);
}

module.exports = {
  readUsers,
  writeUsers,
  findUserById,
  findUserByEmail,
};
