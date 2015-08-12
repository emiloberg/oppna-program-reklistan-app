"use strict";

//var Observable = require('data/observable');
//var ObservableArray = require('data/observable-array');
//
///**
// * Creating an observable object,
// * see documentation: https://docs.nativescript.org/bindings.html
// *
// * Populate that observable object with an (empty) observable array.
// * This way we can modify the array (e.g. remove an item) and
// * the UI will reflect those changes (and remove if from the ui
// * as well).
// *
// * Observable objects are one of NativeScripts most fundamental parts
// * for building user interfaces as they will allow us to
// * change an object and that change gets propagated to the ui
// * without us doing anything.
// *
// */
//
//var contextArr = new ObservableArray.ObservableArray();
//var contextObj = new Observable.Observable({
//	tasks: contextArr
//});
//
//
//exports.onPageLoaded = function(args) {
//	var page = args.object;
//	page.bindingContext = contextObj;
//	/**
//	 * Simulating adding data to array after http request has returned json.
//	 * Also adding an ID to each item so that we can refer to that when we're
//	 * removing it.
// 	 */
//	contextArr.push({name: 'First Item', id: contextArr.length});
//	contextArr.push({name: 'Second Item', id: contextArr.length});
//	contextArr.push({name: 'Third Item', id: contextArr.length});
//};
//
//exports.delbutton = function(args) {
//	/**
//	 * Getting the "bindingContext" of the tapped item.
//	 * The bindingContext will contain e.g: {name: 'First Item', id: 0}
//	 */
//	var btn = args.object;
//	var tappedItemData = btn.bindingContext;
//
//	/**
//	 * Iterate through our array and if the tapped item id
//	 * is the same as the id of the id of the current iteration
//	 * then remove it.
//	 */
//	contextArr.some(function (item, index) {
//		if(item.id === tappedItemData.id) {
//			contextArr.splice(index, 1);
//		return false;
//		}
//	});
//
//};