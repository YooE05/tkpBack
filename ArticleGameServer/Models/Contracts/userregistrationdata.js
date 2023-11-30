const UserCreds = require('./UserCreditionals')

class UserRegistrationData {
    constructor(userCreds, name, surname)
    {
        this.userCreds = userCreds;
        this.name=name;
        this.surname=surname;
    }
}

module.exports = UserRegistrationData;