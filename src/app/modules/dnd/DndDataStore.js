/**
 * Created by olha on 10.11.15.
 */

dnd.factory('BaseDndDataStore', function (ComponentsStore, youtubeEmbedUtils, $location) {
	'use strict';
	var data = {};

	data.generateWidgetsTable = function (arrWidgets, cols) {
		var wrapperDropzoneHTML = $('<table>').attr('style', ComponentsStore.getStyle('dropzone')(arrWidgets));
		var rows = ComponentsStore.getDropZoneRows(arrWidgets);
		//functional for separate table into columns
		var headDropzone = $('<tr>').attr('style', ComponentsStore.getStyle('head-dropzone'));
		for (var i = 0; i < cols; i++) {
			headDropzone.append($('<th>').attr('style', ComponentsStore.getStyle('top-table-widget')(cols)));
		}
		wrapperDropzoneHTML.append(headDropzone);

		var arrTr = [];
		var flagRow = [1, 1, 1, 1];
		for (var i=0; i < rows; i++) {
			arrTr[i] = [];
			var dropzoneHTML = $('<tr>').attr('style', ComponentsStore.getStyle('table-widget'));
			//get all items from one row and sort this tr
			$.map(arrWidgets, function (inWidget, j) {
				if (i == inWidget.row) {
					arrTr[i][inWidget.col] = inWidget;
				}
			});

			var flagCol = 1;
			$.map(arrTr[i], function (inWidget, j) {
				if (angular.isDefined(inWidget)) {
					var widgetHTML = $('<td>').attr('style', ' padding: 10px; height: 100%; background-color: '+ inWidget.color +'; ').attr('rowspan', inWidget.sizeY).attr('colspan', inWidget.sizeX);
					var widgetContent = generateHTML(inWidget.zone, inWidget);
					widgetHTML.html(widgetContent);
					dropzoneHTML.append(widgetHTML);
					flagRow[j] = inWidget.sizeY;
					for (var k = 0; k < inWidget.sizeX; k++) {
						k +=j;
						flagRow[k] = inWidget.sizeY;
					}
					flagCol = inWidget.sizeX;
				} else {
					if (flagCol !== 1) {
						flagCol--;
						return;
					}
					if (flagRow[j] !== 1) {
						flagRow[j]--;
						return;
					}
					var widgetHTML = $('<td>').attr('style', 'height: 100%').attr('rowspan', 1).attr('colspan', 1);
					widgetHTML.html('<div style="width: 100%"></div>');
					dropzoneHTML.append(widgetHTML);
				}
			});

			wrapperDropzoneHTML.append(dropzoneHTML);
		}

		return $('<div>').append(wrapperDropzoneHTML);
	};

	function generateHTML (arr, inWidget) {
		var contentHTML = $('<ul>').attr('style', ComponentsStore.getStyle('dnd-list'));
		var divClearfix = $('<div>').attr('style', 'clear: both;');
		$.map(arr, function (elem, i) {
			var li = $('<li>').attr('style', ComponentsStore.getStyle('dnd-list-li'));
			var divContainer = $('<div>').attr('style', ComponentsStore.getStyle('container-element'));
			if (elem.type === 'container') {
				$.map(elem.columns, function (item, i) {
					var divColumn = $('<div>').attr('style', ComponentsStore.getStyle('column-'+ elem.columns.length));
					divColumn.append(generateHTML(item, inWidget));
					divContainer.append(divColumn);
				});
				divContainer.append(divClearfix);
				li.append(divContainer);
			} else {
				li.append(generateItemHTML(elem, inWidget));
			}
			contentHTML.append(li);
		});
		return contentHTML;
	}

	function generateItemHTML (elem, inWidget) {
		var element = $(previewTag(elem, inWidget)).attr('style', elem.style + ' ' + ComponentsStore.getStyle('item')).attr('id', elem.id);
		if ($.trim(elem.content).length !== 0) {
			element.html(elem.content);
		}
		return element;
	}

	function previewTag (elem, inWidget) {
		switch (elem.title) {
			case 'image':
				var image = ComponentsStore.getHtmlTag('image') !== elem.boxSrc ?
					$('<img alt="">').attr('src', elem.boxSrc ).attr('style', ComponentsStore.getStyle('imageInsert')(inWidget.sizeY, inWidget.sizeX, inWidget.zone[0].columns)) : '';
				var link = $('<a target="_blank">').attr('href', elem.boxUrl).attr('style', '');
				link.append(image);
				return $('<div>').append(link);
				break;
			case 'video':
				var previewImg = '<img alt="" src="http://img.youtube.com/vi/' +
					youtubeEmbedUtils.getIdFromURL(elem.url) + '/maxresdefault.jpg">';
				previewImg = $(previewImg).attr('style', ComponentsStore.getStyle('imageVideo')(inWidget.sizeY, inWidget.sizeX, inWidget.zone[0].columns));
				var previewLink = '<a target="_blank"' +
					' frameborder="0" allowfullscreen href="https://www.youtube.com/embed/' +
					youtubeEmbedUtils.getIdFromURL(elem.url) + '">';

				previewLink = $(previewLink).append(previewImg);
				return previewLink;
				break;
			case 'social':
				var activeSocial = {};
				$.map(elem.socialData, function(item, social) {
					if (Boolean($.trim(item).length)) {
						activeSocial[social] = item;
					}
				});
				var listSocial = $('<ul>').attr('style', ComponentsStore.getStyle('socialList'));
				$.map(activeSocial, function (item, social) {
					var li = $('<li>').attr('style', ComponentsStore.getStyle('socialItem'));
					var link = $('<a target="_blank">').attr('href', item).attr('style', ComponentsStore.getStyle('socialLink'));
					var imageUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/img/layout/dnd/social/' + social + '.png';
					var img = $('<img src="' + imageUrl + '" alt="" width=38 height=38>');
					link.append(img);
					li.append(link);
					listSocial.append(li);
				});
				var previewSocial = $('<div>').append(listSocial);
				return previewSocial;
				break;
			case 'html':
				var htmlContainer =  $('<div>').attr('style', ComponentsStore.getStyle('htmlContainer'))
				return htmlContainer;
			default:
				return '<div>';
		}
	}

	return data;

});

dnd.factory('PostDndDataStore', function (BaseDndDataStore) {
	'use strict';
	var data = {};

	var dndData = {
		'mailText': '',
		'mailObject': [],
		'postSubject': '',
		'activeMailType': 'newsletter',
		'mailTemplate': {}
	};

	data.getData = function () {
		return dndData;
	};

	data.getPreviewData = function () {
		return {
			'text': dndData.mailText
		};
	};

	data.getSendData = function () {
		return {
			'text': dndData.mailText,
			'subject': dndData.postSubject,
			'mail_newsletter': angular.toJson(dndData.mailObject)
		}
	};

	data.setData = function (key, value) {
		dndData[key] = value;
		if (key === 'mailObject') {
			data.setMailText();
		}
	};

	data.setMailText = function () {
		dndData['mailText'] = BaseDndDataStore.generateWidgetsTable(dndData.mailObject, 4).html();
	};

	return data;

});

dnd.factory('EditPostDndDataStore', function (BaseDndDataStore) {
	'use strict';
	var data = {};

	var dndData = {
		'itemMail': '',
		'mailObject': [],
		'postSubject': '',
		'activeMailType': 'newsletter',
		'mailTemplate': {}
	};

	data.getData = function () {
		return dndData;
	};

	data.getPreviewData = function () {
		return {
			'text': dndData.itemMail
		};
	};

	data.getSendData = function () {
		return {
			'text': dndData.itemMail,
			'subject': dndData.postSubject,
			'mail_newsletter': angular.toJson(dndData.mailObject)
		}
	};

	data.setData = function (key, value) {
		dndData[key] = value;
		if (key === 'mailObject') {
			data.setMailText();
		}
	};

	data.setMailText = function () {
		dndData['itemMail'] = BaseDndDataStore.generateWidgetsTable(dndData.mailObject, 4).html();
	};

	return data;

});

dnd.factory('DndDataStore', function (PostDndDataStore, EditPostDndDataStore, FlagStore) {
	'use strict';
	var data = {};

	var store = {};
	store[FlagStore.post] = PostDndDataStore;
	store[FlagStore.editPost] = EditPostDndDataStore;


	data.setData = function (key, value, type) {
		store[type].setData(key, value);
	};

	data.getData = function (type) {
		return store[type].getData();
	};

	data.getPreviewData = function (type) {
		return store[type].getPreviewData();
	};

	data.getSendData = function (type) {
		return store[type].getSendData();
	};

	return data;
});

