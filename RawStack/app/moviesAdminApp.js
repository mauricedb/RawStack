(function () {
    'use strict';
    var module = angular.module("moviesAdminApp", ["moviesData", "ngGrid", "ngRoute", "rawAjaxBusyIndicator"]);

    module.config(function ($routeProvider) {
        $routeProvider.when("/moviesAdminList", {
            controller: "moviesAdminListCtrl",
            templateUrl: "/MoviesAdmin/List"
        });
        $routeProvider.when("/moviesAdminEdit/:id", {
            controller: "moviesAdminEditCtrl",
            templateUrl: "/MoviesAdmin/Edit"
        });
        $routeProvider.otherwise({
            redirectTo: "/moviesAdminList"
        });
    });

    module.controller("moviesAdminListCtrl", function ($scope, $location, moviesSvc) {
        $scope.movies = moviesSvc.query();
        $scope.filterOptions = {
            filterText: ''
        };

        $scope.gridOptions = {
            data: 'movies',
            showGroupPanel: true,
            filterOptions: $scope.filterOptions,
            columnDefs: [
                { field: 'title', displayName: 'Title' },
                { field: 'abridgedDirectors.join(", ")', displayName: 'Directors' }
            ],
            afterSelectionChange: function (rowItem) {
                if (rowItem.selected) {
                    $location.path("/moviesAdminEdit/" + rowItem.entity.id);
                }
            }
        };

        var loadMoreMovies = function (moreData) {
            if (moreData) {
                moviesSvc.nextPage().then(loadMoreMovies);
            }
        };
        loadMoreMovies(true);
    });

    module.controller("moviesAdminEditCtrl", function ($scope, $route, $location, moviesSvc) {
        moviesSvc.get($route.current.params.id).then(function (result) {
            $scope.model = result.data;
        });

        $scope.save = function () {
            moviesSvc.save($scope.model).then(function() {
                alert("saved");

            }, function (e) {
                alert("Error saving");
            });
        }

        $scope.saveAndClose = function () {
            alert("save and close");
        }

        $scope.closeEdit = function() {
            $location.path("/moviesAdminList");
        }
    });
}());