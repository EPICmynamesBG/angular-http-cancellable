var app = angular.module('test', ['http.cancellable']);

app.run(['$httpCancellable', function ($httpCancellable) {
  console.log('run');

  var request1 = $httpCancellable({
    method: 'GET',
    url: 'http://test-routes.herokuapp.com/test/hello'
  }).then(function (response) {
    console.log(response);
  }).catch(function (error) {
    console.log(error.stack);
  }).finally(function () {
    console.log('FINALLY');
  });
 
  request1.cancel();

  var request2 = $httpCancellable({
    method: 'GET',
    url: 'http://httpstat.us/500'
  }).then(function (response) {
    console.log(response);
  }, function (error) {
    console.log(error);
  });
  
  var request3 = $httpCancellable({
    method: 'GET',
    url: 'http://httpstat.us/403'
  }).then(function (response) {
    console.log(response);
  });
  
  

  var request4 = $httpCancellable({
    method: 'GET',
    url: 'http://httpstat.us/404'
  }).then(function (response) {
    console.log(response);
  }, function (error) {
    console.log(error);
  }, function(progress){
    console.log(progress);
  }).finally(function(){
    console.log('finally 2');
  });


}]);
