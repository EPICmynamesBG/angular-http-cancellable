var cancellableModule = angular.module('http.cancellable', []);


cancellableModule.config(function($qProvider){
  $qProvider.errorOnUnhandledRejections(false);
});
