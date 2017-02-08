var cancellableModule = angular.module('http.cancellable', []);


cancellableModule.config(['$qProvider', function($qProvider){
  $qProvider.errorOnUnhandledRejections(false);
}]);
