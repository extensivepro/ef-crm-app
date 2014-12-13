/**
 * List Controller
 */

var configProfileModal = function ($scope, $ionicModal) {
  if($scope.profileModal) {
    $ionicModal.fromTemplateUrl($scope.profileModal, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal
      $scope.entity = $scope.entity || {}
    })
    $scope.openModal = function() {
      $scope.modal.show()
    }
    $scope.closeModal = function() {
      $scope.modal.hide()
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

    $scope.trySave = function () {
      $scope.entity.merchantID = $scope.currentEmploye.merchant.id
      $scope.resource.upsert($scope.entity, function (entity) {
        $scope.$emit('RESOURCE_UPSERT')
        $scope.modal.hide()
      }, function (res) {
        console.log('create entity failure', res)
      })
    }
  }
}

angular.module('baseController', [])

.controller('ListCtrl', function ListCtrl($scope, $state, $ionicModal) {
  $scope.entities = []
  $scope.orderOptions = ['createdAt DESC']
  $scope.search = {
    text: '',
    orFields: ['name', 'phone'],
  }
  $scope.includes = []
  $scope.detailState = undefined
  $scope.pageNumber = 0
  $scope.limit = 20

  var fetch = function (successCb, errorCb) {
    if(!$scope.currentEmploye) return
    var filter = { 
      order: $scope.orderOptions,
      skip: $scope.pageNumber*$scope.limit,
      limit: $scope.limit,
      where: {
        and: [
          { merchantID: $scope.currentEmploye.merchantID } 
        ]
      }
    }

    if($scope.search.text !== '' && $scope.search.orFields.length > 0) {
      var ors = []
      $scope.search.orFields.forEach(function (field) {
        var sk = {}
        sk[field] = {like: $scope.search.text}
        ors.push(sk)
      })
      filter.where.and.push({ or: ors })
    }
    
    if ($scope.includes.length > 0) {
      filter.include = $scope.includes
    }

    console.log('Filter:', filter)

    $scope.resource.query({filter: filter}, successCb, errorCb)
  }
  
  var moreData = false
	
  $scope.fetch = function () {
    $scope.pageNumber = 0
    fetch(function (results) {
      $scope.entities = results
			moreData = results.length === $scope.limit
      $scope.$broadcast('scroll.refreshComplete')
    }, function (error) {
      console.log('Query', $scope.resource, error)
      $scope.$broadcast('scroll.refreshComplete')
    })
  }
  
  $scope.$on('RESOURCE_UPSERT', function () {
    $scope.fetch()
  })
  
  $scope.$watch('search.text', function (newValue, oldValue) {
    $scope.fetch()
  })
  
  $scope.$on('CURRENT_EMPLOYE_READY', function () {
    $scope.fetch()
  })
  $scope.moreDataCanBeLoaded = function () {
    return moreData
  }
	
  $scope.loadMore = function () {
    if(!moreData) return
    $scope.pageNumber++
    fetch(function (results) {
      $scope.entities = $scope.entities.concat(results)
      moreData = results.length === $scope.limit
      $scope.$broadcast('scroll.infiniteScrollComplete')
    }, function (res) {
      console.log('LoadMore ', $scope.resource, res)
      $scope.$broadcast('scroll.infiniteScrollComplete')
    })
  }

  $scope.showDetail = function (entity) {
    $state.go($scope.detailState, {entity:JSON.stringify(entity)}, {location: true})
  }

  configProfileModal($scope, $ionicModal)
  
  $scope.init = function() {
    $scope.fetch()
  }
})

.controller('ListDetailCtrl', function ListCtrl($scope, $stateParams, $ionicModal) {
  $scope.entity = JSON.parse($stateParams.entity)

  configProfileModal($scope, $ionicModal)
  
})