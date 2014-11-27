angular.module('starter.controllers', ['baseController'])

.controller('MemberCtrl', function($scope, $controller, Member, $ionicModal, $state) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Member
  $scope.search.orFields = ['name', 'phone']
  
  $scope.$watch('search.text', function (newValue, oldValue) {
    $scope.fetch()
  })
  
  $ionicModal.fromTemplateUrl('member-add-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
    $scope.entity = {}
  })
  $scope.openModal = function() {
    $scope.modal.show()
  }
  $scope.closeModal = function() {
    $scope.modal.hide()
  }
  $scope.tryCreate = function () {
    $scope.entity.merchantID = $scope.currentEmploye.merchant.id
    Member.create($scope.entity, function (member) {
      $scope.modal.hide()
      $scope.fetch()
    }, function (res) {
      console.log('create member faulure', res)
    })
  }
  $scope.blurCb = function ($event) {
    $scope.entity.code = $scope.entity.code || $scope.entity.phone
  }
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove()
  })
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  })
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  })
  
  $scope.goDetail = function (entity) {
    $state.go('tab.members-detail', {member:JSON.stringify(entity)}, {location: true})
  }
})

.controller('MemberDetailCtrl', function($scope, $stateParams, Member, Point, Bill, $ionicPopup, $ionicModal) {
  var entity = JSON.parse($stateParams.member)
  $scope.entity = entity

  $scope.calculatePointPopup = function () {
    $scope.data = {point:0, reason:'手动累积'}

    $ionicPopup.show({
      templateUrl: 'member-point-popup.html',
      title: '积分管理',
      subTitle: '请输入你需要累积或兑换礼品的积分数量',
      scope: $scope,
      buttons: [
        { text: '取消' },
        {
          text: '<b>确定</b>',
          type: 'button-positive',
          onTap: function(e) {
            if ($scope.data.point === 0) {
              e.preventDefault();
            } else {
              if($scope.data.reason !== '手动累积') $scope.data.point = 0-$scope.data.point
              return $scope.data;
            }
          }
        },
      ]
    }).then(function(res) {
      if(!res) return;
      Point.create({
        point: res.point,
        memberID: $scope.entity.id,
        agentID: $scope.currentUser.employeID,
        reason: res.reason
      }, function (point) {
        $scope.entity.postPoint = point.postPoint
        $scope.entity.postTotalPoint = point.postTotalPoint
      }, function (res) {
        $scope.alerts.push({type: 'danger', msg: '积分操作失败'})
      })
    })
  }
  
  $scope.operatePrepayPopup = function () {
    $scope.prepayData = {amount:0, dealType:'prepay'}

    $ionicPopup.show({
      templateUrl: 'member-prepay-popup.html',
      title: '储值管理',
      subTitle: '请输入你需要预存或提现的金额',
      scope: $scope,
      buttons: [
        { text: '取消' },
        {
          text: '<b>确定</b>',
          type: 'button-positive',
          onTap: function(e) {
            if ($scope.prepayData.amount === 0) {
              e.preventDefault();
            } else {
              return $scope.prepayData;
            }
          }
        },
      ]
    }).then(function(res) {
      if(!res) return;
      var amount = res.amount*100
      var now = Math.floor(Date.now()/1000)
      var opt = {
        dealType: res.dealType,
        amount: amount,
        billNumber: now,
        shopID: $scope.currentEmploye.shopID,
        merchantID: $scope.currentEmploye.merchantID,
        agentID: $scope.currentUser.employeID,
        cashSettlement: {
          "status": 'closed',
          serialNumber: now,
          amount: amount,
          settledAt: now,
          payType: 'cash'
        },
        memberSettlement: {
          "status": 'closed',
          serialNumber: now,
          amount: amount,
          settledAt: now,
          payType: 'perpay'
        }
      }
    
      var accountType = res.dealType === 'prepay' ? 'payeeAccount': 'payerAccount'
      opt.memberSettlement[accountType] = {
        id: entity.account.id,
        "name": entity.account.name,
        balance: entity.account.balance
      }
      Bill.create(opt, function (bill) {
        if(accountType === "payeeAccount") {
          entity.account.balance += amount 
        } else {
          entity.account.balance -= amount 
        }
      }, function (res) {
        $scope.alerts.push({type: 'danger', msg: '储值操作失败'})
      })
    })
  }
})

.controller('MemberPointCtrl', function($scope, $controller, $stateParams, Point) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Point
  $scope.search.orFields = ['memberID']
  $scope.search.text = $stateParams.memberID
  $scope.includes = ['agent']

})

.controller('BillCtrl', function($scope, $controller, Bill) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Bill
  $scope.includes = ['agent']
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
