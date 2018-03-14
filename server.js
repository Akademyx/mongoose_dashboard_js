var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require("path");

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, './views'));
app.use(express.static(__dirname + "/static"));
// app.use(express.static(path.join(__dirname, "./static")));
app.use(bodyParser.urlencoded({ extended: true }));


var dbURI = 'mongodb://localhost/mongooses'
mongoose.connect(dbURI);

// var UserSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     quote: { type: String, required: true }
// }, { timestamps: true })

var MongooseSchema = new mongoose.Schema({
    animal: {type: String, required: true},
    description: {type: String, required: true}
}, {timestamps:true})

const Animal = mongoose.model('animals', MongooseSchema);


app.get('/', function (request, response) {
    Animal.find({}, function(err, result){
        if(err){ console.log(err)}
        response.render('index', {animals:result})
    })
})
app.get('/mongooses/new', function(request, response) {
    response.render('form')
})

app.get('/mongooses/:id', function (request, response) {
    Animal.findOne({_id: request.params.id}, function(err, result){
        if(err){console.log(err)}
        console.log(result, "this is result object")
        response.render('one_mon', {type:result})
    })
})

app.get('/mongooses/edit/:id', function (request, response) {
    Animal.findOne({_id: request.params.id}, function(err, result){
        if(err){console.log(err)}
        response.render('edit', {type:result})
    })
})

app.post('/mongooses', function (req, res) {
    var animal = new Animal({animal: req.body.animal, description: req.body.description })
    animal.save(function (err, data) {
        if (err) { res.render('index', { errors: err.errors }) }
        res.redirect('/')
    })
})


app.post('/mongooses/:id', function(req, res){
    Animal.update({_id: req.params.id}, req.body, function(err, result){
        if(err){res.render('index', {errors: err.errors})}
        res.redirect(`/mongooses/${req.params.id}`)
    })
})

app.get('/mongooses/destroy/:id', function (req, res) {
    Animal.remove({_id:req.params.id},function(err, result){
        if (err) { res.render('index', { errors: user.errors }) }
        res.redirect('/')
    })
})



app.listen(8000, function () {
    console.log("Listening on port 8000, and then some...")
})