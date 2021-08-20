const express=require('express')
const app=express()
const mongoose=require('mongoose');
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient
var db;
var string;
let date=new Date().toString()
MongoClient.connect('mongodb://localhost:27017',{ useUnifiedTopology: true},(err,database)=>{
    if(err) return console.log(err)
    db=database.db('covid19')
    app.listen(1000,()=>{
        console.log("Listening to port #1000")
    })
})
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