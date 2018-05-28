function OrdersController($scope, $http, $routeParams){
    console.log('Hello from orders controller');
    get_params();

    function get_params(){
        $scope.car_name = $routeParams.car_name;
        $scope.car_price = $routeParams.car_price;
        $scope.pickup_location = $routeParams.pickup_location;
        $scope.pickup_date = $routeParams.pickup_date;
        $scope.pickup_time = $routeParams.pickup_time;
        $scope.return_location = $routeParams.return_location;
        $scope.return_date = $routeParams.return_time;
        $scope.return_time = $routeParams.return_time;
    }
}