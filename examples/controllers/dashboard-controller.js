function DashboardController($scope, $http, toastr) {
    console.log("Hello from Dashboard Controller");
    var config = {headers:  {
        'Authorization': 'Basic TmljayBDZXJtaW5hcmE6cGFzc3dvcmQ=',
        'Accept': 'application/json;odata=verbose',
        "JWT" : localStorage.getItem('user')
        }
      };

    refresh_cars();
    refresh_employees();
    refresh_users();
    refresh_manufacturers();
    get_orders();

    $scope.add_car = function() {
        $http.post('/admin/addCar', $scope.car, config).then(function(data) {
            $scope.car = null;
            //toastr.success("You are successfully registered! Please Login!", "Registration Successfull!");
            //$location.url('/login');
            $scope.cars_list.push(data);
            toastr.success('Car added successfully!');
            refresh_cars();
        });
    }

    $scope.add_employee = function() {
        $http.post('/admin/addEmployee', $scope.employee, config).then(function(data) {
            $scope.employee = null;
            $scope.employee_list.push(data);
            toastr.success('Employee added successfully!');
            refresh_employees();
        });
    }

    function refresh_employees(){
        $http.get('/admin/getEmployee', config).then(function(res){
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

    function refresh_manufacturers() {
        $http.get('/getManufacturer').then(function(res) {
                $rootScope.manufacturers_list = res.data;
            }),
            function(res) {
                alert(res.status);
            }
    };

    function refresh_users(){
        $http.get('/admin/getUser', config).then(function(res){
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

    $scope.edit_man = function(manufacturer){
        $scope.manufacturer = {
            _id : manufacturer._id,
            manufacturer_name : manufacturer.manufacturer_name,
            manufacturer_picture : manufacturer.manufacturer_picture,
            manufacturer_frontTxt : manufacturer.manufacturer_frontTxt,
            manufacturer_backTxt : manufacturer.manufacturer_backTxt
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
        $http.put('/admin/car/'+$scope.car._id, $scope.car, config).then(function(data){
          refresh_cars();
          //console.log($scope.car);
          toastr.info('You have successfully updated car!');
          $scope.car = null;
        });
      }

    $scope.delete_car = function(car_id, car_name){
        $http.delete('/admin/car/'+ car_id, config).then(function(data){
            refresh_cars();
            toastr.success(car_name + ' deleted');
        });
    }

    $scope.update_employee = function(){
        $http.put('/admin/employee/'+$scope.employee._id, $scope.employee, config).then(function(data){
          refresh_employees();
          //console.log($scope.car);
          toastr.info('You have successfully updated employee!');
          $scope.employee = null;
        });
      }

    $scope.delete_employee = function(employee_id, employee_name){
        $http.delete('/admin/employee/'+ employee_id, config).then(function(data){
            refresh_employees();
            toastr.success(employee_name + ' deleted');
        });
    }

    function get_expenses(){
        $http.get('/admin/getEmpExpenses', config).then(function(res){
          $scope.expenses = res.data[0];
        }),function(response){
          alert(response.status);
        }
      };

    function get_orders(){
        $http.get('/admin/getOrders', config).then(function(res){
            $scope.orders_list = res.data;
            get_incomes();
        }),
        function(res){
            alert(res.status);
        }
    };

    function get_incomes(){
        $http.get('/admin/getRentIncomes', config).then(function(res){
            $scope.incomes = res.data[0];
        });
    }

    $scope.add_manufacturer = function() {
        $http.post('/admin/addManufacturer', $scope.manufacturer, config).then(function(data) {
            $scope.manufacturer = null;
            //toastr.success("You are successfully registered! Please Login!", "Registration Successfull!");
            //$location.url('/login');
            $scope.manufacturers_list.push(data);
            toastr.success('Manufacturer added successfully!');
            refresh_manufacturers();
        });
    }

    $scope.update_manufacturer = function(){
        $http.put('/admin/manufacturer/'+$scope.manufacturer._id, $scope.manufacturer, config).then(function(data){
          refresh_manufacturers();
          //console.log($scope.car);
          toastr.info('You have successfully updated manufacturer!');
          $scope.manufacturer = null;
        });
      }

    $scope.delete_manufacturer = function(manufacturer_id, manufacturer_name){
        $http.delete('/admin/manufacturer/'+ manufacturer_id, config).then(function(data){
            refresh_manufacturers();
            toastr.success(manufacturer_name + ' deleted');
        });
    }

    $scope.date = new Date();
}