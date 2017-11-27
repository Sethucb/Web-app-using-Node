'use strict';

/*************External dependencies*************/
const express = require('express');
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');
const json2xls = require('json2xls');
const bodyParser = require('body-parser');

/*************Internal dependencies*************/
const dbconnect = require('./connect.js');

/*************MiddleWares*********************/

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(json2xls.middleware);

/*************App setup**********************/

let db;
dbconnect.init().then(function(data){
	if(data){
		db = data;
		dbconnect.questCollect(data);
	}
	}).catch(function(err){
		console.log(err);
});

app.listen(3000,function(){
	console.log('Listening on port 3000');
});

/*************Route Handlers****************/

app.get('/',function(req,res){
	res.sendfile(path.join(__dirname+'/views/index.html'));
});

app.post('/form',function(req,res){	
	// console.log('Request ++++');	
	let obj = req.body;
	obj['dateEntry'] = new Date(obj.office_q1 + ',' + obj.office_q2);
	db.collection('Ombudsman_Entries').insert(obj);
	// res.writeHead(200, {'Content-Type':'text/plain'});
	// res.send();
});

app.post('/report',function(req,res){
	let date = req.body;
	// console.log('data us ',date);
	// console.log('Request rece==== '+ date.start+' end is '+ date.end);
	dbconnect.reportCollect(db,date,function(xls){
		xlsObj = xls;
		res.writeHead(200, {'Content-Type':'text/plain'});
		res.end('It worked');
	});
});

var xlsObj;

app.get('/download',function(req, res) {
	console.log('GOFORIT');
	let fileName = 'Ombudsman_Report.xlsx';
	res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename='+fileName);
	// res.download(fileName);
	res.end(new Buffer(xlsObj, 'binary'));
	
});

app.post('/filteredreport',function(req,res){
	// console.log(req.body);
	let filter = req.body;
	dbconnect.filteredreport(db,filter,function(xls){
		xlsObj = xls;
		res.writeHead(200, {'Content-Type':'text/plain'});
		res.end('It worked');
	});
});


