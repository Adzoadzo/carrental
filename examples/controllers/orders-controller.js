function OrdersController($scope, $http, $routeParams){
    console.log('Hello from orders controller');
    get_params();

    $scope.parseInt = parseInt;

    function get_params(){
        $scope.car_name = $routeParams.car_name;
        $scope.car_price = $routeParams.car_price;
        $scope.pickup_location = $routeParams.pickup_location;
        $scope.pickup_date = $routeParams.pickup_date;
        $scope.pickup_time = $routeParams.pickup_time;
        $scope.return_location = $routeParams.return_location;
        $scope.return_date = $routeParams.return_date;
        $scope.return_time = $routeParams.return_time;
    }

    $scope.make_order = function(car_name, car_price, pickup_location, pickup_date, pickup_time, return_location, return_date, return_time){
        $http.post('/makeOrder/' + car_name + '/' + car_price + '/' + pickup_location + '/' + pickup_date
        + '/' + pickup_time + '/' + return_location + '/' + return_date + '/' + return_time).then(function(data) {
            console.log(data);
        });
    }

    function get_orders(){
        $http.get('getOrders').then(function(res){
            $scope.orders_list = res.data;
        }),
        function(res){
            alert(res.status);
        }
    };
}