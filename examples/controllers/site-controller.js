function SiteController($scope, $http, toastr){
    console.log("Hello from Site Controller");

    $scope.check_login = function(){
        if(localStorage.getItem('user')){
            return true;
        }
        return false;
    }

    $scope.login = function(credentials){
        $http.post('/login', credentials).then(function(response){
            localStorage.setItem('user',response.data.token)
            toastr.success('Hi, you are successfully logged in!', 'Login Success!');
        }),function(error){
            console.log(error);
        }
    }

    $scope.logout = function(){
        localStorage.clear();
        toastr.info("Successfully logged out!", "Logged Out!");
    }
}