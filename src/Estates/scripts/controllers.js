"use strict";

(function () {
    "use strict";

    var app = angular.module('estates-app', ['google-maps', 'ui.bootstrap']).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/estates', { templateUrl: 'partials/estates.html', controller: 'EstatesCtrl' })
            .otherwise({ redirectTo: '/estates' });
    }]);

    app.controller('EstatesCtrl', ['$scope', '$http', '$dialog', function ($scope, $http, $dialog) {
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

        $scope.$on('ADDED_ESTATE', function (e, arg) {
            $scope.estates.push(arg);
            $scope.markersProperty.push(new Coordinate(arg.Lat, arg.Long));
        });
    }]);

    app.controller('EstateCreateCtrl', ['$scope', '$rootScope', '$http', 'dialog', function ($scope, $rootScope, $http, dialog) {
        $scope.estate = { Address: 'Lilla Drottninggatan 6', Zip: '43245', City: 'Varberg', Lat: 57.110133, Long: 12.252953 };

        $scope.createEstate = function () {
            $http.post('estates', $scope.estate).success(function (estate) {
                $rootScope.$broadcast('ADDED_ESTATE', estate);

                dialog.close();
            });
        };
    }]);

    app.controller('EstateDetailCrtl', ['$scope', 'item', 'dialog', function ($scope, item, dialog) {
        $scope.estate = item;
    }]);
}());

function Coordinate(lat, long) {
    this.latitude = lat;
    this.longitude = long;
}





