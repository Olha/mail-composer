/**
 * Created by olha on 25.11.15.
 */
/*jslint browser: true*/
/*global $, jQuery, angular, aviaryImage, $scope*/
dnd.factory('DndResource', function ($resource, $cookies) {
	'use strict';
	// Construct an  aviary resource object that can
	// interact with the RESTful API of the server.

	var _xsrf = {
		value: function () {
			return $cookies['csrftoken'];
		}
	};
	var dResource = $resource(':action/:operation/:operation1/:operation2/:operation3/:operation4/',
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

			getMailTemplates: {
				method: 'GET',
				isArray: true
			},

			getProjectMailTemplates: {
				method: 'GET',
				isArray: true
			},

			saveMailTemplate: {
				method: 'POST',
				isArray: false,
				headers: {
					'Content-Type': "application/json",
					'X-CSRFToken': _xsrf.value
				}
			},

			deleteMailTemplate: {
				method: 'DELETE',
				isArray: false,
				headers: {'X-CSRFToken': _xsrf.value}
			},

			getUserTpl: {
                method: 'GET',
                isArray: true
            }

		});


	/**
     * get user template
     * @returns {*|{method, isArray, transformRequest, headers}}
     */
    dResource.getUserTpls = function (user_id) {
        return this.getUserTpl(
            {
                'action': 'user',
                'operation1': user_id,
                'operation2': 'templates'
            }
        ).$promise;
    };

	/**
	 * @function getPostTemplates - function for getting default post templates
	 */
	dResource.getPostTemplates = function () {
		return this.getMailTemplates(
			{
				'action': 'post',
				'operation': 'templates'
			}
		).$promise;
	};

	/**
	 * @function getProjectPostTemplates - function for getting custom post templates
	 */
	dResource.getProjectPostTemplates = function () {
		return this.getProjectMailTemplates(
			{
				'action': 'project',
				'operation': 'templates'
			}
		).$promise;
	};

	/**
	 * @function savePostTemplate - function updating google profiles/pages
	 * @param Object data - {name | structure} model for saving
	 */
	dResource.savePostTemplate = function (data) {
		return this.saveMailTemplate (
			{
				'action': 'post',
				'operation': 'template'
			}, data).$promise;
	};

	/**
	 * @function deletePostTemplate - function deleting post template
	 * @param id - template id
	 */
	dResource.deletePostTemplate = function (id) {
		return this.deleteMailTemplate(
			{
				'action': 'post',
				'operation': 'template',
				'operation1': id
			}
		).$promise;
	};

	return dResource;
});
