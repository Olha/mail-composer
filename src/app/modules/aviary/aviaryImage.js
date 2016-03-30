/**
 * Created by olha on 28.10.15.
 */

var aviaryImage = angular.module('aviaryImage', ['ngAviary']);

aviaryImage.config(function(ngAviaryProvider) {
    ngAviaryProvider.configure({
        apiKey: 'da4d7c90-5fd0-4a57-9aa5-d9568ca9f66e',
        tools: 'all'
    });
});
