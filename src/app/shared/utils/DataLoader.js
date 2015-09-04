'use strict';

import http from 'http';
import fs from 'file-system';
import ContentItem from '../model/ContentItem';
import ResourceArticle from '../model/ResourceArticle';
import NewsArticle from '../model/NewsArticle';
import RekDataList from '../viewmodel/RekDataList';
import ResourceArticles from '../viewmodel/ResourceArticles';
import Metadata from '../viewmodel/Metadata';
import News from '../viewmodel/News';
import {templatesModel} from './htmlRenderer';
import * as utils from './utils';
import {debug} from './debug';
import RemoteImages from './remoteimages';
import REKError from './Errors';
import * as connectivity from 'connectivity';
import * as appSettings from 'application-settings';

const DOCUMENTS_FOLDER = fs.knownFolders.documents().getFolder('rekcache');
let hasLoadedNewServerData = false;

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
			debug('Get from server (force download): ' + resource.localFileName);
			return downloadResource(resource, isJson);
		} else {
			if (fs.File.exists(localFilePath)) { // If file exist
				debug('Get from local: ' + resource.localFileName);
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
								debug('Success get from local: ' + resource.localFileName);
								return Promise.resolve(dataOut);
							} catch (err) {
								debug('ERROR get from local, will download instead: ' + resource.localFileName, 'error');
								return downloadResource(resource, isJson);
							}
						}, function () {
							throw 'Could not read file';
						});
				} catch (error) {
					debug('ERROR parsing local, will download instead: ' + resource.localFileName, 'error');
					return downloadResource(resource, isJson);
				}
			} else { // If not file exists, download it
				debug('Get from server: ' + resource.localFileName);
				return downloadResource(resource, isJson);
			}
		}
	}));
}

function saveResourceFile(filename, content) {
	let localFile = DOCUMENTS_FOLDER.getFile(filename);
	localFile.writeText(content)
		.then(() => {
			debug('Success saved file ' + filename);
		}, (error) => {
			//Silent error
			debug(error, 'error');
			debug('ERROR saved file ' + filename, 'error');
		});
}

function checkConnectivity(forceDownload) {
	return new Promise((resolve, reject) => {
		if (forceDownload && connectivity.getConnectionType() === connectivity.connectionType.none) {
			reject('NO_NETWORK');
		} else {
			resolve();
		}
	});
}

/**
 * Takes a html content, searches it for images (with 'data-remotesrc™ set)
 * and queues all images for download.
 *
 * @param {string} content HTML content
 */
function findAndQueueImagesDownload(content) {
	// Getting the data-remotesrc value. This is the original url set in htmlRenderer.
	const reSrc = /data\-remotesrc=[\"\']([^\"\']+)[\"\']/g;
	let match;
	while (match = reSrc.exec(content)) {  //eslint-disable-line
		RemoteImages.queueImageForDownload({
			url: global.REK.preferences.host + match[1],
			filename: utils.makeUrlSafe(match[1])
		});
	}
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
	return http.request({
		url: resource.url + '?buster=' + new Date().getTime(),
		method: 'GET',
		timeout: 15 * 1000
	})
		.then(data => {
			if (data.statusCode >= 200 && data.statusCode < 300) {
				let localFile = DOCUMENTS_FOLDER.getFile(resource.localFileName);
				if (fs.File.exists(localFile.path)) {
					localFile.remove()
						.then(function () {
							// Success removing the file.
							debug('Removed local file ' + resource.localFileName);
							saveResourceFile(resource.localFileName, data.content.toString());
						}, function (err) {
							debug('Could not remove local file ' + resource.localFileName, 'error');
							debug(err);
							saveResourceFile(resource.localFileName, data.content.toString());
						});
				} else {
					saveResourceFile(resource.localFileName, data.content.toString());
				}

				if (resource.name !== 'news') { // Set the last updated to now for everything but news.
					hasLoadedNewServerData = true;
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

/**
 * Advice articles can be links to other articles,
 * find out if this is one of those articles.
 *
 * returns false if it's a "normal" article, else it
 * returns the "url" (e.g. advice/Fysisk_aktivitet/Fysisk_aktivitet_pa_recept_(FaR))
 * to the article it links to.
 *
 * @param {object} content
 * @returns {boolean|string}
 */
function findLinkToArticle(content) {
	let foundLinkToArticle;
	const hasLinkToArticle = content.children.some(field => {
		if (field.name) {
			if (field.name === 'linktoarticle') {
				if (field.value.length > 0) {
					foundLinkToArticle = field.value;
					return true;
				}
			}
		}
		return false;
	});

	if (hasLinkToArticle) {
		return foundLinkToArticle;
	} else {
		return false;
	}
}

function createDataLocation(locations, forceDownload) {
	const urlPart1 = `${global.REK.preferences.host}/api/jsonws/skinny-web.skinny/get-skinny-journal-articles/company-id/${locations.companyId}/group-name/${locations.groupName}/ddm-structure-id/`;
	const urlPart2 = `/locale/${locations.locale}`;

	global.REK.news = {
		name:          'news',
		localFileName: 'news.json',
		url:           urlPart1 + locations.newsStructureId + urlPart2,
		download:      true
	};

	const dataLocation = {
		forceDownload: forceDownload,
		supportJson:   [{
			name:          'resources',
			localFileName: 'resources.json',
			url:           urlPart1 + locations.resourcesStructureId + urlPart2,
			download:      forceDownload
		}],

		json: [{
			name:          'drugs',
			localFileName: 'drugs.json',
			url:           urlPart1 + locations.drugsStructureId + urlPart2,
			download:      forceDownload
		}, {
			name:          'advice',
			localFileName: 'advice.json',
			url:           urlPart1 + locations.adviceStructureId + urlPart2,
			download:      forceDownload
		}],

		templates: [{
			name:          'drugs',
			localFileName: 'details-drugs.hbs',
			url:           global.REK.preferences.host + '/reklistan-theme/handlebars/details-drugs.hbs',
			download:      forceDownload
		}, {
			name:          'advice',
			localFileName: 'details-advice.hbs',
			url:           global.REK.preferences.host + '/reklistan-theme/handlebars/details-advice.hbs',
			download:      forceDownload
		}],

		css: [{
			name:          'custom',
			localFileName: 'custom.css',
			url:           global.REK.preferences.host + '/reklistan-theme/css/custom.css?browserId=other&themeId=reklistantheme_WAR_reklistantheme&languageId=en_US&b=6210',
			download:      forceDownload
		}],

		inAppResources: [{
			name:          'appDetailsJs',
			localFileName: 'app-details.js',
			url:           global.REK.preferences.host + '/reklistan-theme/resources/app-details.js',
			download:      forceDownload
		}]
	};

	debug('dataLocation\n' + JSON.stringify(dataLocation, null, '  '));

	return dataLocation;
}

const DataLoader = {
	getDataLocation(forceDownload) {
		return new Promise((resolve, reject) => {
			let dataLocation = {
				companyId:            appSettings.getNumber('companyId', 0),
				groupName:            appSettings.getString('groupName', ''),
				drugsStructureId:     appSettings.getNumber('drugsStructureId', 0),
				adviceStructureId:    appSettings.getNumber('adviceStructureId', 0),
				resourcesStructureId: appSettings.getNumber('resourcesStructureId', 0),
				newsStructureId:      appSettings.getNumber('newsStructureId', 0),
				locale:               appSettings.getString('locale', '')
			};

			const hasAllData = Object.keys(dataLocation).every(key => {
				return (dataLocation[key] !== '' && dataLocation[key] !== 0);
			});

			if (hasAllData && !forceDownload) {
				debug('Got local dataLocation');
				resolve(createDataLocation(dataLocation, forceDownload));
			} else {
				debug('Getting from server server dataLocation');
				http.request({
					url: global.REK.urlDataLocation + '?buster=' + new Date().getTime(),
					method: 'GET',
					timeout: 15 * 1000
				})
				.then(data => {
					try {
						dataLocation = data.content.toJSON();
						appSettings.setNumber('companyId', dataLocation.companyId);
						appSettings.setString('groupName', dataLocation.groupName);
						appSettings.setNumber('drugsStructureId', dataLocation.drugsStructureId);
						appSettings.setNumber('adviceStructureId', dataLocation.adviceStructureId);
						appSettings.setNumber('resourcesStructureId', dataLocation.resourcesStructureId);
						appSettings.setNumber('newsStructureId', dataLocation.newsStructureId);
						appSettings.setString('locale', dataLocation.locale);
						debug('Success get from server dataLocation');
						resolve(createDataLocation(dataLocation, forceDownload));
					} catch (err){
						debug('Fail reading dataLocation got from server', 'error');
						debug(err);
						reject('Fail reading dataLocation got from server');
					}
				})
				.catch((err) => {
					debug('Fail getting from server dataLocation', 'error');
					debug(err);
					reject('Fail getting from server dataLocation');
				});
			}
		});
	},

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
						fieldOut[field.name] = field.value;
					});

					fieldOut.body = utils.rewriteHTML(fieldOut.body);
					findAndQueueImagesDownload(fieldOut.body);

					if (fieldOut.medium.indexOf('both') > 0 || fieldOut.medium.indexOf('mobile') > 0) { // Only include news targeted to mobile.
						return new NewsArticle(fieldOut.uuid, fieldOut.title, fieldOut.body, fieldOut.externallink, fieldOut.lead, fieldOut.date);
					} else {
						return undefined;
					}
				});
				return News.addAll(newsArticles);
			});
	},

	loadViewModel(spec) {
		hasLoadedNewServerData = false;

		// Check connectivity
		return checkConnectivity(spec.forceDownload)

			// Init known images
			.then(() => RemoteImages.initKnownImages())

			// Get in-app resources
			.then(() => loadFiles(spec.inAppResources, 'registerInAppResource'))

			// Get templates
			.then(() => loadFiles(spec.templates, 'registerTemplate'))

			// Fetch Support JSONs
			.then(() => loadResources(spec.supportJson, true))

			// Mangle and populate support JSONs
			.then(supportResources => {
				supportResources.forEach(resource => {
					if (resource.name === 'resources') { // Resource Articles
						const resourceArticles = resource.data.map(article => {
							let fieldOut = {
								uuid: article.uuid,
								title: article.title,
								body: '',
								externallink: '',
								sortOrder: 0,
								medium: 'mobile' // This field is added later on, therefor if article is not updated with the new field, set default to display anyways.
							};
							article.fields.forEach(field => {
								fieldOut[field.name] = field.value;
							});

							fieldOut.body = utils.rewriteHTML(fieldOut.body);
							findAndQueueImagesDownload(fieldOut.body);

							if (fieldOut.medium.indexOf('both') > 0 || fieldOut.medium.indexOf('mobile') > 0) { // Only include news targeted to mobile.
								return new ResourceArticle(fieldOut.uuid, fieldOut.title, fieldOut.body, fieldOut.externallink, fieldOut.sortOrder);
							} else {
								return undefined;
							}
						});
						ResourceArticles.addAll(resourceArticles);
					}
				});
			})

			// Load CSS
			.then(() => loadFiles(spec.css, 'registerCss'))

			// Load Data JSON
			.then(() => loadResources(spec.json, true))
			.then(resources => resources.map(resource => {
				return resource.data.map(section => {
					return {
						title: section.title,
						id: utils.makeUrlSafe(section.title),
						items: section.fields.map((field, fieldIndex) => {
							if (field.value) { // has heading
								const linkToOtherArticle = findLinkToArticle(field);
								const content = {};

								if (linkToOtherArticle) {
									content[resource.name] = linkToOtherArticle
								} else {
									content[resource.name] = templatesModel.processTemplate(resource.name, {
										fields:   [field], // hbs template is expecting content in fields[].
										isMobile: true
									});
								}

								const linkObj = {};
								linkObj[resource.name] = linkToOtherArticle ? true : false;

								const order = {};
								order[resource.name] = fieldIndex;
								return {
									title: field.value,
									content: content,
									order: order,
									id: utils.makeUrlSafe(field.value),
									linkToArticle: linkObj
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
										innerTargetItem.linkToArticle[key] = innerSourceItem.linkToArticle[key];
									});
								}
							);
						})
				)
			)

			// Download all Drugs/Advice images
			.then(mergedData => {
				mergedData
					.map(section => section.items)
					.reduce((a, b) => a.concat(b), [])
					.map(item => item.content)
					.forEach(contentSection => {
						Object.keys(contentSection).forEach(key => {
							findAndQueueImagesDownload(contentSection[key]);
						});
					});
				return mergedData;
			})
			.then(mergedData => mergedData.map(section => {
				const contentSections = section.items.map(item => {
					return new ContentItem(item.title, item.content, item.order, item.id, item.linkToArticle);
				});
				return new RekDataList(section.title, contentSections, true, section.id);
			}))
			.then(dataLists => new RekDataList('REKListan', dataLists))
			.then(dataLists => {
				if (hasLoadedNewServerData === true) {
					Metadata.setDataUpdatedNow();
				}
				return dataLists;
			});
	}
};

export default DataLoader;
