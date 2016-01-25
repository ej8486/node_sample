$("#loginBtn").live("click", function() {
	var lgnId = $('#lgnId').val();
	var password = $('#password').val();

	$.ajax({
		url			: "/login",
	  	type		: "POST",
	  	contentType	: 'application/json',
	  	data		: JSON.stringify({lgnId: lgnId, password: password}),
	  	async		: false,
	  	success		: function(dataResponse, status, xhr) {
	  		if (dataResponse.loginFlag == true) {
	  			location.replace('/admin');
	  		} else {
	  			alert(dataResponse.loginFlag);
	  		}
		}
	});
});

$("#loginBtn_g").live("click", function() {
	location.replace('/auth/google');
});