function SiteController($scope, $http, toastr, $location){
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
            $location.url('/');
        }),function(error){
            console.log(error);
        }
    }

    $scope.logout = function(){
        localStorage.clear();
        toastr.info("Successfully logged out!", "Logged Out!");
    }

    $scope.getSingle = function(id){
        $http.get('/getSingle/' + id).then(function(res) {
            $scope.car_info = res.data[0];
            console.log($scope.car_info);
        })
    };
}