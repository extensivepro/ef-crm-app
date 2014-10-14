angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, $state, User, Employe) {
  
  $scope.employe = {"name":'', phone:''}
  $scope.logout = function () {
    User.logout()
    $state.go('login')
  }
  
  User.getCurrent(function (user) {
    Employe.findById({id:user.employeId}, function (employe) {
      $scope.employe = employe
    })
  })
  
});
