var app = angular.module('test', ['http.cancellable']);

app.run(['$httpCancellable', function ($httpCancellable) {
  console.log('run');
  
  var request = $httpCancellable({
    method: 'GET',
    url: 'http://test-routes.herokuapp.com/test/hello'
  }).then(function (response) {
    console.log(response);
  }).catch(function (error) {
    console.log(error.stack);
  }).finally(function () {
    console.log('FINALLY');
  });
  
  request.cancel();
  
}]);