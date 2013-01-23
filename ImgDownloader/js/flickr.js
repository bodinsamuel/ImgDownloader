
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		
		send = [{}];

		parsed_page_url = request.page_url.match(/http:\/\/www\.flickr\.com\/photos\/([A-z0-9]+)\/([0-9]+)\//);
		// If the media is not on tumblr.com dont messed up the script.
		if( parsed_page_url != undefined ){
			send.user = parsed_page_url[1];
			send.num_post = parsed_page_url[2];
		
			request.src_target = document.getElementById('liquid-photo-buffer').src;
		}

		parsed_src_target = request.src_target.match(/http:\/\/([A-z0-9]+)\.staticflickr\.com\/([0-9]+)\/([0-9]+)_([A-z0-9]+)_([a-z]+)\.([a-z]+)/);
		send.farm = parsed_src_target[1];
		send.num_post = parsed_src_target[3];
		send.hash = parsed_src_target[4];
		send.ext = parsed_src_target[6];
		
		send.start_link = "http://" + send.farm + ".staticflickr.com/"+parsed_src_target[2]+"/"+send.num_post+"_" + send.hash + "_";
		send.end_link = "." + send.ext;
		
		sendResponse({
			user: send.user,
			num_post: send.num_post,
			farm: send.farm,
			hash: send.hash,
			ext: send.ext,
			start_link: send.start_link,
			end_link: send.end_link,
			incr: ['k','h','b','c','z','m']
		});
});
