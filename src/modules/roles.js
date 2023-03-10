const { roles, languages, defaultLanguage } = require("../constants");

module.exports = {
  getLanguageRole(memberRoles) {
    let role = defaultLanguage;

    for(const roleName of languages) {
      if (memberRoles.cache.get(roles[roleName])) {
        role = roleName;
      }
    }

    return role;
  }
}