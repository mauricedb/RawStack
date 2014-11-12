(function() {
    'use strict';
    var module = angular.module("moviesData", []);

    module.factory("moviesSvc", function($http, $q) {
        var movies = [];
        var page = 0;
        var genres, director;

        function get(id) {
            return $http.get("/api/movies/" + id);
        }

        function save(movie) {
            return $http.put("/api/movies/" + movie.id, movie).then(function(e) {
                var oldMovie = movies.filter((function(m) {
                     return m.id == movie.id;
                })).pop();
                angular.copy(movie, oldMovie);

                return e;
            });
        }

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

            genres = genres1 || [];
            director = director1;

            if (!movies.length) {
                page = 0;
                nextPage();
            }

            return movies;
        }

        return {
            get: get,
            save: save,
            query: query,
            nextPage: nextPage
        };
    });

}());