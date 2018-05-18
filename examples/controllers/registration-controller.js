function RegistrationController($scope, $http, toastr){
    console.log("Hello from Registration Controller");

    $scope.add_user = function(){
        $http.post('/register', $scope.user).then(function(data){
          $scope.user = null;
          toastr.success("You are successfully registered!", "Registration Successfull!")
          //$scope.user_list.push(data);
        });
      }
}