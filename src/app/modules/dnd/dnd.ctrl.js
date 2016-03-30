/**
 *Created by olha on 24.09.15.
 */

/*jslint browser:true*/
/*global $, angular, $scope, console*/

angular.module('dnd').controller('DNDController', ['$scope', 'ComponentsStore',
	'$timeout', 'TemplateStore', 'TemplateProjectStore', 'DndDataStore', '$modal',
	'$rootScope', 'TemplateComponentsStore', 'UserTemplateStore',
	function ($scope, ComponentsStore, $timeout, TemplateStore, TemplateProjectStore, DndDataStore,
	          $modal, $rootScope, TemplateComponentsStore, UserTemplateStore) {

	$scope.gridsterOptions = {
		margins: [40, 20],
		columns: 4,
		draggable: {
			handle: 'h3',
			stop: function(event, $element, widget) {}
		}
	};

	$scope.removeItem = function(widget, item) {
		widget.zone.splice(widget.zone.indexOf(item), 1);
	};

	$scope.addWidget = function() {
		$scope.dashboard.widgets.push({
			name: "New Widget",
			sizeX: 1,
			sizeY: 1,
			color: ComponentsStore.baseWidgetOptions.color,
			id: ComponentsStore.generateId(),
			zone: []
		});
	};

	$scope.changeDashboard = function (valId, templateId,  type) {
		if ($scope.selectedDashboardId !== valId) {
			var cancelRequestText = 'change_template';
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
					$scope.selectedDashboardId = valId;
					switch (type) {
						case 'project':
							$scope.dashboard = angular.copy(TemplateProjectStore.getTemplate(templateId));
							break;
						default :
							$scope.dashboard = angular.copy(TemplateStore.getTemplate(templateId));
							break;
					}
				}
			});
		}
	};
	$scope.showPreviewNewsletter = function () {
			$timeout(function() {
				var win = window.open("", "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, " +
					"resizable=yes, width=1000, height=100%, top=0, right=0");
				win.document.body.innerHTML = DndDataStore.getPreviewData($scope.mailType)['text'];
			}, 0)
		};

	$scope.init = function () {
		$timeout(function() {
			$scope.models = {
				'selected': null,
				'templates': [
					{
						'type': 'container',
						'title': 'container',
						'file': 'container',
						id: 2,
						columns: [[], []],
						'style': ComponentsStore.getStyle('container')
					},
					{
						'type': 'item',
						'title': 'image',
						'file': 'image',
						id: 3,
						content: '', //changable
						'boxSrc': ComponentsStore.getHtmlTag('image'),
						'boxUrl': '',
						'style': ComponentsStore.getStyle('image')
					},
					{
						'type': 'item',
						'title': 'video',
						'file': 'video',
						id: 4,
						content: '', //no changable
						'url': ComponentsStore.getHtmlTag('video'),
						'style': ComponentsStore.getStyle('video')
					},
					{
						'type': 'item',
						'title': 'social',
						'file': 'social',
						id: 5,
						content: '', //no changable
						'socialData': {
							'facebook': '', // social url
							'linkedin': '', // social url
							'twitter': '', // social url
						},
						'style': ComponentsStore.getStyle('social')
					},
					{
						'type': 'item',
						'title': 'html',
						'file': 'html',
						id: ComponentsStore.generateId(),
						content: '', //changable
						'style': ComponentsStore.getStyle('html')
					}
				],
				'dropzones': TemplateStore.getAllInfoTemplates(),
				'projectDropzones': TemplateProjectStore.getAllInfoTemplates()
			};
			TemplateComponentsStore.setList($scope.models.templates);
			if ($scope.mailType === 'post' || angular.isUndefined(TemplateStore.selectId)) {
				$scope.selectedDashboardId = TemplateStore.defaultId;
				$scope.dashboard = angular.copy(TemplateStore.getDefaultTemplate());
			} else {
				$scope.selectedDashboardId = TemplateStore.selectId;
				$scope.dashboard = angular.copy(TemplateStore.getTemplate($scope.selectedDashboardId));
			}
		}, 200)
	};

	$scope.checkActiveDropzone = function () {
		if (angular.isUndefined($scope.models)) {
			return;
		}
		return Boolean(Object.keys($scope.models.projectDropzones).length);
	};

	$scope.init();

	$scope.$watch('dashboard', function (model, oldModel) {
		if (angular.isUndefined(model)) {
			return;
		}
		$timeout(function() {
			ComponentsStore.runAutoGrid(angular.fromJson(model).widgets);
			DndDataStore.setData('mailObject', angular.fromJson(model).widgets, $scope.mailType);
		}, 0);
	}, true);

		$scope.$watch('currentTpl', function (tpl) {
			DndDataStore.setData('mailTemplate', tpl, $scope.mailType);
		},true)
		$scope.$watch('postSubject', function (model) {
		DndDataStore.setData('postSubject', model, $scope.mailType);
	}, true);



	$rootScope.$on('update_template', function () {
		$timeout(function(){
			TemplateProjectStore.init();
			$scope.selectedDashboardId = TemplateStore.defaultId;
			$scope.dashboard = angular.copy(TemplateStore.getDefaultTemplate());
		}, 200);
	});

	$rootScope.$on('readyTemplateProjectStore', function () {
		$timeout(function(){
			$scope.models.projectDropzones = TemplateProjectStore.getAllInfoTemplates();
		}, 0);
	});

    $rootScope.$on('readyUserTemplateStore', function(event){
        $scope.listTemplate = UserTemplateStore.getTemplates();
        $scope.currentTpl = UserTemplateStore.getCurrentTemplate();
    });

	$rootScope.$on('saveDropzone', function (event, saveFlag) {
		if (saveFlag) {
			$scope.saveDropzone($scope.dashboard.widgets);
		} else {
			$scope.selectedDashboardId = TemplateStore.defaultId;
			$scope.dashboard = angular.copy(TemplateStore.getDefaultTemplate());
		}
	});

}]);