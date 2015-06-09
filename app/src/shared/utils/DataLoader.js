'use strict';

import http from 'http';
import fs from 'file-system';
import ContentItem from '../model/ContentItem';
import RekDataList from '../viewmodel/RekDataList';
import {templatesModel} from './htmlRenderer';
const utils = require('./utils');
import {inspect, saveFile, debug} from './debug';
import RemoteImages from './remoteimages';
const appSettings = require('application-settings');

import REKError from './Errors';


function loadResources(resources, isJson) {

	//// Load from local files if boolean is set to do so.
	//// Used for development purposes.
	//if (appSettings.getBoolean('develLocalFiles', false)) {
	//	const appFolder = fs.knownFolders.currentApp();
	//
	//	return Promise.all(resources.map(resource => {
	//		return appFolder.getFile('dev-resources/' + resource.develName).readText()
	//			.then(function (data) {
	//				return {
	//					name: resource.name,
	//					data: (isJson) ? JSON.parse(data) : data
	//				};
	//			})
	//			.catch(err => {
	//				console.dir(err);
	//			});
	//	}));
	//} else {

	/*
	 http.request({ url: "https://httpbin.org/get", method: "GET" }).then(function (response) {
	 // Argument (response) is HttpResponse!
	 var statusCode = response.statusCode;
	 }, function (e) {
	 // Argument (e) is Error!
	 });
	 */



		return Promise.all(resources.map(resource => {
			debug('Load resource: ' + resource.name + ' - ' + resource.url);
			return http.request({ url: resource.url, method: 'GET' })
			.then(data => {
				if (data.statusCode >= 200 && data.statusCode < 300) {
					debug('Success: ' + resource.name + ' - ' + resource.url);
					return {
						name: resource.name,
						data: isJson ? data.content.toJSON() : data.content.toString()
					};
				} else {
					let errMsg = 'Could not download ' + resource.url + ' [StatusCode: ' + data.statusCode + ']';
					debug(errMsg, 'error');
					throw new REKError.HTTPGENERIC(errMsg);
				}
			})
			.catch(err => {
				throw new REKError.HTTPGENERIC(err);
			});
		}));
	//}
}

function loadFiles(resources, registerWith) {
	return loadResources(resources, false)
	.then(templates => {
		return templates;
	})
	.then(templates => {
		templates.forEach(template => {
			templatesModel[registerWith](template.name, template.data);
		});
	});
}

function mergeArrays(target, source, locator, merger) {
	let insertIndex = 0;

	for (let i = 0; i < source.length; ++i) {
		const sourceItem = source[i];
		const targetIndex = locator(target, sourceItem);

		if (targetIndex === -1) {
			target.splice(insertIndex++, 0, sourceItem);
		} else {
			merger(target[targetIndex], sourceItem);
			insertIndex = targetIndex + 1;
		}
	}

	return target;
}


const DataLoader = {

	loadViewModelFromServer(json, templates, css) {

		return loadFiles(templates, 'registerTemplate')
		.then(() => loadResources(json, true))
		.then(resources => resources.map(resource => {
			return resource.data.map(section => {
				return {
					title: section.title,
					id: utils.makeUrlSafe(section.title),
					items: section.fields.map((field, fieldIndex) => {
						if (field.value) { // has heading
							const content = {};
							content[resource.name] = templatesModel.processTemplate(resource.name, {
								fields: [field], // hbs template is expecting content in fields[].
								isMobile: true
							});

							const order = {};
							order[resource.name] = fieldIndex;
							return {
								title: field.value,
								content: content,
								order: order,
								id: utils.makeUrlSafe(field.value)
							};
						} else {
							return null;
						}
					})
					.filter(item => item !== null) // remove entries without headings (empty ones)
				};
			});
		}))
		.then(trees => trees.reduce((target, source) =>
				mergeArrays(target, source,
					(haystack, needle) =>
						haystack.map(e => e.title).indexOf(needle.title),
					(targetItem, sourceItem) => {
						mergeArrays(targetItem.items, sourceItem.items,
							(haystack, needle) =>
								haystack.map(e => e.title).indexOf(needle.title),
							(innerTargetItem, innerSourceItem) => {
								Object.keys(innerSourceItem.content).forEach(key => {
									innerTargetItem.content[key] = innerSourceItem.content[key];
									innerTargetItem.order[key] = innerSourceItem.order[key];
								});
							}
						);
				})
			)
		)
		.then(mergedData => { // Todo, remove for production
			if (global.REK.dev.clearImageFolder) {
				debug('Clearing Image Folder');
				RemoteImages.clearImageFolder();
			}
			return mergedData;
		})
		.then(mergedData => {
			RemoteImages.initKnownImages();
			return mergedData;
		})
		.then(mergedData => {
			mergedData
				.map(section => section.items)
				.reduce((a, b) => a.concat(b), [])
				.map(item => item.content)
				.forEach(contentSection => {
					Object.keys(contentSection).forEach(key => {
						// Getting the data-remotesrc value. This is the original url set in htmlRenderer.
						const reSrc = /data\-remotesrc=[\"\']([^\"\']+)[\"\']/g;
						let match;
						while (match = reSrc.exec(contentSection[key])) {  //eslint-disable-line
							RemoteImages.queueImageForDownload({
								url: global.REK.preferences.host + match[1],
								filename: utils.makeUrlSafe(match[1])
							});
						}
					});
				});
			return mergedData;
		})
		.then(mergedData => mergedData.map(section => {
			const contentSections = section.items.map(
				item => new ContentItem(item.title, item.content, item.order, item.id));

			return new RekDataList(section.title, contentSections, true, section.id);
		}))
		.then(dataLists => new RekDataList('REKListan', dataLists))
		.then(dataLists => {
			loadFiles(css, 'registerCss');
			return dataLists;
		});
		//}).catch(err => {
		//		return err;
		//	console.log(err);
		//	console.log('SOMETHING WENT WRONG'); // todo better
		//});
	}
};
export default DataLoader;

