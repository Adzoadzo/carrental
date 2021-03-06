function CarsController($scope, $http, $routeParams) {
  console.log("Hello from Cars Controller");

  var config = {headers:  {
    'Authorization': 'Basic TmljayBDZXJtaW5hcmE6cGFzc3dvcmQ=',
    'Accept': 'application/json;odata=verbose',
    "JWT" : localStorage.getItem('user')
    }
  };

  var init = function() {
      get_cars();
  }

  var get_cars = function() {
      $http.get('/getCar').then(function(res) {
              $scope.cars_list = res.data;
          }),
          function(res) {
              alert(res.status);
          }
  };

  $scope.get_carById = function(car_id) {
      console.log("get car with id " + car_id);
      $http.get('/singleCar/' + car_id, config).then(function(data) {
      });
  }

  init();
}