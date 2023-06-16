const {
  handleAuthApi
} = require("./controller");

const {
  validateAccess,
  scopes
} = require("./utils");

module.exports = {
  handleAuthApi,
  validateAccess,
  scopes
}