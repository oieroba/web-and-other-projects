if (document.location.hostname == "localhost")
  angular.module('config', []).constant 'ENV',
    name: 'development'
    apiEndpoint: 'http://localhost:3000/api/v1'
    firebase_url: 'https://bequantified-dev.firebaseio.com/'
else
  angular.module('config', []).constant 'ENV',
    name: 'production'
    apiEndpoint: 'http://www.bequantified.com/api/v1'
    firebase_url: 'https://bequantified-prod.firebaseio.com/'
