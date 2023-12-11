const SchUserPersonalData = require('../Models/Schemas/schuserpersonaldata')

const FormatUtils = require('../formatutils')
const LeaderBoardUser = require('../Models/Contracts/leaderboarduser')
const UserProgress = require('../Models/Contracts/userprogress')


const updateProgress = async (req, res) => {

    let newPogressData = new UserProgress( req.body.points,
                                            req.body.crntLvl,
                                            req.body.timeStamp)    

    await SchUserPersonalData.findOne({ username: req.body.username })
        .then(async (progressData) => 
        {
            progressData.$inc('points', newPogressData.points)
            progressData.crntLvl = newPogressData.crntLvl 
            progressData.timeStamp = new FormatUtils().FormatStringToSeconds(newPogressData.timeStamp)

            progressData.save()
                .then(() => {
                    res.status(200).send("Progress data was updated");
                })
                .catch(() => {
                    return res.status(400).send(`Progress wasn't updated : ${error}`)
                })
                    })  
        .catch(() => {
            return res.status(400).send(`Progress wasn't updated`)
        })
}

const getLeaders = async (req, res) => {

    let leaderboard = []

    //из базы берутся все пользователи, найти способ брать индекс пришедшего массива элементов
    await SchUserPersonalData.find({}).sort({ points: -1,  timeStamp: 1})
    .then(async (userPersonal) => 
    {          for(let i=0;i<userPersonal.length;i++)
        {   
            if(userPersonal[i].username==req.body.username)
            {
            
                const newLeader = new LeaderBoardUser(userPersonal[i].name,  userPersonal[i].surname,  userPersonal[i].points, i)
                leaderboard.push(newLeader)

                i=userPersonal.length
            }      
        }   
    })

    await SchUserPersonalData.find({}).sort({ points: -1,  timeStamp: 1}).limit(10)
    .then(async (userPersonal) => 
    {
        for(let i=0;i<userPersonal.length;i++)
        {
            const newLeader = new LeaderBoardUser(userPersonal[i].name,  userPersonal[i].surname,  userPersonal[i].points, i)
            leaderboard.push(newLeader)
        }

        res.status(200).send(leaderboard);
    })
    .catch(() => {
      res.status(400).send('Error while getting leaderboard')
    })

}


//dev functions



module.exports = {
    updateProgress,
    getLeaders
}