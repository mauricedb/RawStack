(function() {
    'use strict';
    var module = angular.module("moviesAdminApp", ["moviesData", "ngGrid", "ngRoute", "rawAjaxBusyIndicator"]);

    module.config(function($routeProvider) {
        $routeProvider.when("/moviesAdminList", {
            controller: "moviesAdminListCtrl",
            templateUrl: "/app/moviesAdminList.html"
        });
        $routeProvider.otherwise({
            redirectTo: "/moviesAdminList"
        });
    });

    module.controller("moviesAdminListCtrl", function($scope, moviesSvc) {
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
            ]
        };
        var loadMoreMovies = function (moreData) {
            if (moreData) {
                moviesSvc.nextPage().then(loadMoreMovies);
            }
        };
        loadMoreMovies(true);
    });

}());