var app;

app = angular.module("radiance", ["config", "ui.router", 'ngMessages', 'ngLodash', 'rt.debounce', 'ngResource', 'lbServices']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('logged-out', {
    url: '/',
    templateUrl: 'templates/auth/logged-out.html'
  });
  $stateProvider.state('sign-up', {
    url: '/sign-up',
    templateUrl: 'templates/auth/sign-up.html'
  });
  $stateProvider.state('sign-in', {
    url: '/sign-in',
    templateUrl: 'templates/auth/sign-in.html'
  });
  return $stateProvider.state('forgot-password', {
    url: '/forgot-password',
    templateUrl: 'templates/auth/forgot-password.html'
  });
});

if (document.location.hostname === "localhost") {
  angular.module('config', []).constant('ENV', {
    name: 'development',
    apiEndpoint: 'http://localhost:3000/api/v1',
    firebase_url: 'https://bequantified-dev.firebaseio.com/'
  });
} else {
  angular.module('config', []).constant('ENV', {
    name: 'production',
    apiEndpoint: 'http://www.bequantified.com/api/v1',
    firebase_url: 'https://bequantified-prod.firebaseio.com/'
  });
}
