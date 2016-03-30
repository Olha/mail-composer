/**
 * Created by olha on 06.11.15.
 */

dnd.factory('TemplateStore', function (DndResource) {
	'use strict';
	var template = {};

	var list = {};

	template.init = function () {
		DndResource.getPostTemplates().then(function (data) {
			$.map(data, function (dropzone, i) {
				if (i === 0 || dropzone.is_default) {
					template.defaultId = dropzone.id;
				}
				template.setTemplate(dropzone.id, dropzone.name, dropzone.structure);
			});
		}, function () {});
	}();

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

	template.getDefaultTemplate = function () {
		return list[template.defaultId];
	};

	template.getTemplate = function (nameTemplate) {
		return list[nameTemplate];
	};

	template.setTemplate = function (idTemplate, nameTemplate, structureTemplate) {
		list[idTemplate] = {
			'name': nameTemplate,
			'widgets': structureTemplate,
			'id': idTemplate
		};
	};

	template.setSelectTemplate = function (structureTemplate) {
		template.selectId = '0';
		var selectName = 'Select template';
		template.setTemplate(template.selectId, selectName, structureTemplate);
	};

	template.deleteSelectTemplate = function () {
		delete list[template.selectId];
		delete template.selectId;
	};

	return template;
});