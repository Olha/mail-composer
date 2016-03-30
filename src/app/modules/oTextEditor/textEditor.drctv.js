/**
 * Created by olha on 21.10.15.
 */

/**
 * @directive contentItem - directive for initialization
 */
oTextEditor.directive('contentItem', ['OTextEditorStore', 'ComponentsStore', '$timeout', 'TemplateComponentsStore',
	function (OTextEditorStore, ComponentsStore, $timeout, TemplateComponentsStore) {
	'use strict';
	return {
		restrict: 'A',
		require : '?ngModel',
		link: function (scope, element, attrs, ngModel) {
			scope.getOptions = function(contentType) {
				var type = contentType || 'default';
				return OTextEditorStore.getOptions(type);
			};

			scope.pasteHnld = function (activeText, item) {
				$timeout(function() {
					var activeElement = element.find('[contenteditable]');
					var images = activeElement.find('img');
					if (images.length > 0) {
						images.remove();
						activeElement.focus();
					}
				}, 0);
			};

			//hot fix
			var list = TemplateComponentsStore.getList();
			scope.$watch(function () {return element.find('[contenteditable]').html()}, function (newData, oldData) {
				$.map(list, function (item, i) {
					var component = angular.toJson(item).substring(0, 70);
					var re = new RegExp(component);
					var flag = newData.match(re);
					if (Boolean(flag)) {
						var activeElement = element.find('[contenteditable]');
						activeElement.html(oldData);
						activeElement.focus();
					}
				});
			});

		}
	};
}]);
