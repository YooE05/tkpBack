class InitUserData {
    constructor(accessToken, name, surname, crntLvl)
    {
        this.accessToken = accessToken;
        this.name = name;
        this.surname=surname;
        this.crntLvl=crntLvl;
    }
}

module.exports = InitUserData;