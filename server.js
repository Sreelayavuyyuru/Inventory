require('dotenv').config()
const express=require('express')
const app=express()
const mongoose=require('mongoose');
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient
var db;
var string;
let date=new Date().toString();
const url = "mongodb+srv://sreelaya:mongodbpassword@inventory.jygib.mongodb.net/covid19?retryWrites=true&w=majority";

// MongoClient.connect(url,connectionParams)
//     .then( () => {
//         console.log('Connected to database ')
//     })
//     .catch( (err) => {
//         console.error(`Error connecting to the database. \n${err}`);
// })

MongoClient.connect(url,{ useUnifiedTopology: true},(err,database)=>{
    if(err) return console.log(err)
    db=database.db('covid19')
})

const port = process.env.PORT || 1000;
app.listen(port);

// app.listen(1000,()=>{
//     console.log("Listening to port #1000")
// })

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    db.collection('beds').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('beds.ejs',{data:result})
    })
})

app.get('/oxygen',(req,res)=>{
    db.collection('oxygen').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('oxygen.ejs',{data:result})
    })
})

app.get('/create_beds',(req,res)=>{
    res.render('addbeds.ejs')
})
app.get('/create_oxygen',(req,res)=>{
    res.render('addoxygen.ejs')
})
app.post('/add_bdata',(req,res)=>{
    db.collection('beds').save(req.body,(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})
app.post('/add_odata',(req,res)=>{
    db.collection('oxygen').save(req.body,(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/oxygen')
    })
})
app.get('/delete-details',(req,res)=>{
    let id = req.query.id;
    console.log(id);

    db.collection('beds').deleteOne( { "_id" : mongoose.Types.ObjectId(id) } );

    return res.redirect('back');
})

app.get('/delete-odetails',(req,res)=>{
    let id = req.query.id;
    console.log(id);

    db.collection('oxygen').deleteOne( { "_id" : mongoose.Types.ObjectId(id) } );

    return res.redirect('back');
})