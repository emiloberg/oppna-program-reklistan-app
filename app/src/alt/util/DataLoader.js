
import HtmlRenderer from '../../shared/utils/htmlRenderer';
import http from 'http';

import ContentItem from '../model/ContentItem';
import NavItem from '../model/NavItem';

import RekDataList from '../viewmodel/RekDataList';

import {inspect} from '../../shared/utils/debug';

const htmlRenderer = new HtmlRenderer();

function loadResources(resources, isJson) {
	return Promise.all(resources.map(resource => {
		return (isJson ? http.getJSON : http.getString)(resource.url)
		.then(data => ({
				name: resource.name,
				data: data
			})
		);
	}));
}

function loadTemplates(resources) {
	return loadResources(resources, false)
	.then(templates => {
		templates.forEach(template => {
			htmlRenderer.registerTemplate(template.name, template.data);
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

	loadViewModelFromServer(json, templates) {

		return loadTemplates(templates)
		.then(() => loadResources(json, true))
		.then(resources => resources.map(resource => {

			return resource.data.map(section => ({
				title: section.title,
				items: section.fields.map(field => {
					const content = {};
					content[resource.name] = field.children;

					return {
						title: field.value,
						content: content
					}
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
		).then(dataLists => new RekDataList('REKListan', dataLists));
	}	
};
export default DataLoader;
