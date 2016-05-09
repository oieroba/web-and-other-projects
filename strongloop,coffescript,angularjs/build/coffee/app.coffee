app = angular.module("radiance", [
  "config"
  "ui.router"
  'ngMessages'
  'ngLodash'
  'rt.debounce'
  'ngResource'
  'lbServices'
])

app.config ($stateProvider, $urlRouterProvider) ->

  # For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise '/'

  # Default unauthenicated state
  $stateProvider.state 'logged-out',
    url: '/'
    templateUrl: 'templates/auth/logged-out.html'

  # Authenication Routes
  $stateProvider.state 'sign-up',
    url: '/sign-up'
    templateUrl: 'templates/auth/sign-up.html'

  $stateProvider.state 'sign-in',
    url: '/sign-in'
    templateUrl: 'templates/auth/sign-in.html'

  $stateProvider.state 'forgot-password',
    url: '/forgot-password'
    templateUrl: 'templates/auth/forgot-password.html'
