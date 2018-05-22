function DashboardController($scope, $http) {
    console.log("Hello from Dashboard Controller");
    refresh_cars();

    $scope.add_car = function() {
        $http.post('/addCar', $scope.car).then(function(data) {
            $scope.car = null;
            //toastr.success("You are successfully registered! Please Login!", "Registration Successfull!");
            //$location.url('/login');
            $scope.cars_list.push(data);
        });
    }

    function refresh_cars() {
        $http.get('/getCar').then(function(res) {
                $scope.cars_list = res.data;
            }),
            function(res) {
                alert(res.status);
            }
    };
}