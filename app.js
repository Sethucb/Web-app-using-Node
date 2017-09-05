var express = require('express');
var path = require('path');
var fs = require('fs');
var dbconnect = require('./connect.js');
var bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

var db;

dbconnect.init().then(function(data){
		if(data){
			db = data;
			dbconnect.questCollect(data);
		}
	}).catch(function(err){
		console.log(err);
});

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/',function(req,res){	
	var obj = req.body;
	db.collection("Ombudsman_Entries").insert(obj);
	// res.writeHead(200, {'Content-Type':'text/plain'});
	// res.send(req);
});

app.listen(3000,function(){
	console.log('Listening on port 3000');
})
