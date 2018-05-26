function DashboardController($scope, $http, toastr) {
    console.log("Hello from Dashboard Controller");
    refresh_cars();
    refresh_employees();
    refresh_users();

    $scope.add_car = function() {
        $http.post('/addCar', $scope.car).then(function(data) {
            $scope.car = null;
            //toastr.success("You are successfully registered! Please Login!", "Registration Successfull!");
            //$location.url('/login');
            $scope.cars_list.push(data);
            toastr.success('Car added successfully!');
            refresh_cars();
        });
    }

    $scope.add_employee = function() {
        $http.post('/addEmployee', $scope.employee).then(function(data) {
            $scope.employee = null;
            $scope.employee_list.push(data);
            toastr.success('Employee added successfully!');
            refresh_employees();
        });
    }

    function refresh_employees(){
        $http.get('/getEmployee').then(function(res){
            $scope.employee_list = res.data;
            get_expenses();
        }),
        function(res){
            alert(res.status);
        }
    }

    function refresh_cars() {
        $http.get('/getCar').then(function(res) {
                $scope.cars_list = res.data;
            }),
            function(res) {
                alert(res.status);
            }
    };

    function refresh_users(){
        $http.get('/getUser').then(function(res){
            $scope.users_list = res.data;
        }),
        function(res){
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

    $scope.edit_emp = function(employee){
        $scope.employee ={
            _id : employee._id,
            employee_name : employee.employee_name,
            employee_salary : employee.employee_salary,
            employee_country : employee.employee_country
        };
    }

    $scope.clear = function(car){
        $scope.car = {
            car_name : '',
            car_price : '',
            car_year : '',
            car_engine : '',
            car_power : '',
            car_transmission : '',
            car_gears : '',
            car_doors : '',
            car_picture : '',
            car_min_years : ''
        };
    }

    $scope.update_car = function(){
        $http.put('/car/'+$scope.car._id, $scope.car).then(function(data){
          refresh_cars();
          //console.log($scope.car);
          toastr.info('You have successfully updated car!');
          $scope.car = null;
        });
      }

    $scope.delete_car = function(car_id, car_name){
        $http.delete('/car/'+ car_id).then(function(data){
            refresh_cars();
            toastr.success(car_name + ' deleted');
        });
    }

    $scope.update_employee = function(){
        $http.put('/employee/'+$scope.employee._id, $scope.employee).then(function(data){
          refresh_employees();
          //console.log($scope.car);
          toastr.info('You have successfully updated employee!');
          $scope.employee = null;
        });
      }

    $scope.delete_employee = function(employee_id, employee_name){
        $http.delete('/employee/'+ employee_id).then(function(data){
            refresh_employees();
            toastr.success(employee_name + ' deleted');
        });
    }

    function get_expenses(){
        $http.get('/getEmpExpenses').then(function(res){
          $scope.expenses = res.data[0];
        }),function(response){
          alert(response.status);
        }
      };

    $scope.date = new Date();
}