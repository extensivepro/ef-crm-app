/**
 * List Controller
 */
angular.module('baseController', [])

.controller('ListCtrl', function ListCtrl($scope, $state) {
  $scope.entities = []
  $scope.resource = undefined
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
    var filter = { 
      order: $scope.orderOptions,
      skip: $scope.pageNumber*$scope.limit,
      limit: $scope.limit
    }
    if($scope.search.text !== '' && $scope.search.orFields.length > 0) {
      var ors = []
      $scope.search.orFields.forEach(function (field) {
        var sk = {}
        sk[field] = {like: $scope.search.text}
        ors.push(sk)
      })
      filter.where = {'or': ors}
    }
    
    if ($scope.includes.length > 0) {
      filter.include = $scope.includes
    }

    // console.log('Filter:', filter, $scope)

    $scope.resource.query({filter: filter}, successCb, errorCb)
  }

	var moreData = true
	
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

	$scope.moreDataCanBeLoaded = function () {
		return moreData
	}
	
  $scope.loadMore = function () {
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
  
  $scope.init = function() {
    $scope.fetch()
  }
})

.controller('ListDetailCtrl', function ListCtrl($scope, $stateParams) {
  $scope.entity = JSON.parse($stateParams.entity)
  
})