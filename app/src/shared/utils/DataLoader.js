'use strict';

import http from 'http';
import ContentItem from '../model/ContentItem';
import RekDataList from '../viewmodel/RekDataList';
import {templatesModel} from './htmlRenderer';
//import {makeUrlSafe} from './utils';
const utils = require('./utils');
const appSettings = require('application-settings');
import {inspect, saveFile} from './debug';

function loadResources(resources, isJson) {

	// Load from local files if boolean is set to do so.
	// Used for development purposes.
	if (appSettings.getBoolean('develLocalFiles', false)) {
		const fs = require('file-system');
		const appFolder = fs.knownFolders.currentApp();

		return Promise.all(resources.map(resource => {
			let localFilePath = resource.url.split('/');
			return appFolder.getFile('dev-resources/' + localFilePath[localFilePath.length - 1]).readText()
				.then(function (data) {
					return {
						name: resource.name,
						data: (isJson) ? JSON.parse(data) : data
					};
				})
				.catch(err => {
					console.dir(err);
				});
		}));
	} else {
		return Promise.all(resources.map(resource => {
			return (isJson ? http.getJSON : http.getString)(resource.url)
			.then(data => {
					return {
						name: resource.name,
						data: data
					};
				}
			);
		}));
	}
}

function loadFiles(resources, registerWith) {
	return loadResources(resources, false)
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
		.then(mergedData => mergedData.map(section => {

				const contentSections = section.items.map(
					item => new ContentItem(item.title, item.content, item.order, item.id));

				return new RekDataList(section.title, contentSections, true, section.id);
			})
		).then(dataLists => new RekDataList('REKListan', dataLists))
		.then(dataLists => {
			loadFiles(css, 'registerCss');
			return dataLists;
		});
	}
};
export default DataLoader;

