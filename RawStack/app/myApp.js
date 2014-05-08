(function() {
    'use strict';
    var module = angular.module("myApp", ["infinite-scroll", "ngRoute", "rawAjaxBusyIndicator"]);

    module.config(function($routeProvider) {
        $routeProvider.when("/movies", {
            controller: "moviesListCtrl",
            templateUrl: "/app/moviesList.html",
            resolve: {
                genres: function() {
                    return [];
                },
                director: function() {
                    return undefined;
                }
            }
        });
        $routeProvider.when("/movies/genres/:genres", {
            controller: "moviesListCtrl",
            templateUrl: "/app/moviesList.html",
            resolve: {
                genres: function($route) {
                    var genres = $route.current.params.genres;
                    return genres.split(",");
                },
                director: function() {
                    return undefined;
                }
            }
        });
        $routeProvider.when("/movies/director/:director", {
            controller: "moviesListCtrl",
            templateUrl: "/app/moviesList.html",
            resolve: {
                genres: function() {
                    return [];
                },
                director: function($route) {
                    return $route.current.params.director;
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

    module.factory("moviesSvc", function($http, $q) {
        var movies = [];
        var page = 0;
        var genres, director;


        function nextPage() {
            var defer = $q.defer();

            var queryStr = "";
            if (genres.length) {
                queryStr = "&genres=" +
                    genres
                        .map(encodeURIComponent)
                        .join("&genres=");
            }

            if (director) {
                queryStr += "&director=" + encodeURIComponent(director);
            }

            $http.get("/api/movies?page=" + page + queryStr).then(function(e) {
                [].push.apply(movies, e.data);
                defer.resolve(!!e.data.length);
            });
            page++;

            return defer.promise;
        }

        function query(genres1, director1) {
            if (director !== director1)
                movies.length = 0;

            genres = genres1;
            director = director1;

            if (!movies.length) {
                page = 0;
                nextPage();
            }

            return movies;
        }

        return {
            query: query,
            nextPage: nextPage
        };
    });

    module.controller("moviesListCtrl", function($scope, $location, $window, genres, moviesSvc, director, $timeout) {
        $scope.loadingData = false;

        $scope.movies = moviesSvc.query(genres, director);


        // Taken from http://stackoverflow.com/questions/14107531/retain-scroll-position-on-route-change-in-angularjs
        $window.scrollPos = window.scrollPos || {};

        $($window).on('scroll', function() {
            if ($scope.okSaveScroll) {
                $window.scrollPos[$location.path()] = $($window).scrollTop();
            }
        });

        $scope.$on('$routeChangeStart', function() {
            $scope.okSaveScroll = false;
        });

        $scope.$on('$routeChangeSuccess', function() {
            $timeout(function() {
                var scrollPos = $window.scrollPos[$location.path()];

                if (scrollPos) {
                    $($window).scrollTop(scrollPos);
                }

                $scope.okSaveScroll = true;
            }, 100);
        });


        $scope.nextPage = function() {
            $scope.loadingData = true;

            moviesSvc.nextPage().then(function(newMoviesLoaded) {
                $scope.loadingData = !newMoviesLoaded;
            });
        };

        $scope.filterByGenre = function(genre) {
            genres.push(genre);
            $location.path("/movies/genres/" + genres.join(","));
        };

        $scope.showMoviePoster = function() {
            var width = ($window.innerWidth > 0) ? $window.innerWidth : $window.screen.width;
            return width > 767;
        };

        $window.onresize = function() {
            $scope.$digest();
        };
    });

    mod.controller("movieDetailsCtrl", function($scope, $http, $routeParams) {
        $http.get("/api/movies/" + $routeParams.id).then(function(e) {
            $scope.movie = e.data;
        }, function(err) {

        });

    });
}());