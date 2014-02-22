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
