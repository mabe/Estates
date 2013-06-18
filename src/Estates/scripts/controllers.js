(function () {
    angular.module("estates-app", ["google-maps"]);
}());

function EstatesCtrl($scope, $http) {
    $http.get('estates').success(function (data) {
        $scope.estates = data.Estates;
        $scope.markersProperty = data.Estates.map(function (estate) { return { latitude: estate.Lat, longitude: estate.Long }; });
    });

    $scope.centerProperty = { latitude: 57.107112, longitude: 12.249756 };
    $scope.zoomProperty = 14;
}