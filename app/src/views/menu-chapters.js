let RekData = require('./../shared/models/RekData');
import {inspect, saveFile} from './../shared/utils/debug';
let customUiModule = require('./../shared/modules/ui');

//let htmlRenderer = require('./../shared/utils/htmlRenderer');

//import {templatesViewModel} from './../alt/viewmodel/Templates'

//let handlebars = require('./../node_modules/handlebars/dist/handlebars');

function pageLoaded(args) {
//	const page = args.object;
//	console.log('Chapters Page Loaded');
//	page.bindingContext = RekData.getSubmenu();	
}

function pageNavigatedTo(args) {
	var page = args.object;
    page.bindingContext = page.navigationContext;
	customUiModule.topbar.setText(page, page.navigationContext.title);
}


function menuItemTap(args) {

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
