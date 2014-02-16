(function () {
    'use strict';
    var module = angular.module("myApp", []);

    module.controller("moviesCtrl", function ($scope, $http) {
        $http.get("/api/movies").then(function (e) {
            $scope.movies = e.data;
        });
        
        $scope.newMovie = { Title: "" };
        $scope.addMovie = function () {
            $http.post("/api/movies", $scope.newMovie).then(function () {
                window.location = window.location;
            });
        };
    });
}());
