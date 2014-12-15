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
	    }, function (res) {
	      $scope.alerts.push({type: 'danger', msg: '更新用户密码失败'})      
	    })
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
    ownerID: User.getCurrentId(),
    telephone: User.getCachedCurrent().username,
    masterPhone: User.getCachedCurrent().username
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
