/**
 * Created by olha on 20.10.15.
 */

oTextEditor.factory('OTextEditorStore', function () {
	'use strict';
	var textEditor = {
		default: [
			['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
			['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
			['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
			['html', 'insertImage','insertLink', 'insertVideo', 'wordcount', 'charcount']
		],
		html: [
			['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
			['bold', 'italics', 'underline'],
			['insertLink'],
			['ul', 'ol'],
			['justifyLeft', 'justifyCenter', 'justifyRight']
		],
		video: [['insertVideo']],
		image: [['insertImage']]
	};

	textEditor.getOptions = function (keyOptions) {
		return textEditor[keyOptions] || textEditor['default'];
	};

	textEditor.setSize = function(keyOptions, options) {
		textEditor[keyOptions] = options;
	};


	return textEditor;
});
