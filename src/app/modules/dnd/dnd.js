/**
 * Created by olha on 24.09.15.
 */

var dnd = angular.module('dnd', ['ngSanitize', 'dndLists', 'oTextEditor', 'gridster', 'oEmbed', 'lodash', 'aviaryImage']);

angular.module('dnd')
	.filter('to_trusted', ['$sce', function($sce) {
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

// helper code
	.filter('object2Array', function () {
		return function (input) {
			var out = [];
			for (i in input) {
				out.push(input[i]);
			}
			return out;
		}
	});

