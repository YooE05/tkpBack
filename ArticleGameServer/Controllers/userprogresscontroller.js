// const SchUserPersonalData = require('../Models/Schemas/schuserpersonaldata')

// const FormatUtils = require('../formatutils')
// const LeaderBoardUser = require('../Models/Contracts/leaderboarduser')
// const UserProgress = require('../Models/Contracts/userprogress')

const {   servGetProgressData,
    servUpdateProgress,
    servGenerateLeaderboard,
    servGetTop10,
    servGetPersonalDatas } = require('../Services/userprogressservice')


const updateProgress = async (req, res) => {
    
    await servGetProgressData(req.body.username).then(async (progressData) => 
        {
            await servUpdateProgress(progressData, req).then(() => {
                    res.status(200).send("Progress data was updated");
            })
            .catch((error) => {
                return res.status(401).send(`Progress wasn't updated : ${error}`)
            })
        })  
    .catch(() => {
        return res.status(404).send(`Can't find user`)
    })
}

const getLeaders = async (req, res) => {

   
    await servGetPersonalDatas().then(async (userPersonalAll) => 
    {          
        await servGetTop10().then(async (userPersonalTop) => 
        {
            await servGenerateLeaderboard(req.body.username, userPersonalAll, userPersonalTop).then(async (leaderboard) => 
            {
                res.status(200).send(leaderboard);
            })
            .catch(() => {
              res.status(401).send('Cant generate leaderboard')
            })
        })
        .catch(() => {
          res.status(402).send('Error while getting top10')
        })
    })
    .catch(() => {
        res.status(403).send('Error while getting all personal data')
    })


}


//dev functions



module.exports = {
    updateProgress,
    getLeaders
}