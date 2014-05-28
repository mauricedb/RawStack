(function() {
    var module = angular.module("moviesData", []);

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

            genres = genres1 || [];
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

}());