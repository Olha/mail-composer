/**
 * Created by alex on 07.03.16.
 */


/**
 * Created by olha on 06.11.15.
 */

dnd.factory('UserTemplateStore', function (DndResource, $rootScope) {
    'use strict';
    var tpls = {};
    var _templates = [];
    var _currentTemplate = {};

    tpls.init = function () {
        this.getUserTemplates();

    }

    tpls.getTemplates = function () {
        return _templates;
    }

    tpls.setCurrentTemplate = function (tpl) {
        _currentTemplate = tpl;
    }

    tpls.getCurrentTemplate = function () {
        if (_templates.length == 0) {
            return {};
        }
        for (var key in _templates) {
            var tpl = _templates[key];
            if (tpl.is_default) {
                this.setCurrentTemplate(tpl);
                return tpl;
            }
        }

    }

    tpls.getUserTemplates = function () {
        var _tpls = this;
        DndResource.getUserTpls($rootScope.user.user_id).then(function (data) {
            _tpls._setUserTemplates(data);
            $rootScope.$emit('readyUserTemplateStore');
        })
    }

    tpls._setUserTemplates = function (tpls) {
        _templates = tpls;
    }

    tpls.init();

    return tpls;
});