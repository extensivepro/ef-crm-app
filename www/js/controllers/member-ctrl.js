controllers

.controller('MemberCtrl', function($scope, $controller, Member, $ionicModal) {
  
  $scope.profileModal = '/templates/member-profile-modal.html'
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Member
  $scope.search.orFields = ['name', 'phone']
  $scope.detailState = 'tab.members-detail'
  
  $scope.blurCb = function ($event) {
    $scope.entity.code = $scope.entity.code || $scope.entity.phone
  }
})

.controller('MemberDetailCtrl', function($scope, $controller, $stateParams, Member, Point, Bill, $ionicPopup, $ionicModal) {
  $scope.profileModal = '/templates/member-profile-modal.html'
  $scope.resource = Member
  $controller('ListDetailCtrl', {$scope: $scope})

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
        id: $scope.entity.account.id,
        "name": $scope.entity.account.name,
        balance: $scope.entity.account.balance
      }
      Bill.create(opt, function (bill) {
        if(accountType === "payeeAccount") {
          $scope.entity.account.balance += amount 
        } else {
          $scope.entity.account.balance -= amount 
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