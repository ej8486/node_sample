$("#registerBtn").live("click", function() {
	var email = $('#email').val();
	var password = $('#password').val();
	var name = $('#name').val();

	var userParam = {email: email, password: password, name: name};

	$.ajax({
		url			: "/register",
	  	type		: "POST",
	  	contentType	: 'application/json',
	  	data		: JSON.stringify({user: userParam}),
	  	async		: false,
	  	success		: function(dataResponse, status, xhr) {
	  		alert(dataResponse.resultFlag);
		}
	});
});