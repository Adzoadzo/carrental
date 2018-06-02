function SiteController($scope, $http, toastr, $location){
    console.log("Hello from Site Controller");

    refresh_manufacturers();

    $scope.check_login = function(){
        if(localStorage.getItem('user')){
            return true;
        }
        return false;
    }

    $scope.check_admin = function(){
        if(localStorage.getItem('type') == "admin"){
            return true;
        }
        return false;
    }

    $scope.login = function(credentials){
        $http.post('/login', credentials).then(function(response){
            localStorage.setItem('user',response.data.token)
            localStorage.setItem('type', response.data.type)
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

    $scope.sendmail = function(email){
        $http.post('/sendmail', email).then(function(response){
            toastr.success('Email Sent!');
        }),function(error){
            console.log(error);
        }
    }

    function refresh_manufacturers() {
        $http.get('/getManufacturer').then(function(res) {
                $scope.manufacturers_list = res.data;
            }),
            function(res) {
                alert(res.status);
            }
    };

    $scope.getSingle = function(id){
        $http.get('/getSingle/' + id).then(function(res) {
            $scope.car_info = res.data[0];
            console.log($scope.car_info);
        })
    };

    $scope.openNavigationDrawer = function(){
        if ($scope.mobileNavigationOpen == 'nav-open'){
            $scope.mobileNavigationOpen = '';
        }else{
            $scope.mobileNavigationOpen = 'nav-open';
        }
        
    }

    $scope.menuItemClicked = function(){
        $scope.mobileNavigationOpen = '';
    }
}