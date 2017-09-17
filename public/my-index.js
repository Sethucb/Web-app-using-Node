$(function(){

	$('.btn-primary').click(function(){
		alert("You have submitted the form");
		
		let obj = {};
		$('td .form-control option:selected').each(function(ele,value){
			let val = value.innerHTML;
			if(val == 'Select'){
				val = '';
 	 		}
 	 		let name = value.parentElement.name;
 	 		obj[name] = val;
		});
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
		// Defaults to Select
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
				dates['start_month'] = val.index;
			}
			else if(index === 1){
				dates['start_year'] = value;
			}
			else if(index === 2){
				dates['end_month'] = val.index;
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
						// console.log('date is '+dates.start_year);
						$.ajax({
							url: "/report",
							type: "POST",
							data: dates,
							dataType: "application/json",
							success: function(data){
								console.log('Success recieved');
							},
							error: function(err){
								console.log('Error is ',err);
							}	
						});
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
				// let beginDate = dates.start_year +',' + dates.start_month;
				// let endDate = dates.end_year + ',' + dates.end_month;
				// console.log('bg is '+beginDate+' e is '+endDate);
				console.log('Good');
				resolve(/*{
					beginDate:beginDate,
					endDate: endDate
				}*/);
			}
			else{
				console.log('Badddd');
				reject('Please enter end date bigger than start date');
			}
		});
	}

});
