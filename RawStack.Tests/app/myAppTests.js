describe("The moviesListCtrl", function () {
    'use strict';

    beforeEach(module("myApp"));

    it("can be created", inject(function ($controller) {
        var scope = {};
        var ctrl = $controller("moviesListCtrl", {
            $scope: scope,
            genres:[]
        });

        expect(ctrl).toBeDefined();
    }));
});

describe("The moviesListCtrl scope", function () {
    'use strict';

    var scope;

    beforeEach(module("myApp"));

    beforeEach(inject(function ($controller) {
        scope = {};
        $controller("moviesListCtrl", {
            $scope: scope,
            genres: []
        });
    }));

    it("has a newMovie object", function () {
        expect(scope.newMovie).toEqual({ Title: "" });
    });

    it("has a addMovie function", function () {
        expect(typeof scope.addMovie).toBe("function");
    });
});


describe("The moviesListCtrl http requests", function () {
    'use strict';

    var scope, httpBackend;

    beforeEach(module("myApp"));

    beforeEach(inject(function ($controller, $httpBackend) {
        httpBackend = $httpBackend;

        scope = {};
        $controller("moviesListCtrl", {
            $scope: scope,
            genres: []
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