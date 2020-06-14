// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


function goPH(e) {
	var var1 = $("input:radio[name ='xdxd']:checked").val();
	var var2 = $("input:radio[name ='xdxd1']:checked").val();
	console.log("Var 1: " + var1 + " | Var 2: " + var2);
	chrome.tabs.executeScript(null,
		{code:'sortList('+var1+','+var2+')'});
	window.close();
}

document.addEventListener('DOMContentLoaded', function () {
    $('#go').click(goPH);
});
