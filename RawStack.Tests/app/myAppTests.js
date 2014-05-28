describe("The moviesListCtrl", function () {
    'use strict';

    beforeEach(module("myApp"));

    it("can be created", inject(function ($controller, $rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller("moviesListCtrl", {
            $scope: scope,
            genres: [],
            director: ""
        });

        expect(ctrl).toBeDefined();
    }));
});


describe("The moviesListCtrl http requests", function () {
    'use strict';

    var scope, httpBackend;

    beforeEach(module("myApp"));

    beforeEach(inject(function ($controller, $httpBackend, $rootScope) {
        httpBackend = $httpBackend;

        scope = $rootScope.$new();
        $controller("moviesListCtrl", {
            $scope: scope,
            genres: [],
            director: ""
        });
    }));

    it("should populate the movies array when the HTTP request succeeds", function () {
        var movies = [
            { id: 1, title: "A movie" },
            { id: 2, title: "Another movie" }];

        httpBackend.expect("GET", "/api/movies?page=0").respond(movies);

        httpBackend.flush();

        expect(scope.movies).toEqual(movies);
    });

    it("should not populate the movies array when the HTTP request fails", function () {

        httpBackend.expect("GET", "/api/movies?page=0").respond(404);

        httpBackend.flush();

        expect(scope.movies).toEqual([]);
    });
});