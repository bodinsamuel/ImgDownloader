var post = '';
var allsize = [];
var allurl = [];
current = 0;
	function xhr_media( url, size, callback ){
			var client = new XMLHttpRequest();
			client.onreadystatechange = function() {
					if( this.readyState == 4 ) {
							current ++;
							if( this.status == 200 && all.mime == client.getResponseHeader("Content-Type") ) {
								allsize[size] = size;
								allurl[size] = url;
								callback( size );
							}
					}
				};
			client.open( "HEAD", url + "?" + (new Date()).getTime(), true );
			client.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5 (.NET CLR 3.5.30729)");
			client.send();
	}

	function make_title( ){
		if( all.user == undefined ){
			title = all.domain + "_" + all.hash + "_" + all.size + "." + all.ext;
		}
		else{
			if( all.num_post != undefined ) { post = "[" + all.num_post + "]"; }
			
				title = all.domain + "_" + all.user + post;
				if( all.hash != undefined ) title += "_" + all.hash;
				title += "_" + all.size + "." + all.ext;
		}
	}


function while_link( callback ){
	
	len = all.incr.length;
	if( all.incr[0] != undefined) {
		for( g = 0; g < len; g ++ ){
			all.hd_link = all.start_link + all.incr[g] + all.end_link;
			xhr_media( all.hd_link, all.incr[g], function( r ){
				if ( current == len  ){
					for( i = 0; i < len; i ++ ){
						if( allsize[all.incr[i]] == all.incr[i] && all.size == undefined ){
							all.size = allsize[all.incr[i]];
							all.final_url = allurl[all.incr[i]];
							callback( true );
						}
					}
				}
				
			});
		}
	}
	else{
		all.final_url = all.hd_link = all.start_link + all.end_link;
		xhr_media( all.hd_link, 'hd', function( r ){
				all.size = 'hd';
				callback( true );
			}
		);
	}
}


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	all = request;
	
	all.finalized = false;
	// Instead of 302 with a Default Image (flickr case)
	// It will check if the header returned by XHR is the same as which we want
	// Not a real solver but a simple way to avoid few mistake.
	if( all.ext == 'jpg' || all.ext == 'jpeg' ) all.mime = 'image/jpeg';
	else if( all.ext == 'gif'  ) all.mime = 'image/gif';
	else if( all.ext == 'png'  ) all.mime = 'image/png';
	
	while_link( function( e ){
		if( e == true ){
			make_title( );
			sendResponse({ error: false, title: title, url: all.final_url });
		}
		else{
			sendResponse({ error: true });
		}
	});
	
});