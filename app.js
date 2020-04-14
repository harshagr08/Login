const express = require('express')
const app = express()
const hbs = require('hbs')
const path = require('path')
const UserRouter = require('./routes/register')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const mongoose = require('mongoose')
const mongodbstore = require('connect-mongodb-session')(session)
const errorcontroller=require('./controller/error')

const port = process.env.PORT || 3000

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))


const publicdir = path.join(__dirname, 'public')

app.set('view engine', 'hbs')
app.set('views', publicdir)

const store = new mongodbstore({
    uri: 'mongodb://127.0.0.1/login',
    collection: 'sessions',

})

app.use(
    session({ secret: "My secret", resave: true, saveUninitialized: true, store:store })
)

app.use(flash())
app.use(UserRouter)
app.use(errorcontroller.geterror)

mongoose.connect("mongodb://127.0.0.1/login")
    .then(result =>{
        console.log('connected')
        app.listen(port)
    })
