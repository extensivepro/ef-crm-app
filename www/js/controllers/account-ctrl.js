controllers

.controller('AccountCtrl', function($scope, CurrentEmploye, $state, User, CurrentEmploye, $ionicPopup) {
  
  $scope.currentEmploye = CurrentEmploye
  
  $scope.logout = function () {    
    User.logout(function () {
      CurrentEmploye.clearEmploye()
      $state.go('login')
    })
  }

  $scope.changePassword = function () {
    $scope.inputData = {password:'', password2:''}
		$scope.alert = undefined

    $ionicPopup.show({
      templateUrl: 'change-password-popup.html',
      title: '修改密码',
      subTitle: '请输入6位新密码',
      scope: $scope,
      buttons: [
        { text: '取消' },
        {
          text: '<b>确定</b>',
          type: 'button-positive',
          onTap: function(e) {
            if ($scope.inputData.password.length < 6) {
							$scope.alert = '密码不能少于6位'
              e.preventDefault()
						} else if ($scope.inputData.password !== $scope.inputData.password2) {
							console.log($scope.inputData)
							$scope.alert = '两次输入的密码不一致'
              e.preventDefault()
            } else {
              return $scope.inputData;
            }
          }
        },
      ]
    }).then(function(res) {
      if(!res) return
			
	    User.upsert({
	      id: User.getCurrentId(),
	      password: res.password
	    }, function (user) {
        $ionicLoading.show({
          template: '<i class="icon ion-ios7-checkmark-outline padding"></i>密码修改成功',
          duration: 1000
        })
	    }, function (res) {
        $ionicLoading.show({
          template: '<i class="icon ion-ios7-close-outline padding"></i>更新用户密码失败',
          duration: 2000
        })
	    })
    })
  }

})

.controller('LoginCtrl', function($scope, $rootScope, User, $ionicLoading) {
  var loginDataString = localStorage['$EFCRM$LoginData'] || null
  $scope.loginData =  (loginDataString && JSON.parse(loginDataString)) || {}
  
  var login = function (loginData) {
    $ionicLoading.show({
      template: '<i class="icon ion-loading-c ion-loading padding"></i>正在登录...'
    })
    User.login(loginData, function (accessToken) {
      $ionicLoading.show({
        template: '<i class="icon ion-ios7-checkmark-outline padding"></i>登录成功',
        duration: 1000
      })
      
      localStorage['$EFCRM$LoginData'] = JSON.stringify($scope.loginData)
      $rootScope.$broadcast('AUTH_LOGIN', accessToken)
    }, function (res) {
      if(res.status === 401 && loginData.realm !== "owner") {
        loginData.realm = "owner"
        login(loginData)
      } else {
        $ionicLoading.show({
          template: '<i class="icon ion-ios7-close-outline padding"></i>用户名密码不正确',
          duration: 2000
        })
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

    $ionicLoading.show({
      template: '<i class="icon ion-loading-c ion-loading padding"></i>正在注册新账户...'
    })

    User.create(loginData, function (user) {
      $ionicLoading.show({
        template: '<i class="icon ion-ios7-checkmark-outline padding"></i>注册账户成功',
        duration: 1000
      })
      login(loginData)
    }, function (res) {
      $ionicLoading.show({
        template: '<i class="icon ion-ios7-close-outline padding"></i>手机已经存在，请直接登录或换其他手机',
        duration: 2000
      })
    })
  }
  
})

.controller('RegisterCtrl', function($scope, $rootScope, Merchant, User, $ionicLoading) {
  var now = Date.now()
  $scope.merchant = {
    name: "泛盈百货"+now,
    fullName: "泛盈百货有限公司"+now,
    ownerID: User.getCurrentId(),
    telephone: User.getCachedCurrent().username,
    masterPhone: User.getCachedCurrent().username
  }
  
  $scope.blurCb = function (event) {
    $scope.merchant.fullName = $scope.merchant.name
  }
  
  $scope.tryMerchantRegister = function () {
    $ionicLoading.show({
      template: '<i class="icon ion-loading-c ion-loading padding"></i>正在注册新账户...'
    })

    Merchant.create($scope.merchant, function (merchant) {
      $ionicLoading.show({
        template: '<i class="icon ion-ios7-checkmark-outline padding"></i>注册商户成功',
        duration: 1000
      })
      var loginData = JSON.parse(localStorage['$EFCRM$LoginData'])
      loginData.realm = "employe."+loginData.username
      // First employe of merchant is created automaticly, default password is "123456"
      var savedPassword = loginData.password
      loginData.password = "123456"
      User.login(loginData, function (accessToken) {
        User.upsert({
	        id: User.getCurrentId(),
	        password: savedPassword
        })
        $rootScope.$broadcast('AUTH_LOGIN', accessToken)
      }, function (res) {
        $ionicLoading.show({
          template: '<i class="icon ion-ios7-close-outline padding"></i>店长登录失败',
          duration: 2000
        })
      })
    }, function (res) {
      $ionicLoading.show({
        template: '<i class="icon ion-ios7-close-outline padding"></i>注册商户失败',
        duration: 2000
      })
    })
  }
})
