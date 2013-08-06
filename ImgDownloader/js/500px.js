
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		
		send = [{}];
		send.user = ''; // Because fu
		
		parsed_page_url = request.page_url.match(/http:\/\/500px\.com\/photo\/([0-9]+)/);
		// If the media is not on tumblr.com dont messed up the script.
		if( parsed_page_url != undefined ) {
		
			request.src_target = document.getElementsByClassName('the_photo')[0].src;

			t_user = document.getElementsByClassName('user_profile_link')[0];
			if( t_user != undefined ){
				send.user = t_user.innerHTML.replace( /\s+/g, '-' );
			}

			parsed_src_target = request.src_target.match(/http:\/\/([A-z]+)\.500px\.net\/([0-9]+)\/([A-z0-9]+)\/([0-9]+)\.([A-z]+)/);
			send.farm = parsed_src_target[1];
			send.num_post = parsed_src_target[2];
			send.hash = parsed_src_target[3];
			send.ext = parsed_src_target[5];
			
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
				incr: ['2048', '4']
			});
		}
});
