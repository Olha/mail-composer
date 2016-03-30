/**
 * Created by olha on 28.10.15.
 */

/*jslint browser: true*/
/*global $, jQuery, angular, aviaryImage, $scope*/
aviaryImage.factory('AviaryImageResource', function ($resource, $cookies) {
	'use strict';
	// Construct an  aviary resource object that can
	// interact with the RESTful API of the server.

	var _xsrf = {
		value: function () {
			return $cookies['csrftoken'];
		}
	};
	var aResource = $resource(':action/:operation/:operation1/:operation2/:operation3/:operation4/',
		{
			action: 'user',
			operation: '@operation',
			operation1: '',
			operation2: '',
			operation3: '',
			operation4: ''
		},
		{
			head: {
				method: 'HEAD',
				isArray: false
			},
			ximg: {
				method: 'POST',
				isArray: false,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-CSRFToken': _xsrf.value
				}
			},
			delete_ximg: {
				method: 'DELETE',
				isArray: false,
				headers: {'X-CSRFToken': _xsrf.value}
			}
		});

	/**
	 * @function uploadImage - function for getting new image-url
	 * @param String amazonUrl - url is returned by Amazon (72h)
	 * @returns String newUrl  - responced url-string
    */
	aResource.uploadImage = function (amazonUrl) {
		return this.ximg(
			{
				'action': 'ximg',
			}, $.param({
				image: amazonUrl
			})
		).$promise;
	};

	/**
	 * @function deleteImagePost - function deleting post image
	 * @param id - post id
	 */
	aResource.deleteImagePost = function (id) {
		return this.delete_ximg(
			{
				'action': 'ximg',
				'operation': id
			}
		).$promise;
	};



	return aResource;
});
