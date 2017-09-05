$(function(){

	$('.btn').click(function(){
		alert("You have submitted the form");
		
		let obj = {};
		$('.form-control option:selected').each(function(ele,value){
			let val = value.innerHTML;
			if(val == 'Select'){
				val = '';
 	 		}
 	 		let name = value.parentElement.name;
 	 		obj[name] = val;
		});
		let url = 'http://127.0.0.1:3000';
		$.ajax({
			url: url,
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
		// window.location.reload();
		$('.form-control option:selected').each(function(ele,val){
			val.innerHTML = 'Select';
		});
	});
});
