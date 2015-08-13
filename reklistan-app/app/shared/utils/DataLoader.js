'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fileSystem = require('file-system');

var _fileSystem2 = _interopRequireDefault(_fileSystem);

var _modelContentItem = require('../model/ContentItem');

var _modelContentItem2 = _interopRequireDefault(_modelContentItem);

var _viewmodelRekDataList = require('../viewmodel/RekDataList');

var _viewmodelRekDataList2 = _interopRequireDefault(_viewmodelRekDataList);

var _htmlRenderer = require('./htmlRenderer');

var _debug = require('./debug');

var _remoteimages = require('./remoteimages');

var _remoteimages2 = _interopRequireDefault(_remoteimages);

var _Errors = require('./Errors');

var _Errors2 = _interopRequireDefault(_Errors);

var utils = require('./utils');

var DOCUMENTS_FOLDER = _fileSystem2['default'].knownFolders.documents().getFolder('rekcache');

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
	return Promise.all(resources.map(function (resource) {
		var localFilePath = _fileSystem2['default'].path.join(DOCUMENTS_FOLDER.path, resource.localFileName);
		if (resource.download) {
			// If force download
			(0, _debug.debug)('Getting server resource: ' + resource.name + ' - ' + resource.url);
			return downloadResource(resource, isJson);
		} else {
			(0, _debug.debug)('Getting local resource: ' + resource.name + ' - ' + resource.url);
			if (_fileSystem2['default'].File.exists(localFilePath)) {
				// If file exist
				var localFile = DOCUMENTS_FOLDER.getFile(resource.localFileName);
				try {
					return localFile.readText().then(function (content) {
						(0, _debug.debug)('Loading local data: ' + resource.name);
						var outStr = undefined;
						try {
							outStr = isJson ? JSON.parse(content) : content;
							var dataOut = {
								name: resource.name,
								data: outStr,
								loadedFrom: 'local'
							};
							(0, _debug.debug)('Success loading local data: ' + resource.name + ' ' + resource.url);
							return Promise.resolve(dataOut);
						} catch (err) {
							(0, _debug.debug)('Error loading local data: ' + resource.name + ' ' + resource.url);
							return downloadResource(resource, isJson);
						}
					}, function () {
						throw 'Could not read file';
					});
				} catch (error) {
					return downloadResource(resource, isJson);
				}
			} else {
				// If not file exists, download it
				return downloadResource(resource, isJson);
			}
		}
	}));
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
	return _http2['default'].request({ url: resource.url, method: 'GET' }).then(function (data) {
		if (data.statusCode >= 200 && data.statusCode < 300) {
			(0, _debug.debug)('Downloaded file: ' + resource.name + ' - ' + resource.url);
			var localFile = DOCUMENTS_FOLDER.getFile(resource.localFileName);
			localFile.writeText(data.content.toString()).then(function () {
				(0, _debug.debug)('Saved file ' + _fileSystem2['default'].path.join(DOCUMENTS_FOLDER.path, resource.localFileName));
			}, function (error) {
				//Silent error
				(0, _debug.debug)(error, 'error');
				(0, _debug.debug)('Error saving file ' + _fileSystem2['default'].path.join(DOCUMENTS_FOLDER.path, resource.localFileName), 'error');
			});
			(0, _debug.debug)('Success loading server data: ' + resource.name + ' ' + resource.url);
			return {
				name: resource.name,
				data: isJson ? data.content.toJSON() : data.content.toString(),
				loadedFrom: 'server'
			};
		} else {
			var errMsg = 'Could not download ' + resource.url + ' [StatusCode: ' + data.statusCode + ']';
			(0, _debug.debug)(errMsg, 'error');
			throw new _Errors2['default'].HTTPGENERIC(errMsg);
		}
	})['catch'](function (err) {
		throw new _Errors2['default'].HTTPGENERIC(err);
	});
}

function loadFiles(resources, registerWith) {
	return loadResources(resources, false).then(function (templates) {
		return templates;
	}).then(function (templates) {
		templates.forEach(function (template) {
			_htmlRenderer.templatesModel[registerWith](template.name, template.data);
		});
	});
}

function mergeArrays(target, source, locator, merger) {
	var insertIndex = 0;

	for (var i = 0; i < source.length; ++i) {
		var sourceItem = source[i];
		var targetIndex = locator(target, sourceItem);

		if (targetIndex === -1) {
			target.splice(insertIndex++, 0, sourceItem);
		} else {
			merger(target[targetIndex], sourceItem);
			insertIndex = targetIndex + 1;
		}
	}

	return target;
}

var DataLoader = {
	loadViewModel: function loadViewModel(spec) {
		return loadFiles(spec.templates, 'registerTemplate').then(function () {
			return loadResources(spec.json, true);
		}).then(function (resources) {
			return resources.map(function (resource) {
				return resource.data.map(function (section) {
					return {
						title: section.title,
						id: utils.makeUrlSafe(section.title),
						items: section.fields.map(function (field, fieldIndex) {
							if (field.value) {
								// has heading
								var content = {};
								content[resource.name] = _htmlRenderer.templatesModel.processTemplate(resource.name, {
									fields: [field], // hbs template is expecting content in fields[].
									isMobile: true
								});

								var order = {};
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
						}).filter(function (item) {
							return item !== null;
						}) // remove entries without headings (empty ones)
					};
				});
			});
		}).then(function (trees) {
			return trees.reduce(function (target, source) {
				return mergeArrays(target, source, function (haystack, needle) {
					return haystack.map(function (e) {
						return e.title;
					}).indexOf(needle.title);
				}, function (targetItem, sourceItem) {
					mergeArrays(targetItem.items, sourceItem.items, function (haystack, needle) {
						return haystack.map(function (e) {
							return e.title;
						}).indexOf(needle.title);
					}, function (innerTargetItem, innerSourceItem) {
						Object.keys(innerSourceItem.content).forEach(function (key) {
							innerTargetItem.content[key] = innerSourceItem.content[key];
							innerTargetItem.order[key] = innerSourceItem.order[key];
						});
					});
				});
			});
		}).then(function (mergedData) {
			if (global.REK.dev.clearImageFolder) {
				(0, _debug.debug)('Clearing Image Folder');
				_remoteimages2['default'].clearImageFolder();
			}
			return mergedData;
		}).then(function (mergedData) {
			_remoteimages2['default'].initKnownImages();
			return mergedData;
		}).then(function (mergedData) {
			mergedData.map(function (section) {
				return section.items;
			}).reduce(function (a, b) {
				return a.concat(b);
			}, []).map(function (item) {
				return item.content;
			}).forEach(function (contentSection) {
				Object.keys(contentSection).forEach(function (key) {
					// Getting the data-remotesrc value. This is the original url set in htmlRenderer.
					var reSrc = /data\-remotesrc=[\"\']([^\"\']+)[\"\']/g;
					var match = undefined;
					while (match = reSrc.exec(contentSection[key])) {
						//eslint-disable-line
						_remoteimages2['default'].queueImageForDownload({
							url: global.REK.preferences.host + match[1],
							filename: utils.makeUrlSafe(match[1])
						});
					}
				});
			});
			return mergedData;
		}).then(function (mergedData) {
			return mergedData.map(function (section) {
				var contentSections = section.items.map(function (item) {
					return new _modelContentItem2['default'](item.title, item.content, item.order, item.id);
				});

				return new _viewmodelRekDataList2['default'](section.title, contentSections, true, section.id);
			});
		}).then(function (dataLists) {
			return new _viewmodelRekDataList2['default']('REKListan', dataLists);
		}).then(function (dataLists) {
			loadFiles(spec.css, 'registerCss');
			return dataLists;
		});
	}
};
exports['default'] = DataLoader;
module.exports = exports['default'];