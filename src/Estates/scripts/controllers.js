"use strict";

(function () {
    var app = angular.module('estates-app', ['google-maps', 'ui.bootstrap']).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/estates', { templateUrl: 'partials/estates.html', controller: EstatesCtrl })
            .otherwise({ redirectTo: '/estates' });
    }]);

    app.factory('publish', function ($rootScope) {
        var publish = {};

        publish.addEstate = function (item) {
            publish.arg = item;

            $rootScope.$broadcast('ADDED_ESTATE');
        };

        return publish;
    });
}());

function Coordinate(lat, long) {
    this.latitude = lat;
    this.longitude = long;
}

function EstatesCtrl($scope, $http, $dialog, publish) {
    

    $http.get('estates').success(function (model) {
        $scope.estates = model.Estates;
        $scope.markersProperty = model.Estates.map(function (estate) { return new Coordinate(estate.Lat, estate.Long); });
    });

    $scope.centerProperty = { latitude: 57.107112, longitude: 12.249756 };
    $scope.zoomProperty = 14;

    $scope.openCreate = function () {
        $dialog.dialog({ templateUrl: '/partials/estate-create.html', controller: 'EstateCreateCtrl' }).open();
    };

    $scope.openDetail = function (estate) {
        $dialog.dialog({ templateUrl: '/partials/estate-detail.html', controller: 'EstateDetailCrtl', resolve: { item: function () { return angular.copy(estate); } } }).open();
    };

    $scope.$on('ADDED_ESTATE', function () {
        $scope.estates.push(publish.arg);
        $scope.markersProperty.push(new Coordinate(publish.arg.Lat, publish.arg.Long));
    });
}

function EstateCreateCtrl($scope, $http, publish, dialog) {
    $scope.estate = { Address: 'Lilla Drottninggatan 6', Zip: '43245', City: 'Varberg', Lat: 57.110133, Long: 12.252953 };

    $scope.createEstate = function () {
        $http.post('estates', $scope.estate).success(function (estate) {
            publish.addEstate(estate);

            dialog.close();
        });
    };
}

function EstateDetailCrtl($scope, item, dialog) {
    $scope.estate = item;
}