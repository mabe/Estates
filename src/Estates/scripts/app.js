"use strict";

(function () {
    "use strict";

    var app = angular.module('estates-app', ['google-maps', 'ui.bootstrap']).config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/estates', { templateUrl: 'partials/estates.html', controller: 'EstatesCtrl' })
            .otherwise({ redirectTo: '/estates' });
    }]);

    app.service('geolocation', function ($rootScope) {
        this.currentPosition = function (callback) {
            window.navigator.geolocation.getCurrentPosition(function (position) {
                $rootScope.$apply(function () { 
                    callback(new Coordinate(position.coords.latitude, position.coords.longitude));
                });
            });
        };
    });

    app.controller('EstatesCtrl', function EstatesCtrl($scope, $http, $dialog, geolocation) {
        $scope.zoomProperty = 14;
        $scope.centerProperty = new Coordinate(0.0, 0.0);

        geolocation.currentPosition(function (coords) {
            $scope.centerProperty = coords;
            $http.get('/estates/?latitude=' + coords.latitude + '&longitude=' + coords.longitude).success(function (model) {
                $scope.estates = model.Estates;
                $scope.markersProperty = model.Estates.map(function (estate) { return new Coordinate(estate.Lat, estate.Long); });
            });
        });

        $scope.openCreate = function () {
            $dialog.dialog({ templateUrl: '/partials/estate-create.html', controller: 'EstateCreateCtrl' }).open();
        };

        $scope.openDetail = function (estate) {
            $dialog.dialog({ templateUrl: '/partials/estate-detail.html', controller: 'EstateDetailCtrl', resolve: { item: function () { return angular.copy(estate); } } }).open();
        };

        $scope.$on('ADDED_ESTATE', function (e, arg) {
            $scope.estates.push(arg);
            $scope.markersProperty.push(new Coordinate(arg.Lat, arg.Long));
        });
    });

    app.controller('EstateCreateCtrl', function EstateCreateCtrl($scope, $rootScope, $http, dialog) {
        $scope.estate = { Address: 'Lilla Drottninggatan 6', Zip: '43245', City: 'Varberg', Lat: 57.110133, Long: 12.252953 };

        $scope.lookupCoordinates = function () {
            new google.maps.Geocoder().geocode({ address: $scope.estate.Address + ', ' + $scope.estate.City }, function (results, status) {
                if (status !== google.maps.GeocoderStatus.OK) {
                    return;
                }

                var lat_long = results[0].geometry.location;

                $scope.$apply(function () {
                    $scope.estate.Lat = lat_long.jb;
                    $scope.estate.Long = lat_long.kb;
                });
            });
        };

        $scope.createEstate = function () {
            $http.post('/estates', $scope.estate).success(function (estate) {
                $rootScope.$broadcast('ADDED_ESTATE', estate);

                dialog.close();
            });
        };
    });

    app.controller('EstateDetailCtrl', function EstateDetailCtrl($scope, $dialog, item, dialog) {
        $scope.estate = item;

        $scope.openEdit = function () {
            $dialog.dialog({ templateUrl: '/partials/estate-edit.html', controller: 'EstateEditCtrl', resolve: { item: function () { return angular.copy(item); } } }).open();
            dialog.close();
        };
    });

    app.controller('EstateEditCtrl', function EstateEditCtrl($scope, $http, item, dialog) {
        $scope.estate = item;

        $scope.editEstate = function () {
            $http.put('/' + item.Id, $scope.estate).success(function () {
                dialog.close();
            });
        };
    });
}());

function Coordinate(lat, long) {
    this.latitude = lat;
    this.longitude = long;
}





