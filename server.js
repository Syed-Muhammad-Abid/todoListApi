const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const engines = require('consolidate');
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/simplemean';

//const port = 8000;

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('html',engines.nunjucks);
app.set('view engine','html');
app.set('views',__dirname+'/views');

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render("error_template", { error: err});
}

MongoClient.connect(process.env.MONGODB_URI || url,function(err, db){
    assert.equal(null, err);
    console.log('Successfully connected to MongoDB.');

    var records_collection = db.collection('records');
    console.log(records_collection);
    app.get('/records', function(req, res, next) {
        // console.log("Received get /records request");
        records_collection.find({}).toArray(function(err, records){
            if(err) throw err;

            if(records.length < 1) {
                console.log("No records found.");
            }

            // console.log(records);
            res.json(records);
        });
    });

    app.post('/records', function(req, res, next){
        console.log(req.body);
        records_collection.insert(req.body, function(err, doc) {
            if(err) throw err;
            console.log(doc);
            res.json(doc);
        });
    });

    app.get('/records/:id',function(req,res,next){

        var id = req.params.id;
        console.log("Get One :"+id);
        records_collection.findOne({},function(err,result){
            if(err) throw err;
            console.log(result);
            res.json(result);
        });
    });
    app.delete('/records/:id', function(req, res, next){
        var id = req.params.id;
        console.log("delete " + id);
        records_collection.deleteOne({'_id': new ObjectId(id)}, function(err, results){
            console.log(results);
            res.json(results);
        });
    });

    app.put('/records/:id', function(req, res, next){
        var id = req.params.id;
        records_collection.updateOne(
            {'_id': new ObjectId(id)},
            { $set: {
                'name' : req.body.name,
                'sku': req.body.sku,
                'description': req.body.description,
                'price': req.body.price
                }
            }, function(err, results){
                console.log(results);
                res.json(results);
        });
    });

    app.use(errorHandler);
    var server = app.listen(process.env.PORT || 3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    })
})

// MongoClient.connect(db.url, (err, database) => {
//   if (err) return console.log(err)
//   require('./app/routes')(app, database);
//   app.listen(port, () => {
//     console.log('We are live on ' + port);
//   });               
// })

// app.get('/', (req, res) => {
//     res.sendFile(__dirname+'/index.html');
// });

// app.post('/add',(req,res)=>{
//   console.log(req.body);
// });

// app.listen(port, function () {
//   console.log('listening on '+port);
// });