const { servSaveCreds, servCreateCreds, servCreatePersonal, servHashPassword,
    servSavePersonal, servGetUserCreds,
    servComparePassword,servGetUserPersonal,    } = require('../Services/useraccountservice')

const SchUserPersonalData = require('../Models/Schemas/schuserpersonaldata')
const SchUserCreds = require('../Models/Schemas/schusercreditionals')

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
        res.status(400).send("{\"code\": \"EmptyFields\", \"message\": \"Cant have empty fields\"}") 
    }
    else if(!regData.userPersonal.name.match(letters)||!regData.userPersonal.surname.match(letters))
    {
        res.status(400).send("{\"code\": \"IncorrectSymbol\", \"message\": \"Name or Surname must have alphabet characters only\"}") 
    } else if(regData.userCreds.password.length<6)
    { 
        res.status(400).send("{\"code\": \"ShortPassword\", \"message\": \"Password is too short\"}") 
    }
    else
    {
        await servCreateCreds(regData.userCreds).then(async() => {
            await  servCreatePersonal(regData).then(async() => {   

                res.status(200).send("User was created")

            }).catch(async (error) => {

                console.error(error)
                await deletUserByUsername(regData.userCreds.username)
                res.status(403).send("Error while creating user personals")

            })
    
        }).catch(async (error) => {
            console.error(error)
            res.status(404).send("Error while creating user creds")
        })
    }
}

const authUser = async (req, res) => {

    let creds = new UserCreds(req.body.username, req.body.password)

    if(creds.username.length==0||creds.password.length==0)
    { 
        res.status(400).send("{\"code\": \"EmptyFields\", \"message\": \"Cant have empty fields\"}") 
    }else
    if(creds.password.length<6)
    { 
        res.status(400).send("{\"code\": \"ShortPassword\", \"message\": \"Password is too short\"}") 
    }else
    {    
        servGetUserCreds(creds.username).then(async (user) => {
            console.log(creds.password+" Passwords "+ user.password);
            if (await servComparePassword(creds.password, user.password)) {

                console.log("Password is Correct")
                await servGetUserPersonal(creds.username).then((userPersonal) => {    
                    
                    const accessToken = getNewAccessToken(creds.username); 
                    let initUserData = new InitUserData(accessToken, userPersonal.name, userPersonal.surname, userPersonal.crntLvl )
                    res.status(200).send(initUserData);

                }).catch(() => {
                    return res.status(404).send('Can not find user')
                })
            }
            else {
                console.log("Wrong password")
                res.status(400).send("{\"code\": \"NotAllowed\", \"message\": \"Password is incorrect\"}") 
            }

    })
    .catch(() => {
        return res.status(404).send('Can not find user')
    })
    }
}

const updatePersonalData = async (req, res) => {

    let newPersonalData = new UserPersonal(req.body.name, req.body.surname)

    var letters = /^[A-Za-z]+$/;
    if(newPersonalData.name.length==0||newPersonalData.surname.length==0)
    { 
        res.status(400).send("{\"code\": \"EmptyFields\", \"message\": \"Cant have empty fields\"}") 
    }
    else if(!newPersonalData.name.match(letters)||!newPersonalData.surname.match(letters))
    {
        res.status(400).send("{\"code\": \"IncorrectSymbol\", \"message\": \"Name or Surname must have alphabet characters only\"}") 
    } else
    {
        await  servGetUserPersonal(req.body.username).then(async (userPersonal) => 
        {
            userPersonal.name =  newPersonalData.name
            userPersonal.surname = newPersonalData.surname 

            await servSavePersonal(userPersonal).then(() => {
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

    if(req.body.newPassword.length==0)
    { 
        res.status(400).send("{\"code\": \"EmptyFields\", \"message\": \"Cant have empty fields\"}") 
    }else
    if(req.body.newPassword.length<6)
    { 
        res.status(400).send("{\"code\": \"ShortPassword\", \"message\": \"Password is too short\"}") 
    }else
    {    
        await servGetUserCreds(req.body.username).then(async (user) => {
                  
            user.password = await servHashPassword(req.body.newPassword)

            await servSaveCreds(user).then(() => {
                res.status(200).send("Password was updated");
            })
            .catch((error) => {
                return res.status(400).send(`Password wasn't updated : ${error}`)
            })
        }).catch(() => {
            return res.status(400).send('Cannot find user')
        })
    }
}

const deleteAccount = async (req, res) => {
    
    if(await servDeleteAccount(req.body.username))
    {  
        res.status(200).send("User deleted");
    }
    else
    {
        res.status(400).send("User wasn't deleted");
    }
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