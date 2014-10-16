angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, $state, User, Employe) {
  
  $scope.employe = {"name":'', phone:''}
  $scope.logout = function () {
    User.logout()
    $state.go('login')
  }
  
  User.getCurrent(function (user) {
    Employe.findById({id:user.employeId}, function (employe) {
      $scope.employe = employe
    })
  })
  
})

.controller('LoginCtrl', function($scope, $rootScope, User) {
  $scope.loginData = {username:"13357828347", password:"123456"}
  $scope.tryLogin = function () {
    User.login($scope.loginData, function (user) {
      $rootScope.$broadcast('AUTH_LOGIN', user)
    })
  }
  
  $scope.tryRegister = function () {
    $scope.loginData.email = $scope.loginData.username+"@extensivepro.com"
    User.create($scope.loginData, function (user) {
      console.log('register', user)
      $scope.tryLogin()
    }, function (res) {
      console.log('register error', res)
    })
  }
})

.controller('RegisterCtrl', function($scope, $rootScope, Merchant, Employe, User, $state) {
  $scope.employe = {
    "name":"张三丰", 
    idcard:"320105196601122012", 
    cardNo:"30012345678",
    userId: $rootScope.currentUser.id,
    telephone: $rootScope.currentUser.username,
    mobilephone: $rootScope.currentUser.username
  }
  
  $scope.tryMerchantRegister = function () {
    Merchant.create($scope.ssc, function (ssc) {
      $state.go('tab.task')
    })
  }
})
