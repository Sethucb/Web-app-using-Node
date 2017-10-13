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
		// let questionObj = []
		let questionObj = {
		student_q1: "Is this Your First Visit to our office?",
		student_q2: "How did you learn about our office?",
		student_q3: "Your Gender",
		student_q4: "Your Preferred Gender Pronoun",
		student_q5: "Your Racial/Ethnic Background",
		student_q6: "Are you an International Student?",
		student_q7: "Which Best describes your Status at BU?",
		student_q8: "School Affiliation: (if applicable)",
		student_q9: "Would you be willing to complete an anonymous survey to help us evaluate our services?",
		office_q1: "Month",
		office_q2: "Year",
		office_q3: "Division Affiliation",
		office_q4: "Primary Issue",
		office_q5: "Secondary Issue",
		office_q6: "Tertiary Issue",
		office_q7: "Initial visit information conveyed by:",
		office_q8: "Perceived locus of problem:",
		office_q9: "Resulting Action",
		office_q10: "Complexity Scale"
	};
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
			// T download as xl
			// res.xls('data.xlsx', arr);
			let xls = json2xls(arr);

			fs.writeFileSync('Ombudsman_Report.xlsx', xls, 'binary');
			fs.chmod('Ombudsman_Report.xlsx', 0777, function(err){
				 if(err) throw err;
			});
			return xls;
		}).then(function(xls){
			callback(xls);
		}).catch(function(err){
			console.log(err);
		});
	}
};