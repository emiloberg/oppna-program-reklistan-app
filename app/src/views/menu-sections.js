//var RekData = require('./../shared/models/RekData');
let RekAppViewModel = require('../alt/viewmodel/RekAppViewModel');
var frameModule = require('ui/frame');

import {inspect, saveFile} from './../shared/utils/debug';

let customUiModule = require('./../shared/modules/ui');

function pageLoaded(args) {
	var page = args.object;
	let mainDataList = RekAppViewModel.appViewModel.getMainDataList();
    saveFile('maindatalist.json', JSON.stringify(mainDataList));
    page.bindingContext = mainDataList;
	saveFile('dump.json', JSON.stringify(mainDataList.items))
}

function pageNavigatedTo(args) {
	var page = args.object;
	customUiModule.topbar.setText(page, 'Startmeny');
}

function menuItemTap(args) {

    var section = args.view.bindingContext;
    frameModule.topmost().navigate({
        moduleName: "views/menu-chapters",
        context: section
    });
}


exports.menuItemTap = menuItemTap;
exports.pageLoaded = pageLoaded;
exports.pageNavigatedTo = pageNavigatedTo;


