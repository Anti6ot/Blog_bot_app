const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')
const initDatabase = require('./startUp/initDatabase')
const routes = require('./routes')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api', routes)

const PORT = config.get('port') ?? 8080


if(process.env.NODE_ENV === 'development'){
    app.get('/',(req, res) => {
        res.send('hello')
    });
}

async function start(){

    try{
        mongoose.connection.once('open', () => {
        initDatabase()
        })
        await mongoose.connect(config.get('mongoUri')) // connect db mongo if connect after start next string 23
        console.log(chalk.bgGreen(`Mongodb connected...`))
        app.listen(PORT, ()=> {
            console.log(chalk.bgGreen(`Server has been started on port ${PORT}`));
        })
    }catch (e){
        console.log(chalk.redBright(e.message))
        process.exit(1)
    }
}
start()

