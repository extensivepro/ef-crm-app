// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ui.utils', 'ef.filters', 'ef.directives', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, User, $state, CurrentEmploye) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    User.getCurrent(function (user) {
      CurrentEmploye.setEmploye(user)
    }, function () {
      $rootScope.$broadcast('AUTH_LOGOUT')
    })
  });
  
  $rootScope.$on('AUTH_LOGIN', function(e, accessToken) {
    CurrentEmploye.setEmploye(accessToken.user)
    if (!accessToken.user.employeID) {
      $state.go('register', {}, {location: false})
    } else {
      $state.go('tab.members');
    }
  });

  $rootScope.$on('AUTH_LOGOUT', function(e, user) {
    CurrentEmploye.clearEmploye()
    $state.go('login')
  });
    
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // login 
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
    })

    // register 
    .state('register', {
      url: "/register",
      templateUrl: "templates/register.html",
      controller: 'RegisterCtrl'
    })
    
    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.members', {
      url: '/members',
      views: {
        'tab-members': {
          templateUrl: 'templates/tab-member.html',
          controller: 'MemberCtrl'
        }
      }
    })
    .state('tab.members-detail', {
      url: '/members/?entity',
      views: {
        'tab-members': {
          templateUrl: 'templates/member-detail.html',
          controller: 'MemberDetailCtrl'
        }
      }
    })
    .state('tab.members-points', {
      url: '/members/:memberID/points',
      views: {
        'tab-members': {
          templateUrl: 'templates/member-point.html',
          controller: 'MemberPointCtrl'
        }
      }
    })

    .state('tab.bills', {
      url: '/bills',
      views: {
        'tab-bills': {
          templateUrl: 'templates/tab-bill.html',
          controller: 'BillCtrl'
        }
      }
    })
    .state('tab.bills-detail', {
      url: '/bills/?entity',
      views: {
        'tab-bills': {
          templateUrl: 'templates/bill-detail.html',
          controller: 'BillDetailCtrl'
        }
      }
    })
    
    .state('tab.items', {
      url: '/items',
      views: {
        'tab-items': {
          templateUrl: 'templates/tab-item.html',
          controller: 'ItemCtrl'
        }
      }
    })
    .state('tab.items-detail', {
      url: '/items/?entity',
      views: {
        'tab-items': {
          templateUrl: 'templates/item-detail.html',
          controller: 'ItemDetailCtrl'
        }
      }
    })
    .state('tab.deal-transaction', {
      url: '/dealtransaction',
      views: {
        'tab-items': {
          templateUrl: 'templates/deal-transaction.html',
          controller: 'DealTransactionCtrl'
        }
      }
    })
    .state('tab.select-member', {
      url: '/members/select',
      views: {
        'tab-items': {
          templateUrl: 'templates/tab-member.html',
          controller: 'SelectMemberCtrl'
        }
      }
    })
    .state('tab.settlement', {
      url: '/settlement',
      views: {
        'tab-items': {
          templateUrl: 'templates/bill-detail.html',
          controller: 'SettlementCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })    

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

})

var controllers = angular.module('starter.controllers', ['baseController'])
