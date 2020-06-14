console.log("!- Page matches content filter. Checking for appropriate scripts.");

// Check for Gelbooru image & Check for rule34.xxx image
if ( $("#image").length && $('#site-title > a').attr('href') == "https://rule34.xxx/" ) {
	console.log("!- rule34.xxx image found.");
	resize_r34();
} else if (  $("#image").length  ) {
	console.log("!- Gelbooru image found.");
	gelbooruResize();
} else {
	console.log("!- Skipping rule34.xxx and gelbooru scripts.");
}

// Check for g.e-hentai image
if ($("#img").length) {
	console.log("!- e-hentai image found.");
	resize_geh();
} else {
	console.log("!- Skipping e-hentai Script.");
}

// Check for Pornhub playlist
if ($( ".videoBox" ).length) {
	console.log("!- Pornhub playlist found.");
} else {
	console.log("!- Skipping Pornhub Script.");
}


