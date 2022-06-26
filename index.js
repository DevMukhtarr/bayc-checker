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
app.get('/', (req, res) =>{
    res.send("send whatsapp messages without saving number")
})

app.post('/send', async (req, res) =>{
    const { phone_number } = await req.body;

    if(!phone_number){
        res.send("phone number is required")
    }

    res.status(301).redirect(`https://api.whatsapp.com/send/?phone=%2B234${phone_number}&text&app_absent=0`)
})

app.listen(PORT, () =>{
    console.log(`server is started at ${PORT}`)
})