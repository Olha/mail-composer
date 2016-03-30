/**
 * Created by olha on 24.09.15.
 */

/**
 * @directive dndPost - directive for post with drag and drop
 */
dnd.directive('dndPost', [function () {
	'use strict';
	return {
		restrict: 'AE',
		templateUrl: '/modules/dnd/dnd.html',
		link: function (scope, element, attrs) {
			scope.mailType = attrs.type;
			scope.mainComponent = 'modules/dnd/components/list.html';
		}
	};
}]);


/**
 * @directive dndContainer - directive for managing container
 */
dnd.directive('dndContainer', [function () {
	'use strict';
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.getContainerLink = function (widget, item) {
				if ((widget.zone[0].type === 'container') && (item.length > 0)) {
						if (item[0].type === 'container') {
							item.length = 0;
						} else {
							return 'modules/dnd/components/list.html';
						}
				}
				else {
					return 'modules/dnd/components/list.html';
				}

			};
		}
	};
}]);

/**
 * @directive dndWidget - directive for managing widget
 */
dnd.directive('dndWidget', [function () {
	'use strict';
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {

			scope.getComponentLink = function (widget, fileName) {
				return 'modules/dnd/components/' + fileName + '.html';
			}
		}
	};
}]);

/**
 * @directive removeWidget - directive for removing one widget from dropzone
 */
dnd.directive('removeWidget', ['$modal', function ($modal) {
	'use strict';
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.remove = function(widget) {
				var cancelRequestText = 'cancel_remove_widget';
				var cancelRequest = $modal.open({
					templateUrl: '/views/popup/confirm_popup.html',
					controller: PopupController,
					backdrop: 'static',
					keyboard: false,
					resolve: {
						popupData: function () {
							return {
								'confirmText': cancelRequestText
							};
						}
					}
				});

				cancelRequest.result.then(function (param) {
					if (param) {
						scope.dashboard.widgets.splice(scope.dashboard.widgets.indexOf(widget), 1);
					}
				});
			};
		}
	};
}]);

/**
 * @directive removeDropzone - directive for removing dropzone
 */
dnd.directive('removeDropzone', ['$modal', function ($modal) {
	'use strict';
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.removeDropzone = function() {
				var cancelRequestText = 'cancel_remove_dropzone';
				var cancelRequest = $modal.open({
					templateUrl: '/views/popup/confirm_popup.html',
					controller: PopupController,
					backdrop: 'static',
					keyboard: false,
					resolve: {
						popupData: function () {
							return {
								'confirmText': cancelRequestText
							};
						}
					}
				});

				cancelRequest.result.then(function (param) {
					if (param) {
						scope.dashboard.widgets = [];
					}
				});
			};
		}
	};
}]);


/**
 * @directive cleanDropzoneWidgets - directive for clearing all widgets from dropzone
 */
dnd.directive('cleanDropzoneWidgets', ['$modal', function ($modal) {
	'use strict';
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.cleanWidget = function() {
				var cancelRequestText = 'cancel_clean_dropzone';
				var cancelRequest = $modal.open({
					templateUrl: '/views/popup/confirm_popup.html',
					controller: PopupController,
					backdrop: 'static',
					keyboard: false,
					resolve: {
						popupData: function () {
							return {
								'confirmText': cancelRequestText
							};
						}
					}
				});

				cancelRequest.result.then(function (param) {
					if (param) {
						$.map(scope.dashboard.widgets, function (item, key) {
							item.zone.length = 0;
						});
					}
				});
			};
		}
	};
}]);

/**
 * @directive deleteDropzone - directive for deleting template(dropzone) from project template list
 */
dnd.directive('deleteDropzone', ['DndResource', 'TemplateStore', 'TemplateProjectStore', '$modal',
	function (DndResource, TemplateStore, TemplateProjectStore, $modal) {
	'use strict';
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.deleteDropzone = function(id) {
				var cancelRequestText = 'delete_template';
				var cancelRequest = $modal.open({
					templateUrl: '/views/popup/confirm_popup.html',
					controller: PopupController,
					backdrop: 'static',
					keyboard: false,
					resolve: {
						popupData: function () {
							return {
								'confirmText': cancelRequestText
							};
						}
					}
				});

				cancelRequest.result.then(function (param) {
					if (param) {
						DndResource.deletePostTemplate(id).then(function () {
								scope.dashboard = TemplateStore.getDefaultTemplate();
								TemplateProjectStore.deleteTemplate(id);
								scope.models.projectDropzones = TemplateProjectStore.getAllInfoTemplates();
							},
							function () {});
					}
				});


			};

			// function for displaying button, which is deleted template
			scope.checkTypeTemplate = function () {
				if (angular.isObject(scope.models)) {
					return Object.keys(scope.models.projectDropzones).indexOf(scope.selectedDashboardId) !== -1;
				}
			};
		}
	};
}]);

/**
 * @directive saveDropzone - directive for saving template(dropzone) from project template list
 */
dnd.directive('saveDropzone', ['$modal', 'DndResource', 'TemplateStore', 'TemplateProjectStore', '$timeout',
	function ($modal, DndResource, TemplateStore, TemplateProjectStore, $timeout) {
	'use strict';
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.saveDropzone = function(dashboardWidgets) {
				var modalInstance = $modal.open({
					templateUrl: '/views/popup/set_post_template_name.html',
					controller: PopupController,
					backdrop: 'static',
					keyboard: false,
					resolve: {
						popupData: function () {
							return {
								popup_name: 'postTemplateName',
								post_template_name: '',
								all_post_template_names: $.extend(TemplateStore.getAllInfoTemplates(), TemplateProjectStore.getAllInfoTemplates())
							};
						}
					}
				});
				$timeout(function () {
					angular.element('#postTemplateName').focus();
				}, 0);
				modalInstance.result.then(function (data) {
					var data = {
						'name': data.post_template_name,
						'structure': angular.toJson(dashboardWidgets)
					};
					try {
						DndResource.savePostTemplate(data).then(function (response) {
								TemplateProjectStore.setTemplate(response.id, response.name, response.structure);
								scope.selectedDashboardId = TemplateProjectStore.getFlag() + response.id;
								scope.dashboard = TemplateProjectStore.getTemplate(response.id);
								scope.models.projectDropzones = TemplateProjectStore.getAllInfoTemplates();
							},
							function () {
							});
					} catch (e) {
						$log.error('Bad work of rss channel change popup');
					}
				}, function (data) {});
			};
		}
	};
}]);


/**
 * @directive colorWidget - directive for setting widget background color
 */
dnd.directive('colorWidget', ['$timeout', function ($timeout) {
	'use strict';
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.selectColor = function () {
				$timeout(function(){
					element.find('input[type=color]').trigger( "click" );
				}, 0)
			}
		}
	};
}]);

/**
 * @directive socialWidgetItem - directive for getting social links
 */
dnd.directive('socialWidgetItem', ['$filter', function ($filter) {
	'use strict';
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {

			var socialPlaceholder = 'enter_' + attrs.socialWidgetItem + '_link';
			scope.socialPlaceholder = $filter('translate')(socialPlaceholder);

			scope.setSocialUrl = function (obj, social, url) {
				var myRegExp = new RegExp(social, "g");
				if(myRegExp.test(url)) {
					obj[social] = url;
					scope.socialError = false;
				} else {
					scope.socialError = true;
				}

			}
		}
	};
}]);