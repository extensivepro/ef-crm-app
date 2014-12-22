controllers

.controller('ItemCtrl', function($scope, $controller, Item, CurrentEmploye, DealTransaction, $state) {  
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
  
  $scope.goDealTransaction = function () {
    $state.go('tab.deal-transaction', {}, {location: false})
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
    DealTransaction.account()
    $state.go('tab.settlement', {}, {location: false})
  }

  $scope.goSelectMember = function () {
    $state.go('tab.select-member', {}, {location: false})
  }

})

.controller('SelectMemberCtrl', function ($scope, $controller, Member, DealTransaction, $state) {

  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Member
  $scope.showOnly = true
  
  $scope.selectEntity = function (entity) {
    DealTransaction.setMember(entity)
    $state.go('tab.deal-transaction', {}, {location: false})
  }
  
})

.controller('SettlementCtrl', function ($scope, DealTransaction, $state, $ionicPopup, $timeout, $ionicHistory, $ionicLoading) {
  $scope.deal = DealTransaction
  $scope.entity = DealTransaction.bill
  
  $scope.settle = function () {
    $ionicLoading.show({
      template: '<i class="icon ion-loading-c ion-loading padding"></i>正在结算...'
    })
    DealTransaction.settle(function (deal) {
      $ionicLoading.show({
        template: '<i class="icon ion-ios7-checkmark-outline padding"></i>结算成功',
        duration: 1000
      })
      $timeout(function () {
        $ionicHistory.goToHistoryRoot($ionicHistory.currentView().historyId)
      }, 1000)
    }, function (res, error) {
      $ionicLoading.hide()
      $ionicPopup.alert({
        title: '结算失败',
        template: '<h4 class="assertive">'+error.msg+'</h4>'
      })
    })
  }
  
})

