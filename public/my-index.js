$(function(){

	let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	$('.btn-primary').click(function(){		
		
		let obj = {};
		$('td .form-control option:selected').each(function(ele,value){
			let val = value.innerHTML;
			if(val == 'Select'){
				val = '';
 	 		}
 	 		let name = value.parentElement.name;
 	 		obj[name] = val;
		});
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

		let dates = {};
		$('.rep option:selected').each(function(index,val){
			let value = val.innerHTML;
			if(value === 'Select'){
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
			if(Object.keys(dates).length === 4){
					// $('.error').hide();
					$('.error p').html('');
					datesPromise(dates).then(function(data){
						// $('.error').hide();
						$('.error p').html('');
						// toDateString .getMonth()
						console.log('GOI into ajax');
						// console.log('date is '+dates.start_month);
						$.ajax({
							url: "/report",
							type: "POST",
							data: data,
							dataType: "application/json",
							success: function(data){
								console.log('Success recieved');
							},
							error: function(err){
								console.log('Error is ',err);
							}	
						});
						// $('select').val('select');
					}).catch(function(err){
						if(!$('div.error:contains("date")').length){
							$('<p>Error : '+ err + '</p>').appendTo('.error');
							$('.error').show();
						}						
					});
			}
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

});
