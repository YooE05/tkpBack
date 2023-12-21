const { servTrySaveCreds,
    servTrySavePersonal} = require('../Services/useraccountservice')



const bcrypt = require('bcrypt')

const SchUserPersonalData = require('../Models/Schemas/schuserpersonaldata')
const SchUserCreds = require('../Models/Schemas/schusercreditionals')

const FormatUtils = require('../formatutils')
const {getNewAccessToken} = require('../jwtutils')


const InitUserData = require('../Models/Contracts/inituserdata')
const UserCreds = require('../Models/Contracts/usercreditionals')
const UserPersonal = require('../Models/Contracts/userpersonaldata')
const UserRegisterData = require('../Models/Contracts/userregistrationdata')


const createUser = async (req, res) => {

    let regData = new UserRegisterData(new UserCreds(req.body.username, req.body.password),
                                       new UserPersonal(req.body.name, req.body.surname))

    var letters = /^[A-Za-z]+$/;

    if(regData.userCreds.username.length==0||regData.userCreds.password.length==0||regData.userPersonal.name.length==0||regData.userPersonal.surname.length==0)
    { 
        res.status(400).send("Cant have empty fields") 
    }
    else if(!regData.userPersonal.name.match(letters)||!regData.userPersonal.surname.match(letters))
    {
        res.status(401).send("Name or Surname must have alphabet characters only")

    } else if(regData.userCreds.password.length<6)
    { 
        res.status(402).send("Password is too short") 
    }
    else
    {
        await servTrySaveCreds(regData).then(async() => {
            await  servTrySavePersonal(regData).then(async() => {   

                res.status(200).send("User was created")

            }).catch(async (error) => {

                console.error(error)
                await deletUserByUsername(regData.userCreds.username)
                res.status(500).send("Error while creating user personals")

            })
    
        }).catch(async (error) => {
            console.error(error)
            res.status(404).send("Error while creating user creds")
        })
    }
}

const authUser = async (req, res) => {

    let creds = new UserCreds(req.body.username, req.body.password)

    if(creds.password.lenth<6)
    { 
        res.status(401).send("Password is too short") 
    }

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

    var letters = /^[A-Za-z]+$/;
    if(!newPersonalData.name.match(letters)||!newPersonalData.surname.match(letters))
    {
        res.status(400).send("Name or Surname must have alphabet characters only")
    }
    else
    {
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
}

const updatePassword = async (req, res) => {

    if(req.body.newPassword.length<6)
    { 
        res.status(401).send("Password is too short") 
    }
    else
    {
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
}

const deleteAccount = async (req, res) => {
    await SchUserCreds.deleteMany({ username: req.body.username })
    await SchUserPersonalData.deleteMany({ username: req.body.username })
    res.status(200).send("User deleted");
}


//dev functions

const deleteAllUsers = async (req, res) => {
    await SchUserCreds.deleteMany({})
    await SchUserPersonalData.deleteMany({})
}

async function deletUserByUsername(delusername) {
    await SchUserCreds.deleteMany({ username: delusername })
    await SchUserPersonalData.deleteMany({ username: delusername })
}


module.exports = {
    createUser,
    authUser,
    deleteAccount,
    updatePassword,
    updatePersonalData,

    deleteAllUsers
}