/**
 * Created by olha on 29.10.15.
 */

/**
 * @directive aviaryImage - directive for inserting aviary image
 */
aviaryImage.directive('aviaryImage', ['$window', '$timeout', function ($window, $timeout) {
    'use strict';
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D)
    };
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (!helper.support) {
                return;
            }

            var fileInput = element.find('[type=file]');
            var image = element.find('img');
            var aviaryBlk = element.find('[ng-aviary]');

            scope.chooseImageHndl = function () {
                $timeout(function () {
                    fileInput.trigger('click');
                }, 0);
            };

            fileInput.change(function () {
                var fr = new FileReader();
                fr.onload = function (smth) {
                    aviaryBlk.attr('target-src', fr.result);
                    var img = new Image();
                    img.onload = function () {
                        $timeout(function () {
                            //scope.ts = fr.result;
                            aviaryBlk.attr('target-src', fr.result);
                            aviaryBlk.trigger('click');
                        }, 0);
                    };
                    img.src = fr.result;
                };
                fr.readAsDataURL(this.files[0]);
            });
        }
    };
}]);