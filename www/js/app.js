// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ui.utils', 'LocalStorageModule', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, User, $state, Employe) {
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
      setCurrentUser(user)
    }, function () {
      $rootScope.$broadcast('AUTH_LOGOUT')
    })
  });
  
  $rootScope.$on('AUTH_LOGIN', function(e, accessToken) {
    setCurrentUser(accessToken.user)
    if (!accessToken.user.employeID) {
      $state.go('register', {}, {location: false})
    } else {
      $state.go('tab.member');
    }
  });

  $rootScope.$on('AUTH_LOGOUT', function(e, user) {
    $state.go('login')
  });
  
  var setCurrentUser = function (user) {
    $rootScope.currentUser = user
    if(user.employeID) {
      Employe.findOne({
        filter:{
          where:{id:user.employeID}, 
          include:['merchant', 'shop']
        }
      }, function (employe) {
        $rootScope.currentEmploye = employe
      }, function (res) {
        console.log('Find employe error')
      })
    }
  }
  
  $rootScope.dateFormat = function (date) {
    return moment.unix(date).format('YYYY-MM-DD hh:mm:ss')
  }
  
})

.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {

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

    .state('tab.member', {
      url: '/member',
      views: {
        'tab-member': {
          templateUrl: 'templates/tab-member.html',
          controller: 'MemberCtrl'
        }
      }
    })

    .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
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
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/member');

  localStorageServiceProvider
    .setPrefix('ef-crm-app')
    .setNotify(true, true)
})

.filter("roleDictionary", function () {
  var dictionary = {
    "shopManager": "店长",
    "cashier": "收银员"
  }
  
  return function (key) {
    return dictionary[key];
  }
})


