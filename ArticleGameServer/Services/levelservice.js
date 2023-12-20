const SchUserPersonalData = require('../Models/Schemas/schuserpersonaldata')
const SchTask = require('../Models/Schemas/schtask')
const SchLevelSettings = require('../Models/Schemas/schlevelsettings')

const ArticleTask = require('../Models/Contracts/articletask')

const servGetPersonalData = async (enterUsername)=> {

    //из базы берутся все пользователи, найти способ брать индекс пришедшего массива элементов
    return await SchUserPersonalData.findOne({username: enterUsername});
}

const servGetLevelSettings = async (crntLvl) =>{

    //из базы берутся все пользователи, найти способ брать индекс пришедшего массива элементов


        const levelNumber = crntLvl;

        if(levelNumber>9){levelNumber=9}
        return await SchLevelSettings.findOne({levelNum: levelNumber})
}

const servGenerateLevelTasks = async (levelSettings, maxTasks) =>{

            const maxTasksInRoom = maxTasks; 

            return await loadAllTasks(levelSettings.easyTasksCnt, levelSettings.mediumTasksCnt, levelSettings.hardTasksCnt, maxTasksInRoom)
        }


async function loadAllTasks(easyCnt, mediumCnt, hardCnt, tasksInRoom)
 {
    let tasksForGame = []

    // let easyTasks = []
    // let mediumTasks = []
    // let hardTasks = []



    let easyTasks = await loadLevelTasks(easyCnt, "easy", tasksInRoom)
    let mediumTasks = await loadLevelTasks(mediumCnt,"medium", tasksInRoom)
    let hardTasks = await loadLevelTasks(hardCnt,"hard", tasksInRoom)

    // let kEasy= easyTasks.length/tasksInRoom;
    // let kMedium= mediumTasks.length/tasksInRoom;
    // let kHard= hardTasks.length/tasksInRoom;

    let kEasy= easyCnt
    let kMedium= mediumCnt
    let kHard= hardCnt

    for(let j=0;j<tasksInRoom;j++)
    {       
        Array.prototype.push.apply(tasksForGame, easyTasks.slice(j*kEasy, j*kEasy+kEasy))
        Array.prototype.push.apply(tasksForGame, mediumTasks.slice(j*kMedium, j*kMedium+kMedium))
        Array.prototype.push.apply(tasksForGame, hardTasks.slice(j*kHard, j*kHard+kHard))
    }
    
    return tasksForGame
 }

async function loadLevelTasks(countOfCrntTasks, crntDifficulty, maxCountOfTasks) 
{

    let tasks= []

        let countOfNeedTask = countOfCrntTasks * maxCountOfTasks;
                
        await SchTask.find({difficulty: crntDifficulty})
        .then(async (allTasks) => 
        {            
            let tmpAllTasks = allTasks

            let countOfAllTask = allTasks.length;

            let numbersOfTasks = []          
            for(let i=0;i<countOfAllTask;i++)
            {
                 numbersOfTasks.push(i);
            }

            for(let j=0;j<countOfNeedTask;j++)
            {
                    //брать случайное число от 0 до array.length
                    const ind = Math.floor(Math.random() * numbersOfTasks.length)
    
                    //извлекать из массива элемент array[n] в котором будет нужный номер задания и удалять его, если в базе заданий больше, чем требует функция
                    const taskNum = numbersOfTasks[ind];//извлекли случайный номер задания
     
                    numbersOfTasks.splice(ind, 1);//удалили элемент
                    if(numbersOfTasks.length==0)
                    {
                        for(let i=0;i<countOfAllTask;i++)
                        {
                             numbersOfTasks.push(i);
                        }
                    }
                    
                    let task = new ArticleTask( crntDifficulty,
                                                tmpAllTasks[taskNum].firstPhrase,
                                                tmpAllTasks[taskNum].phrases,
                                                tmpAllTasks[taskNum].articlesCount, 
                                                tmpAllTasks[taskNum].articles)
                          

                                                
                                                                                 
                    tasks.push(task)                 
            }  
            
        })

        return tasks

}



module.exports = {
    servGetLevelSettings, 
    servGetLevelTasks: servGenerateLevelTasks,
    servGetPersonalData
}