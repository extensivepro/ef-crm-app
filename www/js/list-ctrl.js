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

  $scope.fetch = function () {
    var filter = { 
      order: $scope.orderOptions,
      limit: 20
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
    $scope.resource.query({filter: filter}, function (results) {
      $scope.entities = results
      $scope.$broadcast('scroll.refreshComplete')
    }, function (error) {
      console.log('Query ', $scope.resource, error)
      $scope.$broadcast('scroll.refreshComplete')
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