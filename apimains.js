var express = require('express');
var api = express();
var port = process.env.PORT || 9300;
var bodyparser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient
var mongourl = "mongodb+srv://newuser13:newuser13@cluster0.bni3z.gcp.mongodb.net/project?retryWrites=true&w=majority"
var cors = require('cors');
var data;

api.use(cors());

api.use(bodyparser.urlencoded({extended:true}))
api.use(bodyparser.json())


// default route
api.get('/', (req,res) => {
    res.send("Api is working");
})

//city route
api.get('/city', (req,res) => {
    db.collection('city').find({}).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

//branch route
api.get('/branch', (req,res) => {
    db.collection('branch').find({}).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

//mainlist route
api.get('/mains', (req,res) => {
    var query = {}
    if(req.query.city && req.query.branch){
        query = {"city_name":req.query.city,"branch.branchtype":req.query.branch}
    }else{
        query = {}
    }
    db.collection('mainslist').find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

//CityName and StateName
api.get('/mainspage', (req,res) => {
    var query = {}
    if(req.query.state && req.query.city){
        query = {"state":req.query.state,"city_name":req.query.city}
    }else{
        query = {}
    }
    db.collection('mainslist').find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

//StateName and BranchName
api.get('/mainsbranch', (req,res) => {
    var query = {}
    if(req.query.state && req.query.bname){
        query = {"state":req.query.state,"branch.name":req.query.bname}
    }else{
        query = {}
    }
    db.collection('mainslist').find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

//Details according to _id
api.get('/mainsvalue/:value', (req,res) => {
    var query = {"_id":req.params.value,"branch.branchtype":req.query.value}
    db.collection('mainslist').find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

//details based on nirf ranking
api.get('/mainsrank', (req,res) => {
    var condition = {}
    if(req.query.lrank && req.query.hrank){
        condition = {"nirf":{$lt:Number(req.query.hrank),$gt:Number(req.query.lrank)}}
    }else{
        condition = {}
    }
    db.collection('mainslist').find(condition).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

//to place order
api.post('/placeorder', (req,res) => {
        console.log(req.body);
        db.collection('orders').insert(req.body, (err, result) => {
            if(err) throw err;
            res.send('posted')
        })
})

api.get('/orders', (req,res) => {
    db.collection('orders').find({}).toArray((err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

//to delete data
api.delete('/deleteorders', (req,res) => {
    var condition = {"_id":req.body.id}
    db.collection('orders').remove(condition, (err, result) => {
        if(err) throw err;
        res.send('Data is Deleted');
    })
})

//to update order
api.put('/updateorders', (req,res) => {
    db.collection('orders').update({"_id":req.body._id},
    {
        $set:{
            "name":req.body.name,
            "college":req.body.college
        }
    }, (err, result) => {
        if(err) throw err;
        res.send('Data is updated');
    })
})






// // //city list route with param
// api.get('/city/:value', (req,res) => {
//     var code = req.params.value;
//     if(citylist[code-1].city == code){
//         res.send(citylist[code-1].country_name);
//     }else{
//         res.send(`No such entry found for ${code}`);
//     }
// })

// // //branch list route
// api.get('/branch', (req,res) => {
//     res.send("This branch api is working")
// })


MongoClient.connect(mongourl, (err,connection) => {
    if(err) throw err;
    db = connection.db('project');
    api.listen(port, (err) => {
        if(err) throw err;
        console.log(`The Server is running at ${port}`)
    })
})
