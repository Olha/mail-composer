/**
 * Created by olha on 26.11.15.
 */

dnd.factory('TemplateProjectStore', function (DndResource, $rootScope) {
	'use strict';
	var template = {};

	var list = {};

	var flag = 'project';

	template.getFlag = function () {
		return flag;
	};

	template.init = function () {
		DndResource.getProjectPostTemplates().then(function (data) {
			list = angular.copy({});
			$.map(data, function (dropzone, i) {
				template.setTemplate(dropzone.id, dropzone.name, dropzone.structure);
			});
			$rootScope.$emit('readyTemplateProjectStore');
		}, function () {});
	};

	template.init();

	template.getAllTemplates = function () {
		return list;
	};

	template.getAllInfoTemplates = function () {
		var infoTemplates = {};
		$.map(list, function (item, key) {
			infoTemplates[key] = {
				'name': item.name,
				'id': item.id
			}
		});
		return infoTemplates;
	};

	template.getTemplate = function (idTemplate) {
		var projectId = flag + idTemplate;
		return list[projectId];
	};

	template.setTemplate = function (idTemplate, nameTemplate, structureTemplate) {
		var projectId = flag + idTemplate;
		list[projectId] = {
			'name': nameTemplate,
			'widgets': structureTemplate,
			'id': idTemplate
		};
	};

	template.deleteTemplate = function (nameTemplate) {
		var projectId = flag + nameTemplate;
		delete list[projectId];
	};

	return template;
});