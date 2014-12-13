controllers

.controller('ItemCtrl', function($scope, $controller, Item, $ionicModal, Deal) {  
  $scope.profileModal = '/templates/item-profile-modal.html'
  
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Item
  $scope.detailState = 'tab.items-detail'
  $scope.deal = {
    fee: 0,
    quantity: 0,
    items: []
  }
  
  $scope.blurCb = function ($event) {
    $scope.entity.price *= 100
  }

  $ionicModal.fromTemplateUrl('/templates/deal-profile-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.dealModal = modal
  })
  $scope.openDealModal = function() {
    $scope.dealModal.show()
  }
  $scope.closeDealModal = function() {
    $scope.dealModal.hide()
  }
  
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    console.log('Destroy deal Modal')
    $scope.dealModal.remove()
  })

  $scope.tryMakeDeal = function () {
    return console.log($scope.deal)
    $scope.entity.merchantID = $scope.currentEmploye.merchant.id
    Deal.create($scope.entity, function (entity) {
      $scope.$emit('DEAL_MAKED')
      $scope.dealModal.hide()
    }, function (res) {
      console.log('make deal failure', res)
    })
  }
  
  $scope.registerGood = function (item) {
    var found = $scope.deal.items.some(function (dealItem) {
      if(item.id === dealItem.item.id) {
        dealItem.quantity++
        $scope.deal.quantity++
        $scope.deal.fee += dealItem.dealPrice
        return true
      } else {
        return false
      }
    })
    if(!found) {
      var dealItem = {
        id: uuid.v4(),
        dealPrice: item.price,
        quantity: 1,
        item: {
          "name": item.name,
          id: item.id,
          price: item.price
        }
      }
      $scope.deal.items.push(dealItem)
      $scope.deal.quantity++
      $scope.deal.fee += dealItem.dealPrice
    }
  }

})

.controller('ItemDetailCtrl', function($scope, $controller, $stateParams, Item) {
  $scope.profileModal = '/templates/item-profile-modal.html'
  $scope.resource = Item

  $controller('ListDetailCtrl', {$scope: $scope})
})
