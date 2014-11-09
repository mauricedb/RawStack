(function() {
    'use strict';
    var module = angular.module("moviesAdminApp", ["moviesData", "ngGrid", "ngRoute", "rawAjaxBusyIndicator"]);

    module.config(function($routeProvider) {
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

    module.controller("moviesAdminListCtrl", function($scope, $location, moviesSvc) {
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
            afterSelectionChange: function(rowItem) {
                if (rowItem.selected) {
                    $location.path("/moviesAdminEdit/" + rowItem.entity.id);
                }
            }
        };

        var loadMoreMovies = function(moreData) {
            if (moreData) {
                moviesSvc.nextPage().then(loadMoreMovies);
            }
        };
        loadMoreMovies(true);
    });

    module.controller("moviesAdminEditCtrl", function($scope, $route, $location, moviesSvc) {
        toastr.options = {
            "positionClass": "toast-bottom-full-width"
        };
        moviesSvc.get($route.current.params.id).then(function(result) {
            $scope.model = result.data;
        });

        function saveMovie(movie) {
            return moviesSvc.save(movie).then(
                function (e) {
                    toastr.success("Movie saved");
                    return e;
                }, function(e) {
                    for (var prop in e.data.modelState) {
                        var errors = e.data.modelState[prop];
                        for (var i = 0; i < errors.length; i++) {
                            toastr.error(errors[i]);
                        }
                    }
                    return e;
                });
        }

        $scope.save = function() {
            saveMovie($scope.model).then(function() {
                $scope.editForm.$setPristine();
            });
        };

        $scope.saveAndClose = function () {
            saveMovie($scope.model).then(function() {
                $location.path("/moviesAdminList");
            });
        };

        $scope.closeEdit = function () {
            $location.path("/moviesAdminList");
        };
    });
}());