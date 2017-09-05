var MongoClient = require('mongodb').MongoClient;
var uri = 'mongodb://localhost:27017/Ombudsman';
var questJson = require('./questions.json');

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
		db.createCollection("Ombudsman_Entries", function(err, collection){
		   if (err) throw err;
		   	console.log("Created testCollection");
		});
	}
};