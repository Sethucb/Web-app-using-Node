var express = require('express');
var path = require('path');
var fs = require('fs');
var dbconnect = require('./connect.js');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));


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
	res.sendfile(path.join(__dirname+'/index.html'));
});

app.post('/form',function(req,res){	
	console.log('Request ++++');	
	let obj = req.body;
	db.collection("Ombudsman_Entries").insert(obj);
	// res.writeHead(200, {'Content-Type':'text/plain'});
	// res.send(req);
});

app.post('/report',function(req,res){
	let obj = req.body;
	console.log('Request rece==== '+ obj.start_year);
	// console.log('ob is '+ obj.beginDate + ' end is '+obj.endDate);
});

app.listen(3000,function(){
	console.log('Listening on port 3000');
})
