/**
 * Created by olha on 28.10.15.
 */

angular.module('aviaryImage').controller('AviaryImageController', ['$scope', 'AviaryImageResource', '$rootScope', '$modal',
	function ($scope, AviaryImageResource, $rootScope, $modal) {
		var dndImage = this;
		dndImage.defaultImagePost = '/public/upload/post/no-cover.jpg';

		dndImage.showPostImage = function (insideData) {
			if (angular.isUndefined(insideData)) {
				return true;
			}
			if (insideData.post.ximg.url.match(dndImage.defaultImagePost)) {
				return true;
			}
			return false;
		};

		dndImage.deleteImageHndl = function (insideData) {
			var cancelRequestText = 'cancel_delete_image';
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
					AviaryImageResource.deleteImagePost(insideData.ximg.id).then(function () {
						insideData.ximg.url = dndImage.defaultImagePost;
						insideData.ximg.id = undefined;
						if (Boolean($rootScope.activeItem)) {
							$rootScope.activeItem.post.ximg = insideData.ximg;
						}

					}, function (data) {});
				}
			});
		};

		dndImage.onSave = function (id, newId, type, insideData) {
			AviaryImageResource.uploadImage(newId).then(function (data) {
				var aviaryData = {
					'id': id,
					'newId': newId,
					'insideData': insideData,
					'data': data
				};
				dndImage.additionalFunctional(type, aviaryData);
			}, function (data) {});
		};

		dndImage.additionalFunctional = function (type, aviaryData) {
			if (aviaryData.id == 'cvs') {
				var ximg = {
					url: aviaryData.data.image,
					id: aviaryData.data.id
				};
				$rootScope.$broadcast('setAviaryImage', ximg);
				$rootScope.$broadcast('closeAviaryPopup');
				return;
			}
			switch (type) {
				case 'dnd':
					$.map(aviaryData.insideData, function (elem, i) {
						$.map(elem.zone, function (item, j) {
							if (item.imageId === aviaryData.id) {
								item.boxSrc = aviaryData.data.image;
							}
							//container for 1 level deep
							if (item.type === 'container') {
								$.map(item.columns, function (column, k) {
									if (!angular.isObject(column[0])) {
										return;
									}
									if (column[0].imageId === aviaryData.id) {
										column[0].boxSrc = aviaryData.data.image;
									}
								});
							}
						});
					});
					break;
				case 'post':
					for (var k = 0; k < aviaryData.insideData.length; k++) {
						if (aviaryData.id == aviaryData.insideData[k].post.imageId) {
							aviaryData.insideData[k].post.ximg.url = aviaryData.data.image;
							aviaryData.insideData[k].post.ximg.id = aviaryData.data.id;
							break;
						}
					}
					break;
				//case 'create_post':
				//	aviaryData.insideData.post.ximg.url = aviaryData.data.image;
				//	aviaryData.insideData.post.ximg.id = aviaryData.data.id;
				//	break;
			}
			$rootScope.$broadcast('closeAviaryPopup');
		};

		dndImage.getRandomizer = function  (bottom, top) {
			return function () {
				return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
			};
		};

		dndImage.id = dndImage.getRandomizer(0, 10000)();
	}]);
