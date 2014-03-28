(function () {
    'use strict';
    var module = angular.module("rawAjaxBusyIndicator", []);

    module.directive("rawAjaxBusyIndicator", function () {
        return {
            link: function (scope, element) {
                scope.$on("ajax-start", function () {
                    element.show();
                });
                scope.$on("ajax-stop", function () {
                    element.hide();
                });
            }
        };
    });

    module.config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q, $rootScope) {
            var requests = 0;

            function show() {
                if (!requests) {
                    $rootScope.$broadcast("ajax-start");
                }
                requests++;
            }

            function hide() {
                requests--;
                if (!requests) {
                    $rootScope.$broadcast("ajax-stop");
                }
            }

            return {
                'request': function (config) {
                    show();
                    return $q.when(config);
                }, 'response': function (response) {
                    hide();
                    return $q.when(response);
                }, 'responseError': function (rejection) {
                    hide();
                    return $q.reject(rejection);
                }
            };
        });
    });
}());
