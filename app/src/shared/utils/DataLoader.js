'use strict';

import http from 'http';
import ContentItem from '../model/ContentItem';
import RekDataList from '../viewmodel/RekDataList';
import {templatesModel} from './htmlRenderer';
//import {inspect, saveFile} from './debug';

function loadResources(resources, isJson) {
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

			return resource.data.map(section => ({
				title: section.title,
				items: section.fields.map(field => {
					const content = {};
					content[resource.name] = templatesModel.processTemplate(resource.name, {
						fields: [field], // hbs template is expecting content in fields[].
						isMobile: true
					});
					return {
						title: field.value,
						content: content
					};
				})
			}));
		}))
		// .then process templates and store HTML in content objects directly??
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
								});
							}
						);
				})
			)
		)
		.then(mergedData => mergedData.map(section => {

				const contentSections = section.items.map(
					item => new ContentItem(item.title, item.content));

				return new RekDataList(section.title, contentSections);
			})
		).then(dataLists => new RekDataList('REKListan', dataLists))
		.then(dataLists => {
			loadFiles(css, 'registerCss');
			return dataLists;
		});
	}
};
export default DataLoader;

