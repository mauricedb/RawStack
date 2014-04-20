(function () {
    'use strict';
    var module = angular.module("myApp", ["infinite-scroll", "ngRoute", "rawAjaxBusyIndicator"]);

    module.config(function ($routeProvider) {
        $routeProvider.when("/movies", {
            controller: "moviesListCtrl",
            templateUrl: "/app/moviesList.html",
            resolve: {
                genres: function () {
                    return [];
                }
            }
        });
        $routeProvider.when("/movies/genres/:genres", {
            controller: "moviesListCtrl",
            templateUrl: "/app/moviesList.html",
            resolve: {
                genres: function ($route) {
                    var genres = $route.current.params.genres;
                    return genres.split(",");
                }
            }
        });
        $routeProvider.when("/movies/:id", {
            controller: "movieDetailsCtrl",
            templateUrl: "/app/movieDetails.html"
        });

        $routeProvider.otherwise({
            redirectTo: "/movies"
        });
    });

    module.controller("moviesListCtrl", function ($scope, $http, $location, $window, genres) {
        var page = 0;
        $scope.movies = [];
        $scope.loadingData = false;

        $scope.nextPage = function () {
            $scope.loadingData = true;

            var genresQuery = "";
            if (genres.length) {
                genresQuery = "&genres=" +
                    genres
                        .map(encodeURIComponent)
                        .join("&genres=");
            }

            $http.get("/api/movies?page=" + page + genresQuery).then(function (e) {
                page++;
                [].push.apply($scope.movies, e.data);
                $scope.loadingData = !e.data.length;
            });
        };

        $scope.nextPage();

        $scope.newMovie = { title: "" };
        $scope.addMovie = function () {
            $http.post("/api/movies", $scope.newMovie).then(function () {
                window.location = window.location;
            });
        };

        $scope.filterByGenre = function (genre) {
            genres.push(genre);
            $location.path("/movies/genres/" + genres.join(","));
        };

        $scope.showMoviePoster = function () {
            var width = ($window.innerWidth > 0) ? $window.innerWidth : $window.screen.width;
            return width > 767;
        };

        $window.onresize = function () {
            $scope.$digest();
        };
    });

    mod.controller("movieDetailsCtrl", function ($scope, $http, $routeParams) {
        $http.get("/api/movies/" + $routeParams.id).then(function(e) {
            $scope.movie = e.data;
        }, function (err) {

        });

    });
}());