
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		
		send = [{}];
		

		parsed_page_url = request.page_url.match(/http:\/\/([A-z0-9]+)\.tumblr\.com\/(post\/([0-9]+))?/);
		// If the media is not on tumblr.com dont messed up the script.
		if( parsed_page_url != undefined ){
			send.user = parsed_page_url[1];
			send.num_post = parsed_page_url[3];
		}

		console.log( request.src_target );
		parsed_src_target = request.src_target.match(/(http\:\/\/([0-9]+)\.media\.tumblr\.com\/([A-z0-9]+\/)?)tumblr\_([A-z0-9]+)\_([0-9]+)\.([A-z]+)/);
		send.fullbase = parsed_src_target[1];
		send.farm = parsed_src_target[2];
		send.md5 = parsed_src_target[3];
		send.hash = parsed_src_target[4];
		send.ext = parsed_src_target[6];
		
		console.log( parsed_src_target );
		send.start_link = send.fullbase +"tumblr_" + send.hash + "_";
		send.end_link = "." + send.ext;
		

		sendResponse({
			user: send.user,
			num_post: send.num_post,
			farm: send.farm,
			hash: send.hash,
			ext: send.ext,
			start_link: send.start_link,
			end_link: send.end_link,
			incr: ['1280','500','400','250']
		});
});
