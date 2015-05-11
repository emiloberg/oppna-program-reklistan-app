var MainMenu = require('./../shared/models/MainMenu');
var frameModule = require('ui/frame');

function pageNavigatedTo(args) {
	var page = args.object;
	var selected = MainMenu.getSelected();
	//page.bindingContext = page.bindingContext || {};
	page.bindingContext = selected;
	//page.bindingContext = {
	//	title: 'Apa'
	//};

	//Object.keys(page.bindingContext).forEach(function (key) {
	//	console.log(key + ': ' + temp[key]);
	//});
	//console.log('------');
	//var temp = MainMenu.getSelected();
	//Object.keys(temp).forEach(function (key) {
	//	console.log(key + ': ' + temp[key]);
	//});



	// TODO, Implement for Android
	if (page.ios) {
		// Change the UIViewController's title property
		page.ios.title = selected.title;

		// Get access to the native iOS UINavigationController
		var controller = frameModule.topmost().ios.controller;

		// Call the UINavigationController's setNavigationBarHidden method
		controller.navigationBarHidden = false;
	}
}
exports.pageNavigatedTo = pageNavigatedTo;
