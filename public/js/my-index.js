const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function checkDates(){
	return new Promise(function(resolve,reject){
		let dates = {};
		$('.rep option:selected').each(function(index,val){
			let value = val.innerHTML;
			if(value === 'Select'){
				// console.log('INSIDE reject');
				if(!$('div.error:contains("fields")').length){
					$('<p>Error : Please enter all the fields</p>').appendTo('.error');
					$('.error').show();
				}
				return false;
			}
			if(index === 0){
				dates['start_month'] = months[val.index-1];
			}
			else if(index === 1){
				dates['start_year'] = value;
			}
			else if(index === 2){
				dates['end_month'] = months[val.index-1];
			}
			else{
				dates['end_year'] = value;
			}
		});
		console.log('dates is ',dates);
		if(Object.keys(dates).length === 4){
			$('.error p').html('');
			resolve(dates);
		}		
	});
}

$(function(){	

	$('.btn-primary').click(function(){		
		
		let obj = {};
		$('td .form-control option:selected').each(function(index,value){
			let val = value.innerHTML;
			if(val == 'Select'){
				val = '';
 	 		}
 	 		let name = value.parentElement.name;
 	 		obj[name] = val;
		});
		// Check if month and year are provided
		// if(obj.office_q1 === '' || obj.office_q2 === ''){
		// 	if(!$('div.error:contains("month")').length){
		// 		$('<p>Error : Please enter month and year</p>').appendTo('.error');
		// 		$('.error').show();
		// 	}
		// 	return false;
		// }
		$.ajax({
			url: '/form',
			type: "POST",
			data: obj,
			dataType: "application/json",
			success: function(data){
				console.log('Success recieved');
			},
			error: function(err){
				console.log('Error is ',err);
			}
		});
		alert("You have submitted the form");
		// Defaults to Select
		// console.log('herer esjdfnskdnff');
		$('select').val('select');
		$('.error p').html('');
	});


	$('.btn-info').click(function(){

		checkDates().then(function(dates){
			console.log('RESOLVED');
			// $('.error').hide();
			$('.error p').html('');
			datesPromise(dates).then(function(data){
				// $('.error').hide();
				$('.error p').html('');
				// toDateString .getMonth()
				console.log('GOI into ajax');
				// console.log('date is ',data);

				$.ajax({
					url: "/report",
					type: "POST",
					data: data,
					success: function(data,status,xhr){
						console.log('Success recieved');
						console.log('dat is '+data);
						var url = "http://127.0.0.1:3000/download";
						window.open(url,'_blank');					
					},
					error: function(err){
						console.log('ERROR===');
						console.log(err.responseText);
					}	
				});
				// $('select').val('select');
			}).catch(function(err){
				if(!$('div.error:contains("date")').length){
					$('<p>Error : '+ err + '</p>').appendTo('.error');
					$('.error').show();
				}
			});	
		});
	});

	let datesPromise = function(dates){
		let start = new Date(dates.start_year +','+ dates.start_month);
		let end = new Date(dates.end_year + ','+ dates.end_month);
		
		return new Promise(function(resolve,reject){
			if(start < end){
				console.log('Good');	
				resolve({
					start: start.toLocaleDateString(),
					end: end.toLocaleDateString()
				});
			}
			else{
				console.log('Badddd');
				reject('Please enter end date bigger than start date');
			}
		});
	}

	$('.btn-secondary').click(function(){
		checkDates().then(function(dates){
			console.log("date check over +++");
			reportsPromise(dates).then(function(filterObject){
				console.log('obj is ',filterObject);
				$.ajax({
					url: "/filteredreport",
					type: "POST",
					data: filterObject,
					// responseType: 'arraybuffer',
					success: function(data,status,xhr){
						// $window.open('/download'); //does the download
						console.log('Success recieved');
						console.log('dat is '+data);
						var url = "http://127.0.0.1:3000/download";
						window.open(url,'_blank');
					},
					error: function(err){
						console.log('ERROR===');
						console.log(err.responseText);
					}	
				});
			}).
			catch(function(err){
				if(!$('div.error:contains("date")').length){
					$('<p>Error : '+ err + '</p>').appendTo('.error');
					$('.error').show();
				}
			});
		});
	});

	let reportsPromise = function(dates){
		return new Promise(function(resolve,reject){
			datesPromise(dates).then(function(date){
				console.log('Yeahhh');
				let obj = {};
				$('td .form-control option:selected').each(function(index,value){
					let val = value.innerHTML;
					if(val == 'Select'){
						return true;
		 	 		}
		 	 		let name = value.parentElement.name;
		 	 		obj[name] = val;
				});
				obj.dateEntry = date;
				// console.log('obj is ',obj);
				resolve(obj);
			}).
			catch(function(err){
				console.log('Oh noooo');
				reject('Please enter end date bigger than start date');
			});
		});
	}

});
