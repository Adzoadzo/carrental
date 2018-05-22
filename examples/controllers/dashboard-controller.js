function DashboardController($scope, $http, toastr) {
    console.log("Hello from Dashboard Controller");
    refresh_cars();

    $scope.add_car = function() {
        $http.post('/addCar', $scope.car).then(function(data) {
            $scope.car = null;
            //toastr.success("You are successfully registered! Please Login!", "Registration Successfull!");
            //$location.url('/login');
            $scope.cars_list.push(data);
            toastr.success('Car added successfully!');
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

    $scope.edit_car = function(car){
        $scope.car ={
          _id : car._id,
          car_name : car.car_name,
          car_price : car.car_price,
          car_year : car.car_year,
          car_engine : car.car_engine,
          car_power : car.car_power,
          car_transmission : car.car_transmission,
          car_gears : car.car_gears,
          car_doors : car.car_doors,
          car_picture : car.car_picture,
          car_min_years : car.car_min_years
        };
      }

    $scope.update_car = function(){
        $http.put('/car/'+$scope.car._id, $scope.car).then(function(data){
          refresh_cars();
          //console.log($scope.car);
          toastr.info('You have successfully updated car!');
          $scope.contact = null;
        });
      }
}