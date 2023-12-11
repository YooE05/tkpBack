
class FormatUtils
{
    FormatSecondsToString(date)
        {
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        } 
        
    FormatStringToSeconds(date)
        {
           let convertdate = new Date(date)
           
            return convertdate
        }
}

module.exports =  FormatUtils;