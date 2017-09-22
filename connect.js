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

	reportCollect : function(db,date){
		var cursor = db.collection('Ombudsman_Entries').find({
			"dateEntry" : {
				$gte: new Date(date.start),
				$lte: new Date(date.end)
			}
		}).sort({ 'dateEntry': 1 }).toArray();

		cursor.then(function(data){
			let arr = [];
			console.log('cusr len is '+ data.length);			
			for(i in data){
				console.log(data[i]);
				delete data[i].dateEntry;
				// delete data[i]._id;
				arr.push(data[i]);
			}
			// T download as xl
			// res.xls('data.xlsx', arr);
			let xls = json2xls(arr);
			fs.writeFileSync('Ombudsman_Report.xlsx', xls, 'binary');
		}).catch(function(err){
			console.log(err);
		});
	}
};