/**
 * Created by olha on 22.12.15.
 */

dnd.factory('TemplateComponentsStore', function (ComponentsStore) {
	'use strict';
	var component = {};

	var list = [];

	component.getList = function () {
		return list;
	};

	component.setList = function (componentList) {
		list = list.concat(componentList);
	};

	component.setComponent = function (componentItem) {
		list.push(componentItem);
	};

	return component;

});
