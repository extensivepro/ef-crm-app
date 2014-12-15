controllers

.controller('BillCtrl', function($scope, $controller, Bill) {
  $controller('ListCtrl', {$scope: $scope})
  $scope.resource = Bill
  $scope.includes = ['agent']
  $scope.detailState = 'tab.bills-detail'
})

.controller('BillDetailCtrl', function($scope, $controller, $stateParams, Bill) {
  $controller('ListDetailCtrl', {$scope: $scope})
})