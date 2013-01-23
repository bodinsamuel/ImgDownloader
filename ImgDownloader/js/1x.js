
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		
		send = [{}];
		send.user = ''; // Because fu
		
		parsed_page_url = request.page_url.match(/http:\/\/1x\.com\/photo\/([0-9]+)/);
		// If the media is not on tumblr.com dont messed up the script.
		if( parsed_page_url != undefined ){
			send.num_post = parsed_page_url[1];
		
			request.src_target = document.getElementById('bigimage2').style.backgroundImage;
			t_user = document.getElementsByClassName('photoauthor');
			t_user = t_user[0].getElementsByTagName("a");
			if( t_user[0].innerHTML != undefined ){
				send.user = t_user[0].innerHTML.replace( /\s+/g, '-' );
			}
		}

		parsed_src_target = request.src_target.match(/url\(http:\/\/imghost\.1x\.com\/([0-9]+)\.([A-z]+)\)/);
		send.num_post = parsed_src_target[1];
		send.ext = parsed_src_target[2];
		
		send.start_link = "http://imghost.1x.com/"+send.num_post;
		send.end_link = "." + send.ext;
		
		sendResponse({
			user: send.user,
			num_post: send.num_post,
			ext: send.ext,
			start_link: send.start_link,
			end_link: send.end_link,
			incr: [undefined]
		});
});
