const UserCreds = require('./usercreditionals')
const UserPersonal = require('./userpersonaldata')

class UserRegistrationData {
    constructor(userCreds, userPersonal)
    {
        this.userCreds = userCreds;
        this.userPersonal = userPersonal;
    }
}

module.exports = UserRegistrationData;