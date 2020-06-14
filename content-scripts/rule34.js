// Notes to self: Resize the width of the image first
// Multiply that with the img_ratio to determine correct height
// Make sure to respect margins (4x 10px) and the side +top bar


function resize_r34() {
// Variables:
	// Get original image size
	var start_width = parseInt($('#image').css('width').slice(0, -2));
	var start_height = parseInt($('#image').css('height').slice(0, -2));
	
	// Get side and top bar dimensions
	var sidebar_width = parseInt($('#post-view > div.sidebar').css('width').slice(0, -2));
	var topbar_height = parseInt($('#header').css('height').slice(0, -2));
	
	// Get browser window size
	var view_height = $( window ).height();
	var view_width = $( window ).width();
	
	// flag for if control and new variables to be set
	var flag = false;
	var new_width = 0;
	var new_height = 0;
	
	
	// Check if image needs to be resized and if so, which way
	var checkvalue_w = view_width - 20 - sidebar_width;
	var checkvalue_w = parseInt(checkvalue_w);
	var checkvalue_h = view_height - 20 - topbar_height;
	var checkvalue_h = parseInt(checkvalue_h);
	var img_ratio = parseInt(start_width) / parseInt(start_height);
	
	// Debug:
	console.log("Original Data: R " + img_ratio + " | W " + start_width + " | H " + start_height + ". Browser window dimensions: W " + view_width + " | H " + view_height + ".");
	console.log("Calculated checkvalues: W " + checkvalue_w + " | H " + checkvalue_h + ".");
	
	if (start_width >= checkvalue_w) {
		console.log ('if-width-condition is met.');
		new_width = checkvalue_w - 50;
		new_height = checkvalue_w / img_ratio;
		console.log ('W-if: New width calculated to be: ' + new_width);
		console.log ('W-if: New height calculated to be: ' + new_height);
		flag = true;
	}
	
	if (start_height >= checkvalue_h) {
		console.log ('if-height-condition is met.');
		new_height = checkvalue_h - 30;
		new_width = (checkvalue_h * img_ratio) - 50;
		console.log ('W-if: New width calculated to be: ' + new_width);
		console.log ('W-if: New height calculated to be: ' + new_height);
		flag = true;
	}
	
	if (flag == true) {
		$('#image').css('width', new_width);
		$('#image').css('height', new_height);		
	}

	
	// Terminate
	console.log ("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
	console.log ("Terminating rule34.xxx section.")
}