/**
 * Created by olha on 25.09.15.
 */

dnd.factory('ComponentsStore', function (_, $location) {
	'use strict';
	var style = {};
	style.baseWidgetOptions = {
		width: 220,
		height: 200,
		top: 20,
		left: 20,
		color: '#EEF7FB'
	};

	style.generateId = function () {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	};

	style.runAutoGrid = function (dashboard) {
		$.map(dashboard, function (widget, i) {
			style.runAutoGridWidget(widget);
		});
	};

	style.runAutoGridWidget = function (widget) {
		var height = $('#'+widget.id).find('.box-content').height() + 40;
		widget.sizeY = Math.ceil(height/style.baseWidgetOptions.height);
	};

	style.initDropZoneHeight = function (arr) {
		var fullHeight = 0;
		$.map(arr, function (widget, i) {
			var objStyle = style.objStyle(widget);
			var heightFlag = 'height';
			var topFlag = 'top';
			var top = 2 * style.baseWidgetOptions[topFlag] + objStyle[topFlag] * (style.baseWidgetOptions[topFlag] + style.baseWidgetOptions[heightFlag]);
			var height = style.baseWidgetOptions[heightFlag] * objStyle[heightFlag] + (objStyle[heightFlag] - 1) * style.baseWidgetOptions[topFlag];
			fullHeight = Math.max(fullHeight, top + height);
		});

		return fullHeight;
	};

	style.getDropZoneRows = function (arr) {
		return (style.initDropZoneHeight(arr) - style.baseWidgetOptions['top'])/(style.baseWidgetOptions['height'] + style.baseWidgetOptions['top']);
	};

	style.objStyle = function (customWidgetOptions) {
		return {
			left: customWidgetOptions.col || 0,
			top: customWidgetOptions.row || 0,
			height: customWidgetOptions.sizeY || 1,
			width: customWidgetOptions.sizeX || 1
		}
	};
	style.allList = {
		'item': 'margin: 0px 0px; display: block;',
		'container-element': '',
		'column-2': ' float: left; width:' + +(100/2) + '%; outline: 1px solid transparent; overflow: hidden; vertical-align: top; display: inline-block; ',
		'column-3': ' float: left; width:' + +(100/3) + '%; outline: 1px solid transparent; overflow: hidden; ',
		'column-4': ' float: left; width:' + +(100/4) + '%; outline: 1px solid transparent; overflow: hidden; ',
		//'dnd-list': ' min-height: 196px; margin: 0px; padding-left: 0px; position: relative; list-style-type: none; height: 100%; ', //old
		 'dnd-list': ' margin: 0px; padding-left: 0px; position: relative; list-style-type: none; ',
		'dnd-list-li': ' display: block; padding: 0px; height: 100%; margin: 0px; ',
		//'table-widget': ' height: ' + style.baseWidgetOptions['height'] + 'px ; ',//old
		'table-widget': ' height: 100%; ',
		'head-dropzone': ' height: 0px; ',
		'top-table-widget': function (cols) {
			return 'width: ' + 100/cols + '%; '
		},
		'widget': function (customWidgetOptions) {
			function wrapperStyle (prop, body) {
				return prop + ': ' + body + 'px;';
			}

			function generateStyle (obj, objStyle) {
				return $.map(obj, function (item, key) {
					var val;
					switch (key) {
						case 'width':
							val = style.baseWidgetOptions[key] * objStyle[key] + (objStyle[key] - 1)*style.baseWidgetOptions['left'];
							return wrapperStyle(key, val);
							break;
						case 'height':
							val = style.baseWidgetOptions[key] * objStyle[key] + (objStyle[key] - 1)*style.baseWidgetOptions['top'];
							return wrapperStyle(key, val);
							break;
						case 'top':
							val = style.baseWidgetOptions[key] + objStyle[key]*(style.baseWidgetOptions[key] + style.baseWidgetOptions['height']);
							return wrapperStyle(key, val);
							break;
						case 'left':
							val = style.baseWidgetOptions[key] + objStyle[key]*(style.baseWidgetOptions[key] + style.baseWidgetOptions['width']);
							return wrapperStyle(key, val);
							break;
					}
				});
			}
			var objStyle = style.objStyle(customWidgetOptions);
			var strStyle = 'position: absolute; border: 1px solid transparent; overflow: hidden; ' + generateStyle(style.baseWidgetOptions, objStyle).join(' ');
			return strStyle;
		},
		'dropzone': function (customDropzoneOptions) {
			var height = style.initDropZoneHeight(customDropzoneOptions);
			//var strStyle = 'height: '+ height + 'px; border: 1px solid transparent; position: relative; width: 960px; ';//old
			var strStyle = ' border: 1px solid transparent; position: relative; width: 100%; ';
			return strStyle;
		},

		'image': ' text-align: center; line-height: 198px; max-width: 100%; max-height: 100%; height: 100%; ',
		'imageInsert': function (indexHeight, indexWidth, countPerCent) {
			var maxWidth = ' max-width: ' + indexWidth*style.baseWidgetOptions['width'] + 'px; ';
			if (countPerCent) {
				maxWidth = ' max-width: ' + 100/countPerCent.length + '% ';
			}
			return maxWidth + ' line-height: 198px; max-height: ' + indexHeight*style.baseWidgetOptions['height'] + 'px; display: block; margin: 0 auto; '
		},
		'video': ' width: 100%; height: 100%; text-align: center; ',
		'html': ' ',
		'social': ' ',
		'container': ' ',
		'imageVideo': function (indexHeight, indexWidth, countPerCent) {
			var maxWidth = ' max-width: ' + indexWidth*style.baseWidgetOptions['width'] + 'px; ';
			if (countPerCent) {
				maxWidth = ' max-width: ' + 100/countPerCent.length + '% ';
			}
			return maxWidth + ' display: block; max-height: ' + indexHeight*style.baseWidgetOptions['height'] + 'px; margin: 0 auto; '
		},
		'htmlContainer': ' ',

		'socialList': ' list-style: none; padding: 0; text-align: center; font-size: 0; ',
		'socialItem': ' display: inline-block; margin-left: 10px; margin-right: 10px; ',
		'socialLink': ' margin-top: 75px; display: inline-block; '
	};

	style.getStyle = function (component) {
		if (Object.keys(style.allList).indexOf(component) !== -1) {
			return style.allList[component];
		}
	};

	style.allHtmlTag = {
		'image': '/img/layout/dnd/add_photo.png',
		'video': 'https://youtu.be/xo1VInw-SKc'
	};

	style.getHtmlTag = function (component) {
		if (Object.keys(style.allHtmlTag).indexOf(component) !== -1) {
			return style.allHtmlTag[component];
		}
	};

	return style;
});