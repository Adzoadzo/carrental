function CarsController($scope, $http){
    console.log("Hello from Cars Controller");

    var init = function(){
        get_cars();
      }

    var get_cars = function (){
        $http.get('/getCar').then(function(res){
          $scope.cars_list = res.data;
        }),function(res){
          alert(res.status);
        }
      };

      init();
}