const express = require('express');
const app = express();
const path = require('path');

// const VIEWS = path.join(__dirname, 'views');

app.use(express.static(__dirname + '/staticfile'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Database set-up

const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/projekt';
const objectId = require('mongodb').ObjectId;

// Connectiong to mongo Database
MongoClient.connect(mongoURL, function(err, database){
  if(err){
    console.log(err);
    return;
  }
  else{
    console.log('Database connected successfully');
    projekt = database.collection('kontratat');
  }
});

const bodyParser = require('body-parser');
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes and Controllers

  // Index
  app.get('/', function(req, res){
    projekt.find().toArray(function(err, contracts){
      if(err){
        console.log(err);
      }
      res.render('index', {contracts : contracts});
    });
  });

  //Read ALL
  app.get('/show', function(req, res){
    projekt.find({}).toArray(function(err, contracts){
      if(err){
        console.log(err);
      }
      res.render('show', {contracts:contracts});
    });
  });

  // 2:Show just one clicked
app.get('/projekt/:id', function(req, res){
  const id = objectId(req.params.id);
  projekt.findOne({_id: id}, function(err, contracts){
    if(err){
      console.log(err);
    }
    res.render('show', {contracts: contracts});
  });
});

// 3: ADD
app.post('/projekt/add', function(req, res){
  projekt.insert(req.body, function(err, result){
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
});


// 4: Edit
app.get('/projekt/edit/:id', function(req, res){
  const id = objectId(req.params.id);

  projekt.findOne({_id: id}, function(err, contracts){
    if(err){
      console.log(err);
    }
    res.render('edit', {contracts: contracts});
  });
});

// 5: Update
app.put('/projekt/update/:id', function(req, res){
  const id = objectId(req.params.id);
  projekt.updateOne({_id: id}, {$set: req.body}, function(err, result){

  if(err){
    console.log(err);
  }
  res.redirect('/');
  });
});

// 6: Delete
app.get('/projekt/delete/:id', function(req, res){
  const id = objectId(req.params.id);

  projekt.deleteOne({_id: id}, function(err, result){
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
});


// run app
	app.listen(3000, function(){
			console.log("App is running att http://localhost:3000");
	});
