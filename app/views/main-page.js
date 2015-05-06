

var frameModule = require("ui/frame");
var labelModule = require("ui/label");
var pageModule = require("ui/page");

var rekdata = require('./../shared/controllers/rekdata');

var pageLoaded = function(args) {
	var page = args.object;
	page.bindingContext = {
		firstLink: "First",
		secondLink: "Second"
	};
	console.log('pageLoaded CALLED');
	rekdata.getJSONData();
};


exports.pageLoaded = pageLoaded;


function navigateAway() {
	console.log('navigateAway');
	frameModule.topmost().navigate("views/second-page");
}
exports.navigateAway = navigateAway;






var factoryFunc = function () {
	var label = new labelModule.Label();
	label.text = "Hello, world!";
	var page = new pageModule.Page();
	page.content = label;
	return page;
};

function navigate2() {
	frameModule.topmost().navigate(factoryFunc);
}
exports.navigate2 = navigate2;



