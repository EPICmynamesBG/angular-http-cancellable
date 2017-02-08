/**
 * a Cancellable Promise overlay of $http
 * @author Brandon Groff
 * @throws {Error} when missing options parameter
 * @param {object}   options the $http options object
 * @param {service} $http   Angular $http service
 * @param {service} $q      Angular $q service
 */
function CancellablePromise(options, $http, $q) {

  if (!options) {
    throw new Error('Missing required parameter: options');
  };

  if (!options.cancelMessage) {
    options.cancelMessage = 'Request Cancelled';
  }

  this.options = options;

  this.canceller = $q.defer();

  options.timeout = this.canceller.promise;

  this.$httpPromise = $http(options);
};

/**
 * Cancel the active request
 * @author Brandon Groff
 * @returns {CancellablePromise} this CancellablePromise
 */
CancellablePromise.prototype.cancel = function () {
  var cancelMessage = this.options.cancelMessage;

  this.canceller.resolve(new Error(cancelMessage));

  return this;
};

/**
 * Standard `then` handler for a Promise. See Angular docs on $http.then for more details
 * @author Brandon Groff
 * @param   {function} onFulfilled  the on success function, will contain an $http response object
 * @param   {function} onReject     the on error function, will contain an error object
 * @param   {function} progressBack usable for getting progress update on a request. 
 * @returns {CancellablePromise} this CancellablePRomise
 */
CancellablePromise.prototype.then = function (onFulfilled, onReject, progressBack) {

  var cancelMessage = this.options.cancelMessage;

  this.$httpPromise.then(function (response) {
    if (response.status === -1) {
      onReject(new Error(cancelMessage));
    }
    onFulfilled(response);
  }, function (error) {
    if (error.status === -1) {
      onReject(new Error(cancelMessage));
    } else {
      onReject(error);
    }
  }, progressBack);

  return this;
};

/**
 * Standard `catch` handler for a Promise. See Angular docs on $http.catch for more details
 * @author Brandon Groff
 * @param   {function} callback the function to run on an error, will contain an error object
 * @returns {CancellablePromise} this CancellablePRomise
 */
CancellablePromise.prototype.catch = function (callback) {
  
  var cancelMessage = this.options.cancelMessage;
  
  this.$httpPromise.catch(function (error) {
    if (error.status === -1) {
      callback(new Error(cancelMessage));
    } else {
      callback(error);
    }
    
  });
  return this;
};

/**
 * Standard `finally` handler for a Promise that runs after eveything else. See Angular docs on $http.finally for more details
 * @author Brandon Groff
 * @param   {function} callback     the function block to run
 * @param   {function} progressBack see Angular docs on $http.finally for more on this paramter
 * @returns {CancellablePromise} this CancellablePRomise
 */
CancellablePromise.prototype.finally = function (callback, progressBack) {
  this.$httpPromise.finally(callback, progressBack);
  return this;
};


cancellableModule.factory('$httpCancellable', ['$http', '$q', function ($http, $q) {
  return function (options) {
    return new CancellablePromise(options, $http, $q);
  };
}]);
