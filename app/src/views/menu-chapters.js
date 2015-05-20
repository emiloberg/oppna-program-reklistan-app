import {inspect, saveFile} from './../shared/utils/debug';
let customUiModule = require('./../shared/modules/ui');
var frameModule = require('ui/frame');

let page;

function pageLoaded(args) {

}

function pageNavigatedTo(args) {
	page = args.object;
	customUiModule.topbar.setText(page, page.navigationContext.title);
	page.bindingContext = page.navigationContext;
}


function menuItemTap(args) {
	frameModule.topmost().navigate({
		moduleName: "views/details",
		context: {
			item: args.view.bindingContext,
			selectedIndex: page.bindingContext.selectedIndex
		}
	});

//	var section = args.view.bindingContext;
////	inspect(section);
//	let templatesContent = templatesViewModel.templates.filter(template => template.name === 'drugs')[0].content;
////	inspect(templatesContent);
////	inspect(handlebars);
////	inspect(args.view.bindingContext);
//
//
//	var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
//		"{{kids.length}} kids:</p>" +
//		"<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
//	var template = handlebars.compile(source);
//
//	var data = { "name": "Alan", "hometown": "Somewhere, TX",
//		"kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
//	var result = template(data);
//
//	inspect(result);
//
//	//inspect(handlebars);

}


module.exports.pageLoaded = pageLoaded;
module.exports.pageNavigatedTo = pageNavigatedTo;
module.exports.menuItemTap = menuItemTap;
