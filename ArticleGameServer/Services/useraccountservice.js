const bcrypt = require('bcrypt')

const SchUserPersonalData = require('../Models/Schemas/schuserpersonaldata')
const SchUserCreds = require('../Models/Schemas/schusercreditionals')

const FormatUtils = require('../formatutils')
const {getNewAccessToken} = require('../jwtutils')


const InitUserData = require('../Models/Contracts/inituserdata')
const UserCreds = require('../Models/Contracts/usercreditionals')
const UserPersonal = require('../Models/Contracts/userpersonaldata')
const UserRegisterData = require('../Models/Contracts/userregistrationdata')

const servTrySaveCreds = async (regData) => {

    const hashedPassword = await bcrypt.hash(regData.userCreds.password, 10)
    const schUserCreds = new SchUserCreds({ username: regData.userCreds.username, password: hashedPassword })

    return await schUserCreds.save() 
}

const servTrySavePersonal = async (regData) => {

        const schUserPersonal = new SchUserPersonalData({
            username: regData.userCreds.username,
            name: regData.userPersonal.name,
            surname:  regData.userPersonal.surname,
            points: 0,
            crntlvl: 0,
            timeStamp: Date.now()
        })

        return schUserPersonal.save()
}


const authUser = async (req, res) => {

    let creds = new UserCreds(req.body.username, req.body.password)
    await SchUserCreds.findOne({ username: creds.username })
        .then(async (userA) => {
            if (await bcrypt.compare(creds.password, userA.password)) {

                console.log("Password is Correct")
                await SchUserPersonalData.findOne({ username: creds.username })
                    .then((userPersonal) => {    
                        console.log(1)
                            const accessToken = getNewAccessToken(creds.username); 
                            let initUserData = new InitUserData(accessToken, userPersonal.name, userPersonal.surname, userPersonal.crntLvl )

                            console.log(accessToken)
                            res.status(200).send(initUserData);
                    })
            }
            else {
                console.log("Wrong password")
                res.status(400).send('NotAllowed')
            }

        })
        .catch(() => {
            return res.status(404).send('Can not find user')
        })

}

const updatePersonalData = async (req, res) => {

    let newPersonalData = new UserPersonal(req.body.name, req.body.surname)

    await SchUserPersonalData.findOne({ username: req.body.username })
        .then(async (userPersonal) => 
        {
            userPersonal.name =  newPersonalData.name
            userPersonal.surname = newPersonalData.surname 

            userPersonal.save()
                .then(() => {
                    res.status(200).send("Personal data was updated");
                })
                .catch(() => {
                    return res.status(401).send(`Data wasn't updated : ${error}`)
                })
                    })  
        .catch(() => {
            return res.status(404).send('Cannot find user')
        })
}

const updatePassword = async (req, res) => {

    await SchUserCreds.findOne({ username: req.body.username })
        .then(async (user) => {

                const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)
                user.password = hashedPassword

                user.save()
                .then(() => {
                    res.status(200).send("Password was updated");
                })
                .catch((error) => {
                    return res.status(400).send(`Password wasn't updated : ${error}`)
                })
        })
        .catch(() => {
            return res.status(400).send('Cannot find user')
        })
}

const deleteAccount = async (req, res) => {
    await SchUserCreds.deleteMany({ username: req.body.username })
    await SchUserPersonalData.deleteMany({ username: req.body.username })
    res.status(200).send("User deleted");
}


//dev functions

const deleteAllUsers = async () => {
    await SchUserCreds.deleteMany({})
    await SchUserPersonalData.deleteMany({})
}

async function deletUserByUsername(delusername) {
    await SchUserCreds.deleteMany({ username: delusername })
    await SchUserPersonalData.deleteMany({ username: delusername })
}


module.exports = {
    servTrySaveCreds,
    servTrySavePersonal,
    authUser,
    deleteAccount,
    updatePassword,
    updatePersonalData,

    deleteAllUsers
}