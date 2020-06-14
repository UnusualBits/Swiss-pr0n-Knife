// Generally needed function snippets
String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

var verbose = false;

// Loop function for parsing the data of each videobox into the array
function createList(nL) {
	var videoListL = [];
	
	// Note that $().length returns a result with 1 as a starting number for counting, not 0
	for (var i = 0; i <= nL; i++) {
		// Get individual values
		// 1. Get videoBox div ID for the current box (defined by i, using eq().attr(); )
		var vidID = $("#videoPlaylist > li").eq(i).attr("id");
		// 1.1. Check if we actually got a returned ID, to avoid errors in execution.
		if (typeof vidID !== "undefined") {
			if (verbose)
				console.log("Current index: " + i + " | Video ID: " + vidID);
			// 2. Get and clean rating and view values via appropriate selection;
			var vidViews = evaluateViews($("#videoPlaylist span.views var").eq(i).html());
			var vidRate = $("#videoPlaylist div.value").eq(i).html().replace("%","");
			// 3. Get duration value and convert it to linux time stamp
			var vidLength = $("#videoPlaylist var.duration").eq(i).html();
			// The following splits the xx:xx format up and puts the minute value into minSec[0] and the seconds value into minSec[1]
			var minSec = vidLength.split(":");
			// This then turns the entire output into a single int value in seconds
			var vidDuration = parseInt(minSec[0]) * 60 + parseInt(minSec[1]);
			if (verbose)
				console.log("Length: " + vidLength + " | Min Value: " + minSec[0] + " | Sec Value: " + minSec[1] + " | Calculated Duration : " + vidDuration);
			
			// Add new object for current video data to top level array
			videoListL[i] =  {vID:vidID, vDur:vidDuration, vVal:vidRate, vViews:vidViews} ;
		} else {
			if (verbose) {
				console.log("Undefined values, Private video or no Video ID available, skipping this.");
				console.log("~~~");
				console.log("----------");
			}
		}
	}
	
	console.log(" ");
	console.log(" ");
	console.log("Current number of entries in the array: " + videoListL.length);

	return videoListL;
}

// Turn pornhubs view expression into a useful number
function evaluateViews(phViewCount) {
	var views = 0;
	if (phViewCount.charAt(phViewCount.length - 1) == "M") 
		views = phViewCount.substring(0, phViewCount.length - 1) * 1000000;
	else if (phViewCount.charAt(phViewCount.length - 1) == "K")
		views = phViewCount.substring(0, phViewCount.length - 1) * 1000;
	else 
		views = phViewCount;
	return views;
}

// Sorting function that takes care of different sort orders and deals with the 2d array.
// method: 0 -> rating, 1 -> views, 2 -> duration || order: 0 -> desc, 1 -> asc
function sortList(method, order) {
	console.log("!-");
	console.log("!- sortList called with the following Arguments: " + method + ", " + order);

	// Indicate script working
	var $workingDiv = $("<div />").appendTo("body");
	$workingDiv.attr("id", "div_working");
	$("#div_working").css("background-color", "#000000");
	$("#div_working").css("z-index", "9999999");
	$("#div_working").css("font-size", "large");
	$("#div_working").css({top: 0, left: 0, position:'absolute', width: document.body.scrollWidth, height: document.body.scrollHeight, opacity: 0.85});
	var $spacer = $("<div />").appendTo("#div_working");
	$spacer.attr("id", "workingSpacer");
	$("#workingSpacer").css({height: $(window).height() - 300, width: 100});
	$("#workingMessage").css("text-align", "center");
	var $workingMessage = $("<div />").appendTo("#div_working");
	$workingMessage.attr("id", "workingMessage");
	$("#workingMessage").html("Sorting playlist...<br /><br />This can take several seconds for large lists.");
	$("#workingMessage").css('margin', 'auto');
	$("#workingMessage").css("text-align", "center");

	// Scroll through full list
	var nVideoBoxes = $( ".videoBox" ).length;
	var foundAll = false;
	console.log("!- Trying to get full list. Found videoBoxes = " + nVideoBoxes);
	console.log("!- Getting to the bottom of things...");
	getFullList();
	async function getFullList() {
		while (!foundAll) {
			window.scrollTo(0,(document.body.scrollHeight - 1140));
			await sleep(400);
			$("#div_working").css("height", document.body.scrollHeight);
			await sleep(1100);
			$("#div_working").css("height", document.body.scrollHeight);
			var nNewVideoBoxes = $( ".videoBox" ).length;
			console.log("!- Found newVideoBoxes = " + nNewVideoBoxes);
			console.log(nNewVideoBoxes > nVideoBoxes);
			if (nNewVideoBoxes > nVideoBoxes) {
				window.scrollTo(0,0);
				nVideoBoxes = nNewVideoBoxes;
			} else {
				foundAll = true;
			}
		}
		$("#div_working").css("height", document.body.scrollHeight);

		process();

		$("#div_working").remove();
		window.scrollTo(0,0);

		function process() {
			// Count number of videos in the playlist, top level array
			var n = $( ".videoBox" ).length;
			console.log("Number of videos detected in list to process: " + n);
			console.log("----------");
	
			// Once this array is filled, its' structure will look as follows:
			// videoList[0] -> Object {vID: "value", vDur: "value", vVal: "value", vViews: "value"}
			// videoList[1] -> Object {vID: "value", vDur: "value", vVal: "value", vViews: "value"}
			// videoList[2] -> Object {vID: "value", vDur: "value", vVal: "value", vViews: "value"}
			// ...
			var videoList = createList(n);
			
			var videoListPreviousLength = videoList.length;
			
			// ! DEBUG
			// Debug Info
			var videoListPreviousLength = videoList.length;
			if (verbose) {
				console.log("Starting list sorting.");
				console.log("Current number of entries in the array: " + videoList.length);
				console.log("Current array state:");
				for (i = 0; i <= videoList.length; i++) { 
					console.log(videoList[i]);
				}
				console.log("----------------------");
				console.log(" ");
			}
			
			// The following functions take care of the additional complexity of the 2d array, providing the function for each "column" of the array.
			function byRating (a, b) {
				if (parseInt(a.vVal) > parseInt(b.vVal)) {
					return 1;
				}
				if (parseInt(a.vVal) < parseInt(b.vVal)) {
					return -1;
				}
				return 0;
			}
			function byViews (a, b) {
				if (parseInt(a.vViews) > parseInt(b.vViews)) {
					return 1;
				}
				if (parseInt(a.vViews) < parseInt(b.vViews)) {
					return -1;
				}
				return 0;
			}
			function byDuration (a, b) {
				if (parseInt(a.vDur) > parseInt(b.vDur)) {
					return 1;
				}
				if (parseInt(a.vDur) < parseInt(b.vDur)) {
					return -1;
				}
				return 0;
			}
			
			// Using array.sort(); which calls the appropriate sort function to sort the top level array.
			if (method === 0) {
				// Sort by Rating
				videoList.sort( byRating );
				console.log("Sorting by rating.")
			}
			if (method === 1) {
				// Sort by Views
				videoList.sort( byViews );
				console.log("Sorting by views.")
			}
			if (method === 2) {
				// Sort by Duration
				videoList.sort( byDuration );
				console.log("Sorting by duration.")
			}
			
			// Reversing order if needed. Note that this may turn around depending on your method of restructuring the <li> elements.
			if (order === 0) {
				videoList.reverse();
				console.log("Inverse order.");
			}
			
			// ! DEBUG
			// Output array state after completed sort function
			console.log(" ");
			console.log("----------------------");
			console.log("!- Finished sorting array.");
			console.log("Previous number of entries in the array: " + videoListPreviousLength);
			console.log("Current number of entries in the array: " + videoList.length);
			if (verbose) {
				console.log("Current array state:");
				for (i = 0; i <= videoList.length; i++) { 
					console.log(videoList[i]);
				}
			}
			console.log("----------------------");
			console.log(" ");
			
			// Calling the Final Function
			flushList(videoList);
		}

		// Indicate script finished
		//$("#div_working").remove();
	}
}

// DOM Restructuring Loop
// Just move the <li>s according to the array index.
function flushList(videoListL) {
	
	// ! Debug
	var iA = videoListL.length;
	console.log("!- Attempting to restructure DOM");
	console.log("Current Array Length is: " + iA);
	console.log(" ");
	
	iA = iA - 1;
	
	// with prependTo(); this basicly puts every <li> with the selected ID from the array to the BEGINNING of the <ul> listing.	
	for (i = iA; i >= 0; i--) {
		var elemID = videoListL[i].vID;
		if (verbose) {
			console.log("Attempt: #" + elemID + " at beginning of #videoPlaylist during step #" + i + ". Used Selector: [ID|='" + elemID + "'] | Referring to: ");				
			console.log(videoListL[i])
		}
		
		var movedListing = $("[ID|='" + elemID + "']");
		if (verbose) console.log (movedListing[0]);
		movedListing.prependTo("ul#videoPlaylist").css("margin",1);
		if (verbose) console.log("--------");
	}
	
	console.log("Done.");
	console.log("Clearing array and re-creating list.");
	videoListL = [];
	console.log("Current Array length after clear: " + videoListL.length);
	createList();
}