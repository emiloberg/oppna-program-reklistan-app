var FrameModule = require('ui/frame');
var PageModule = require('ui/page');
var LabelModule = require('ui/label');
var StackLayoutModule = require('ui/layouts/stack-layout');
var webViewModule = require("ui/web-view");

var testPage;
var pageFactory = function () {
	testPage = new PageModule.Page();
	var layout = new StackLayoutModule.StackLayout();

	var label1 = new LabelModule.Label();
	label1.text = 'Label1';
	var label2 = new LabelModule.Label();
	label2.text = 'Label2';

	layout.addChild(label1);
	layout.addChild(label2);



	var webView = new webViewModule.WebView();
	webView.url = 'http://www.dn.se';


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

