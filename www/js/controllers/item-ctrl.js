controllers

.controller('ItemCtrl', function($scope, $controller, Item, $ionicModal) {  
  $scope.profileModal = '/templates/item-profile-modal.html'
  
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Item
  $scope.detailState = 'tab.items-detail'
  
  $scope.trySave = function () {
    $scope.entity.price *= 100
    $scope.entity.merchantID = $scope.currentEmploye.merchant.id
    $scope.resource.create($scope.entity, function (entity) {
      $scope.modal.hide()
      $scope.fetch()
    }, function (res) {
      console.log('create entity failure', res)
    })
  }
  
})

.controller('ItemDetailCtrl', function($scope, $controller, $stateParams, Item) {
  $scope.profileModal = '/templates/item-profile-modal.html'
  $scope.resource = Item

  $controller('ListDetailCtrl', {$scope: $scope})
})
