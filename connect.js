'use strict';

const MongoClient = require('mongodb').MongoClient;
const questJson = require('./questions.json');
const json2xls = require('json2xls');
const fs = require('fs');

const uri = 'mongodb://localhost:27017/Ombudsman';

module.exports = {	
	init : function(){
			return new Promise(function(resolve,reject){
				MongoClient.connect(uri, function(err,db){
				if(!err) {
					console.log('DB connected');
					resolve(db);
				}
				reject(err);
			});
		});
	},

	questCollect : function(db){
		db.createCollection('Ombudsman_Entries', function(err, collection){
		   if (err) {
		   	throw err;
		   }
		   else{
		   	console.log("Created testCollection");
			}
		});
	},

	reportCollect : function(db,date,callback){
		// console.log('json is ',questJson);
		var cursor = db.collection('Ombudsman_Entries').find({
			"dateEntry" : {
				$gte: new Date(date.start),
				$lte: new Date(date.end)
			}
		}).sort({ 'dateEntry': 1 }).toArray();
		let arr = [];
		cursor.then(function(data){
			arr.unshift(questJson);
			// console.log('dat is ',data);
			for(let ind of data){
				if(typeof ind === 'undefined' || typeof ind === 'null'){
					continue;
				}
				delete ind.dateEntry;
				delete ind._id;
				arr.push(ind);
			}
			let xls = json2xls(arr);
			return xls;
		}).then(function(xls){
			callback(xls);
		}).catch(function(err){
			console.log(err);
		});
	},

	filteredreport : function(db,filter,callback){
		// console.log('filter i s ',filter);
		let dateEntry = {
				$gte: new Date(filter.dateEntry.start),
				$lte: new Date(filter.dateEntry.end)
		}
		filter.dateEntry = dateEntry;
		// console.log('filter i s +++  ',filter);
		var cursor = db.collection('Ombudsman_Entries').find(filter).sort({ 'dateEntry': 1 }).toArray();
		let arr = [];
		cursor.then(function(data){
			arr.unshift(questJson);
			for (let ind of data){
				if(typeof ind === 'undefined' || typeof ind === 'null'){
					continue;
				}
				delete ind.dateEntry;
				delete ind._id;
				arr.push(ind);
			}
			let xls = json2xls(arr);
			callback(xls);
		}).
		catch(function(err){
			console.error(err);
		});
	}
};