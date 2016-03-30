
angular.module('mailComposer', [
  'ngRoute',
  'mailComposer.todo'
])
.config(function ($routeProvider) {
  'use strict';
  $routeProvider
    .when('/todo', {
      controller: 'TodoCtrl',
      templateUrl: '/mail-composer/todo/todo.html'
    })
    .otherwise({
      redirectTo: '/todo'
    });
});
