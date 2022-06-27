require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT;

app.use(express.urlencoded({ 
    extended: false 
    }))

app.set('view engine', 'ejs')
app.use(express.json())

app.get('/', (req, res) =>{
    res.render("index")
})

const corsCheck = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  };

app.post('/send',corsCheck, (req, res) =>{
    const { phone_number } = req.body;

    if(!phone_number){
        res.send("phone number is required")
    }

    res.status(301).redirect(`https://api.whatsapp.com/send/?phone=%2B234${phone_number}&text&app_absent=0`)
    // console.log(phone_number)
})

app.listen(PORT, () =>{
    console.log(`server is started at ${PORT}`)
})