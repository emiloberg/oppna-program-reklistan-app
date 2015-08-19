'use strict';

import http from 'http';
import fs from 'file-system';
import ContentItem from '../model/ContentItem';
import ResourceArticle from '../model/ResourceArticle';
import NewsArticle from '../model/NewsArticle';
import RekDataList from '../viewmodel/RekDataList';
import ResourceArticles from '../viewmodel/ResourceArticles';
import News from '../viewmodel/News';
import {templatesModel} from './htmlRenderer';
const utils = require('./utils');
import {inspect, debug} from './debug';
import RemoteImages from './remoteimages';
import REKError from './Errors';

const DOCUMENTS_FOLDER = fs.knownFolders.documents().getFolder('rekcache');

/**
 * Loads a resource (json/handlebars/css file), from local storage if available, else load
 * from the interwebs. If `download` param is set to true; force download from the net.
 *
 * @param {Object[]} resources
 * @param {string} resources.name Resource name
 * @param {string} resources.localFileName Resource local file name for loading/saving locally
 * @param {string} resources.url Full url to download resource from
 * @param {boolean} resources.download Force download (or get from local if available)
 * @param {boolean} isJson Is JSON and therefor parse
 * @returns {Promise}
 */
function loadResources(resources, isJson) {

	return Promise.all(resources.map(resource => {
		const localFilePath = fs.path.join(DOCUMENTS_FOLDER.path, resource.localFileName);
		if (resource.download) { // If force download
			debug('Get from server (force download): ' + utils.getLastSlugFromPath(resource.url));
			return downloadResource(resource, isJson);
		} else {
			if(fs.File.exists(localFilePath)) { // If file exist
				debug('Get from local: ' + utils.getLastSlugFromPath(resource.url));
				let localFile = DOCUMENTS_FOLDER.getFile(resource.localFileName);
				try {
					return localFile.readText()
					.then(function (content) {
						let outStr;
						try {
							outStr = (isJson) ? JSON.parse(content) : content;
							let dataOut = {
								name: resource.name,
								data: outStr,
								loadedFrom: 'local'
							};
							debug('Success get from local: ' + utils.getLastSlugFromPath(resource.url));
							return Promise.resolve(dataOut);
						} catch(err) {
							debug('ERROR get from local, will download instead: ' + utils.getLastSlugFromPath(resource.url), 'error');
							return downloadResource(resource, isJson);
						}
					}, function () {
						throw 'Could not read file';
					});
				} catch (error) {
					debug('ERROR parsing local, will download instead: ' + utils.getLastSlugFromPath(resource.url), 'error');
					return downloadResource(resource, isJson);
				}
			} else { // If not file exists, download it
				debug('Get from server: ' + utils.getLastSlugFromPath(resource.url));
				return downloadResource(resource, isJson);
			}
		}
	}));
}


function saveResourceFile(filename, content) {
	let localFile = DOCUMENTS_FOLDER.getFile(filename);
	localFile.writeText(content)
		.then(() => {
			debug('Sucess saved file ' + filename);
		}, (error) => {
			//Silent error
			debug(error, 'error');
			debug('ERROR saved file ' + filename, 'error');
		});
}

/**
 * Download a resource (json/handlebars/css file) from the interwebs.
 *
 * @param {Object} resource
 * @param {string} resource.name Resource name
 * @param {string} resource.localFileName Resource local file name for loading/saving locally
 * @param {string} resource.url Full url to download resource from
 * @param {boolean} resource.download Force download (or get from local if available)
 * @param {boolean} isJson Is JSON and therefor parse
 * @returns {Promise}
 */
function downloadResource(resource, isJson) {
	return http.request({url: resource.url, method: 'GET'})
		.then(data => {
			if (data.statusCode >= 200 && data.statusCode < 300) {
				let localFile = DOCUMENTS_FOLDER.getFile(resource.localFileName);
				if (fs.File.exists(localFile.path)) {
					localFile.remove()
						.then(function () {
							// Success removing the file.
							debug('Removed local file ' + resource.localFileName);
							saveResourceFile(resource.localFileName, data.content.toString())
						}, function (err) {
							debug('Could not remove local file ' + resource.localFileName, 'error');
							debug(err);
							saveResourceFile(resource.localFileName, data.content.toString())
						});
				} else {
					saveResourceFile(resource.localFileName, data.content.toString())
				}

				return {
					name: resource.name,
					data: isJson ? data.content.toJSON() : data.content.toString(),
					loadedFrom: 'server'
				};
			} else {
				let errMsg = 'ERROR get from download ' + resource.url + ' [StatusCode: ' + data.statusCode + ']';
				debug(errMsg, 'error');
				throw new REKError.HTTPGENERIC(errMsg);
			}
		})
		.catch(err => {
			throw new REKError.HTTPGENERIC(err);
		});
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

	loadNews(spec) {
		debug('Start Loading News');
		return loadResources(spec, true)
		.then(allNews => {
			const newsArticles = allNews[0].data.map(article => {
				let fieldOut = {
					uuid: article.uuid,
					title: article.title,
					body: '',
					externallink: '',
					medium: '',
					lead: '',
					date: '2010-01-01'
				};
				article.fields.forEach(field => {
					fieldOut[field.name] = field.value
				});

				if (fieldOut.medium.indexOf('both') > 0  || fieldOut.medium.indexOf('mobile') > 0) { // Only include news targeted to mobile.
					return new NewsArticle(fieldOut.uuid, fieldOut.title, fieldOut.body, fieldOut.externallink, fieldOut.lead, fieldOut.date);
				} else {
					return undefined;
				}
			});
			return News.addAll(newsArticles);
		});
	},


	loadViewModel(spec) {
		return loadFiles(spec.templates, 'registerTemplate')

		// Fetch Support JSONs
		.then(() => loadResources(spec.supportJson, true))

		// Mangle and populate support JSONs
		.then(supportResources => {
			supportResources.forEach(resource => {
				if(resource.name === 'resources') { // Resource Articles
					const resourceArticles = resource.data.map(article => {
						let fieldOut = {
							uuid: article.uuid,
							title: article.title,
							body: '',
							externallink: '',
							sortOrder: 0
						};
						article.fields.forEach(field => {
							fieldOut[field.name] = field.value
						});
						return new ResourceArticle(fieldOut.uuid, fieldOut.title, fieldOut.body, fieldOut.externallink, fieldOut.sortOrder);
					});
					ResourceArticles.addAll(resourceArticles);
				}
			});
		})

		// Load Data JSON
		.then(() => loadResources(spec.json, true))
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
		.then(mergedData => {
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
			loadFiles(spec.css, 'registerCss');
			return dataLists;
		});
	}
};
export default DataLoader;

