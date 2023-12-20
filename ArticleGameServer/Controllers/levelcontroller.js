const { servGetLevelTasks, servGetLevelSettings, servGetPersonalData  } = require('../Services/levelservice')


const getLevelData = async (req, res) => {

    //проверить валидность входящих данных

    await servGetPersonalData(req.body.username).then(async (personData) => 
    { 
        await servGetLevelSettings(personData.crntLvl).then(async (levelSettings) => 
        {
            await servGetLevelTasks(levelSettings, req.body.maxTasksInRoom).then(async (tasksForGame) => 
            { 
            
                res.status(200).send(JSON.stringify(tasksForGame)); 
            })
            .catch(() => {
                res.status(400).send('Cant generate level tasks')
            })
           })
        .catch(() => {
            res.status(401).send('Cant get levelSettings')
        })
    })
    .catch(() => {
        res.status(404).send('Cant find user')
    })

}



module.exports = {
    getLevelData
}
