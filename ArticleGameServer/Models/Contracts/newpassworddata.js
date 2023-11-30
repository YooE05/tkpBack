const UserCreds = require('./UserCreditionals')


class NewPasswordData {
    constructor(userCreds, newPassword)
    {
        this.userCreds =userCreds;
        this.newPassword=newPassword;
    }
}

module.exports = NewPasswordData;