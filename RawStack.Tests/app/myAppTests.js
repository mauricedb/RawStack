describe("The moviesCtrl", function () {
    'use strict';

    beforeEach(module("myApp"));

    it("can be created", inject(function ($controller) {
        var scope = {};
        var ctrl = $controller("moviesCtrl", {
            $scope: scope
        });

        expect(ctrl).toBeDefined();
    }));
});

describe("The moviesCtrl scope", function () {
    'use strict';

    var scope;

    beforeEach(module("myApp"));

    beforeEach(inject(function ($controller) {
        scope = {};
        $controller("moviesCtrl", {
            $scope: scope
        });
    }));

    it("has a newMovie object", function () {
        expect(scope.newMovie).toEqual({ Title: "" });
    });

    it("has a addMovie function", function () {
        expect(typeof scope.addMovie).toBe("function");
    });
});


describe("The moviesCtrl http requests", function () {
    'use strict';

    var scope, httpBackend;

    beforeEach(module("myApp"));

    beforeEach(inject(function ($controller, $httpBackend) {
        httpBackend = $httpBackend;

        scope = {};
        $controller("moviesCtrl", {
            $scope: scope
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