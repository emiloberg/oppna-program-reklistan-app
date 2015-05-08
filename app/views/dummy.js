var FrameModule = require('ui/frame');
var PageModule = require('ui/page');
var LabelModule = require('ui/label');
var StackLayoutModule = require('ui/layouts/stack-layout');
var webViewModule = require("ui/web-view");
var fs = require( "file-system" );

var pageFactory = function () {
	var testPage = new PageModule.Page();

	var webView = new webViewModule.WebView();
	
	Object.keys(fs.knownFolders.documents).forEach(function(f) {
		console.log(f);
	});

	webView.url = 'file:///tmp/dump.html';
	webView.on(webViewModule.WebView.loadStartedEvent, function(e) {

		if (e.url.indexOf('tjohej://') > -1) {
			e.object.ios.stopLoading();
		}

		//var topFrame = FrameModule.topmost();
		//topFrame.navigate({
		//	create: function() {
		//		var testPage2 = new PageModule.Page();
		//		var webView2 = new webViewModule.WebView();
		//		webView2.url = 'file:///tmp/hej.html';
		//		testPage2.content = webView2;
		//		return testPage2;
		//	}
		//});

	});

	testPage.content = webView;
	return testPage;
};
var navEntry = {
	create: pageFactory,
	animated: false
};

function pageLoaded() {
	var topFrame = FrameModule.topmost();
	topFrame.navigate(navEntry);
}

module.exports.pageLoaded = pageLoaded;

