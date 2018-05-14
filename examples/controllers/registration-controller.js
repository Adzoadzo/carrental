function RegistrationController($scope, $http){
    console.log("Hello from Registration Controller");

    $scope.add_user = function(){
        $http.post('/user', $scope.user).then(function(data){
          $scope.user = null;
          $scope.user_list.push(data);
          console.log("aaa");
        });
      }
}