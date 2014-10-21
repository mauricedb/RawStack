(function () {
    'use strict';
    var module = angular.module("moviesAdminApp", ["moviesData", "ngGrid", "ngRoute", "rawAjaxBusyIndicator"]);

    module.config(function ($routeProvider) {
        $routeProvider.when("/moviesAdminList", {
            controller: "moviesAdminListCtrl",
            templateUrl: "/app/moviesAdminList.html"
        });
        $routeProvider.when("/moviesAdminEdit/:id", {
            controller: "moviesAdminEditCtrl",
            templateUrl: "/app/moviesAdminEdit.html"
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

    module.controller("moviesAdminEditCtrl", function ($scope, $route, moviesSvc) {
        moviesSvc.get($route.current.params.id).then(function (result) {
            $scope.movie = result.data;
        });

    });
}());