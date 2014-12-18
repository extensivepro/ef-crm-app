controllers

.controller('ItemCtrl', function($scope, $controller, Item, CurrentEmploye, DealTransaction) {  
  $scope.profileModal = '/templates/item-profile-modal.html'
  
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Item
  $scope.detailState = 'tab.items-detail'
  $scope.deal = DealTransaction
  
  $scope.blurCb = function ($event) {
    $scope.entity.price *= 100
  }

  $scope.registerGood = function (item) {
    DealTransaction.registerItem(item)
  }

})

.controller('ItemDetailCtrl', function($scope, $controller, $stateParams, Item) {
  $scope.profileModal = '/templates/item-profile-modal.html'
  $scope.resource = Item

  $controller('ListDetailCtrl', {$scope: $scope})
})

.controller('DealTransactionCtrl', function ($scope, DealTransaction, $state) {
  $scope.deal = DealTransaction
  
  $scope.close = function () {
    DealTransaction.close()
    $state.go('tab.items')
  }

  $scope.goSettlement = function () {
    DealTransaction.bill.amount = DealTransaction.fee
    $state.go('tab.settlement')
  }

})

.controller('SelectMemberCtrl', function ($scope, $controller, Member, DealTransaction, $state) {

  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Member
  $scope.showOnly = true
  
  $scope.selectEntity = function (entity) {
    DealTransaction.setMember(entity)
    $state.go('tab.deal-transaction', {}, {location: true})
  }
  
})

.controller('SettlementCtrl', function ($scope, DealTransaction, $state, $ionicPopup) {
  $scope.deal = DealTransaction
  $scope.entity = DealTransaction.bill
  
  $scope.settle = function () {
    
    DealTransaction.settle(function (deal) {
      var pop = $ionicPopup.alert({
        title: '结算成功'
      })
      pop.then(function () {
        $state.go('tab.items')
      })
    }, function (res, error) {
      $ionicPopup.alert({
        title: '结算失败',
        template: '<h4 class="assertive">'+error.msg+'</h4>'
      })
    })
  }
  
})

