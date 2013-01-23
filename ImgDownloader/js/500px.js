
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		
		send = [{}];
		send.user = ''; // Because fu
		
		parsed_page_url = request.page_url.match(/http:\/\/500px\.com\/photo\/([0-9]+)/);
		// If the media is not on tumblr.com dont messed up the script.
		if( parsed_page_url != undefined ){
			send.num_post = parsed_page_url[1];
		
			request.src_target = document.getElementById('mainphoto').src;
			t_user = document.getElementsByClassName('copyright');
			if( t_user != undefined ){
				send.user = t_user[0].title.replace( /\s+/g, '-' );
			}
		}

		parsed_src_target = request.src_target.match(/http:\/\/([A-z]+)\.500px\.net\/([0-9]+)\/([A-z0-9]+)\/4\.([A-z]+)/);
		send.farm = parsed_src_target[1];
		send.num_post = parsed_src_target[2];
		send.hash = parsed_src_target[3];
		send.ext = parsed_src_target[4];
		
		send.start_link = "http://" + send.farm + ".500px.net/"+send.num_post+"/"+send.hash+"/";
		send.end_link = "." + send.ext;
		
		sendResponse({
			user: send.user,
			num_post: send.num_post,
			farm: send.farm,
			hash: send.hash,
			ext: send.ext,
			start_link: send.start_link,
			end_link: send.end_link,
			incr: ['4']
		});
});
