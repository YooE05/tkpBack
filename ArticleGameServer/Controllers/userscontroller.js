const bcrypt = require('bcrypt')
const SchUserPersonalData = require('../Models/Schemas/schuserpersonaldata')
const SchUserCreds = require('../Models/Schemas/schusercreditionals')

const Utils = require('../utils')

const InitUserData = require('../Models/Contracts/inituserdata')
const UserCreds = require('../Models/Contracts/usercreditionals')
const UserRegisterData = require('../Models/Contracts/userregistrationdata')
const UserProgress = require('../Models/Contracts/userprogress')

//createUser - передать данные потенциально нового игрока

const CreateUser = async (req, res) => {

    let regData = new UserRegisterData(new UserCreds(req.body.username, req.body.password),
                                        req.body.name,
                                        req.body.surname)

    const hashedPassword = await bcrypt.hash(regData.userCreds.password, 10)
    const schUserCreds = new SchUserCreds({ username: regData.userCreds.username, password: hashedPassword })

    schUserCreds.save().then(async() => {

        let strDate = new Utils().TransferSecondsToString(new Date())

        const schUserPersonal = new SchUserPersonalData({
            username: regData.userCreds.username,
            name: regData.name,
            surname:  regData.surname,
            points: 0,
            crntlvl: 0,
            date: strDate
        })

        schUserPersonal.save().catch(async (error) => {
            console.error(error)
            await deletUserByUsername(regData.userCreds.username)
            res.status(500).send("Error creating user")
          })
        
          res.status(200).send("User successfully created")

    }).catch(async (error) => {
        console.error(error)
        res.status(500).send("Error while creating user")
      })

}

//authUser+getUserData - передать логин пароль-> получить данные юзера
const authUser = async (req, res) => {
    // await UserAuthData.findOne({ username: req.body.username })
    //     .then(async (userA) => {
    //         if (await bcrypt.compare(req.body.password, userA.password)) {

    //             console.log("Password is Correct")
    //             await UserPersonalData.findOne({ username: req.body.username })
    //                 .then(async (userPersonal) => {
    //                     await UserProgressData.findOne({ username: req.body.username }).then((userPr) => {
    //                         let initUserData =
    //                         {
    //                             name: userPersonal.name,
    //                             surname: userPersonal.surname,
    //                             crntlvl: userPr.crntlvl
    //                         }
    //                         console.log("We send data back yooohooo")
    //                         res.status(200).send(initUserData);
    //                     })
    //                 })
    //         }
    //         else {
    //             console.log("2222222222222222222222")
    //             res.status(400).send('NotAllowed')
    //         }

    //     })
    //     .catch(() => {
    //         return res.status(400).send('Cannot find user')
    //     })

   // let initUserData = InitUserData(userPersonal.name,userPersonal.surname,userPr.crntlvl )
   let initUserData = new InitUserData("ksush", "karapats", "0" )

    res.status(200).send(initUserData);

}

//updateUserPersonalData - передать логин, пароль и новые данные, обновить, если совпал пароль
const updatePersonalData = async (req, res) => {
    // await UserAuthData.findOne({ username: req.body.username })
    //     .then(async (userA) => {
    //         if (await bcrypt.compare(req.body.password, userA.password)) {

    //             console.log("Password is Correct")
    //             await UserPersonalData.findOne({ username: req.body.username })
    //                 .then(async (userPersonal) => {
    //                     userPersonal.name = req.body.newName
    //                     userPersonal.surname = req.body.newSurname

    //                     userPersonal.save()
    //                         .then(() => {
    //                             res.status(200).send("Personal data was updated");
    //                         })
    //                         .catch(() => {
    //                             return res.status(400).send(`Data wasn't updated : ${error}`)
    //                         })
    //                 })
    //         }
    //         else {

    //             res.status(400).send(`Data wasn't updated : ${error}`)
    //         }

    //     })
    //     .catch(() => {
    //         return res.status(400).send('Cannot find user')
    //     })
    res.status(200).send("Personal data was updated");

}
//updatePassword - передать логин, пароль и новый пароль, обновить, если совпал пароль
const updatePassword = async (req, res) => {
    // await UserAuthData.findOne({ username: req.body.username })
    //     .then(async (userA) => {
    //         if (await bcrypt.compare(req.body.password, userA.password)) {
                
    //             userA.password = req.body.newPassword
    //             userA.save()
    //             .then(() => {
    //                 res.status(200).send("Password was updated");
    //             })
    //             .catch(() => {
    //                 return res.status(400).send(`Password wasn't updated : ${error}`)
    //             })
    //         }
    //         else {

    //             res.status(400).send(`Data wasn't updated : ${error}`)
    //         }

    //     })
    //     .catch(() => {
    //         return res.status(400).send('Cannot find user')
    //     })
    res.status(200).send("Password was updated");

}

//getLeaderboard - передать логин -> получить топ 10 и место текущего игрока

//updateUserProgress - передать логин и добавленные очки -> x

async function deletUserByUsername(delusername) {
    await SchUserCreds.deleteMany({ username: delusername })
    await SchUserPersonalData.deleteMany({ username: delusername })
}

const deleteAllUsers = async (req, res) => {
    await SchUserCreds.deleteMany({})
    await SchUserPersonalData.deleteMany({})
}

const addUser = (req, res) => {

    const user = new User({ name: req.body.name, password: req.body.password, points: 0, age: req.body.age })
    user.save().then((error, userData) => {

        if (error) {
            res.send(error)
        }

        res.json(userData)
    });
}

const getAllUsers = (req, res) => {

    User.find().then((error, usersData) => {

        if (error) {
            res.send(error)
        }

        res.json(usersData)
    });
}



module.exports = {
    authUser,
    updatePassword,
    updatePersonalData,
    deleteAllUsers,
    createUser: CreateUser,
    addUser,
    getAllUsers
}