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
    DealTransaction.bill.amount = DealTransaction.fee
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

.controller('SettlementCtrl', function ($scope, DealTransaction, $state, $ionicPopup, $timeout, $ionicHistory) {
  $scope.deal = DealTransaction
  $scope.entity = DealTransaction.bill
  $scope.btnIcon = 'ion-card'
  
  $scope.settle = function () {
    $scope.btnIcon = 'ion-load-d'
    DealTransaction.settle(function (deal) {
      $scope.btnIcon = 'ion-ios7-checkmark-outline'
      $timeout(function () {
        $ionicHistory.goToHistoryRoot($ionicHistory.currentView().historyId)
      }, 1000)
    }, function (res, error) {
      $scope.btnIcon = 'ion-card'
      $ionicPopup.alert({
        title: '结算失败',
        template: '<h4 class="assertive">'+error.msg+'</h4>'
      })
    })
  }
  
})

