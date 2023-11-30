
class Utils
{
    TransferSecondsToString(date)
        {
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        } 
}

module.exports =  Utils;