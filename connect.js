var MongoClient = require('mongodb').MongoClient;
var questJson = require('./questions.json');
var json2xls = require('json2xls');
var fs = require('fs');

var uri = 'mongodb://localhost:27017/Ombudsman';
// app.use(json2xls.middleware);

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
		   if (err) throw err;
		   	console.log("Created testCollection");
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
			// console.log('cusr len is '+ data.length);
			// console.log('dat is ',data);
			for(i in data){
				// console.log(data[i]);
				delete data[i].dateEntry;
				delete data[i]._id;
				arr.push(data[i]);
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
		// delete filter.dateEntry;
		// console.log('filter i s +++  ',filter);
		var cursor = db.collection('Ombudsman_Entries').find(filter).sort({ 'dateEntry': 1 }).toArray();
		let arr = [];
		cursor.then(function(data){
			for (i in data){
				console.log('is is ',data[i]);
				delete data[i].dateEntry;
				delete data[i]._id;
				arr.push(data[i]);
			}
			let xls = json2xls(arr);
			callback(xls);
		}).
		catch(function(err){
			console.error(err);
		});
	}
};