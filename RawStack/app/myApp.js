(function () {
    'use strict';
    var module = angular.module("myApp", ["infinite-scroll"]);

    module.controller("moviesCtrl", function ($scope, $http) {
        var page = 0;
        $scope.movies = [];
        $scope.loadingData = false;

        $scope.nextPage = function () {
            $scope.loadingData = true;
            $http.get("/api/movies?page=" + page).then(function (e) {
                page++;
                [].push.apply($scope.movies, e.data);
                $scope.loadingData = false;
            });
        };

        $scope.nextPage();
        
        $scope.newMovie = { Title: "" };
        $scope.addMovie = function () {
            $http.post("/api/movies", $scope.newMovie).then(function () {
                window.location = window.location;
            });
        };
    });
}());
