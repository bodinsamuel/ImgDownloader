// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Returns a handler which will open a new window when activated.
 */

var post = ''; // Post Number
var dl_default = true; // Download Default if no Hd
media = [{}];
prenotif = false;

function getClickHandler() {
  return function(info, tab) {
		media.tab = tab['id'];
		media.src_target = info['srcUrl'];
		if( info['srcUrl'] == undefined ) media.src_target = info['pageUrl'];
		media.page_url = info['pageUrl'];
		host = media.src_target.match(/([A-z0-9]+)\.com/);
		media.host = host[1];
		
		
		//
		// Tumblr
		if( media.host == 'tumblr' ){
			call_site_file( 'tumblr' );
			return false;
		}
		
		//
		// 500px
		else if( media.host == '500px' ){
			call_site_file( '500px' );
			return false;
		}
				
		//
		// Flickr
		else if( media.host == 'flickr' ){
			call_site_file( 'flickr' );
			return false;
		}

		//
		// 1x
		else if( media.host == '1x' ){
			call_site_file( '1x' );
			return false;
		}
		//
		// Probably an error
		else{
			return false;
		}
		
  };
}

// Execute Specific Parsing For Each Website
function call_site_file( site ){
	pre_notif();
	chrome.tabs.executeScript( media.tab, { file: "js/"+ site +".js" }, function() {
		chrome.tabs.sendRequest( media.tab, { tab: media.tab, page_url: media.page_url, src_target: media.src_target }, function(response) {
			console.log( 'Call Site: Done' );
			response.domain = site;
			response.src_target = media.src_target;
			call_prepare( response );
		});
	});
}
// Prepare the Download: Check Url, Make Title
function call_prepare( json ){
	chrome.tabs.executeScript( media.tab, { file: "js/prepare.js" }, function() {
		chrome.tabs.sendRequest( media.tab, json , function(response) {
			console.log( 'Call Prepare: Done' );
			if( response.error == false ){
				console.log( response.title, response.url );
				do_download( response.url, response.title );
			}
			else{
				do_notif( 'images/error.png', 'There is something wrong', json.hd_link );
			}
		});
	});
}
// Do the Actual Downloading as everything run perfectly
function do_download( url, title ){
	console.log( 'Lauching Download', url, title);
	chrome.downloads.download({
			url: url + "?" + (new Date()).getTime(),
			filename: title
		},
		function( downloadId ) {
				do_notif( url, 'Succesfully Downloaded', title );
		}
	);
}
function pre_notif()
{
	prenotif = webkitNotifications.createNotification(
			'loading.gif','Creating download','Extension is checking for image.'
	);
	prenotif.show();
	setTimeout(
			function(){ prenotif.cancel(); }
	, 7000 );
}
function do_notif( img, title, text){
		var notification = webkitNotifications.createNotification(
			'valid.png',  // icon url - can be relative
			title,  // notification title
			text  // notification body text
		);
		// Then show the notification.
		prenotif.cancel();
		notification.show();
		setTimeout(
				function(){ notification.cancel(); }
			, 5000 );
}

// Do the Actual Downloading as everything run perfectly
function fastDownload( ){
  return function(info, tab) {
	pre_notif();
	var url = info['srcUrl'];
	var file = url.split(/\?/)[0];
	var filename = file.split(/\//);
	do_download( url, filename[filename.length -1] );
  };
}

/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
  "title" : "From Tumblr",
  "type" : "normal",
  "contexts" : ["image"],
	"targetUrlPatterns" : ["http://*.media.tumblr.com/*"],
  "onclick" : getClickHandler()
});
chrome.contextMenus.create({
  "title" : "From 500px",
  "type" : "normal",
  "contexts" : ["page"],
	"documentUrlPatterns" : ["http://500px.com/photo/*"],
  "onclick" : getClickHandler()
});
chrome.contextMenus.create({
  "title" : "From Flickr",
  "type" : "normal",
  "contexts" : ["page", "image"],
	"documentUrlPatterns" : ["http://www.flickr.com/photos/*"],
	"targetUrlPatterns" : ["http://*.staticflickr.com/*/*"],
  "onclick" : getClickHandler()
});
chrome.contextMenus.create({
  "title" : "From 1x",
  "type" : "normal",
  "contexts" : ["page"],
	"documentUrlPatterns" : ["http://1x.com/photo/*"],
  "onclick" : getClickHandler()
});

chrome.contextMenus.create({
  "title" : "Fast Download",
  "type" : "normal",
  "contexts" : ["image"],
  "onclick" : fastDownload()
});