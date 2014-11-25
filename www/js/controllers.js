angular.module('starter.controllers', [])

.controller('MemberCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, $state, User, Employe) {
  
  $scope.logout = function () {
    User.logout(function () {
      $state.go('login')
    })
  }

})

.controller('LoginCtrl', function($scope, $rootScope, User, localStorageService, $ionicPopup, $timeout) {
  $scope.loginData = localStorageService.get('loginData') || {}
  
  var login = function (loginData) {
    User.login(loginData, function (accessToken) {
      localStorageService.set('loginData', $scope.loginData)
      $rootScope.$broadcast('AUTH_LOGIN', accessToken)
    }, function (res) {
      if(res.status === 401 && loginData.realm !== "owner") {
        loginData.realm = "owner"
        login(loginData)
      } else {
        var myPopup = $ionicPopup.show({
          title: '登录失败',
          subTitle: '用户名密码不正确',
          buttons: [{ text: '关闭' }]
        })
        $timeout(function() {
           myPopup.close();
        }, 3000)
      }
    })
  }
  
  $scope.tryLogin = function (loginData) {
    loginData.realm = "employe."+loginData.username
    login(loginData)
  }
  
  $scope.tryRegister = function (loginData) {
    loginData.email = loginData.username+"@example.com"
    loginData.realm = "owner"
    User.create(loginData, function (user) {
      login(loginData)
    }, function (res) {
      var myPopup = $ionicPopup.show({
        title: '注册失败',
        subTitle: '手机已经存在，请直接登录或换其他手机',
        buttons: [{ text: '关闭' }]
      })
      $timeout(function() {
         myPopup.close();
      }, 3000)
    })
  }
  
})

.controller('RegisterCtrl', function($scope, $rootScope, Merchant, User, localStorageService) {
  var now = Date.now()
  $scope.merchant = {
    name: "泛盈百货"+now,
    fullName: "泛盈百货有限公司"+now,
    ownerID: $scope.currentUser.id,
    telephone: $scope.currentUser.username,
    masterPhone: $scope.currentUser.username
  }
  
  $scope.blurCb = function (event) {
    $scope.merchant.fullName = $scope.merchant.name
  }
  
  $scope.tryMerchantRegister = function () {
    Merchant.create($scope.merchant, function (merchant) {
      var loginData = localStorageService.get('loginData')
      loginData.realm = "employe."+loginData.username
      User.login(loginData, function (accessToken) {
        $rootScope.$broadcast('AUTH_LOGIN', accessToken)
      }, function (res) {
        console.log('relogin as employe failure', res)
      })
    })
  }
})
