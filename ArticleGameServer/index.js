const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./Routes/userroutes')

const mongoConnect = 'mongodb+srv://yooe05:jQFOmyX7yuYlUUbS@cluster0.1wcxsck.mongodb.net/?retryWrites=true&w=majority'
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(userRouter)

const con = mongoose.connect(mongoConnect)
    .then(() => { console.log("connect sucsess") })
    .catch((error) => {
        console.log(error)
    })


app.listen(PORT, () => {

    console.log('Server has been started..')
})






// const users = []

// app.get('/users', (req, res) => {
//     res.json(users)
// })

// app.post('/users', async (req, res) => {
//     try {

//         const hashedPassword = await bcrypt.hash(req.body.password, 10)

//         const user = { name: req.body.name, password: hashedPassword }

//         users.push(user)
        
//         res.status(201).send()

//     } catch {
//         res.status(500).send()
//     }

// })

// app.post('/users/login', async (req, res) => {

//     const user = users.find(user => user.name = req.body.name)

//     if (user === null) {
//         return res.status(400).send('Cannot find user')
//     }
//     else {
//         try {

//             if (await bcrypt.compare(req.body.password, user.password)) { res.send('Succsess') }
//             else { res.send('NotAllowed') }
//             res.status(201).send()

//         } catch {
//             res.status(500).send()
//         }
//     }
// })
