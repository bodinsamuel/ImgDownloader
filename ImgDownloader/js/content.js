chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	src = '';
	name = '';
	if( request.type == '500px' ){
		src = document.getElementById('mainphoto').src;
		t_user = document.getElementsByClassName('copyright');
		if( t_user != undefined ) name = t_user[0].title;
	}
	else if( request.type == 'flickr' ){
		src = document.getElementById('liquid-photo').src;
	}
	
	name = name.replace( /\s+/g, '' );
	
	sendResponse( {pic : src, user: name} );
});