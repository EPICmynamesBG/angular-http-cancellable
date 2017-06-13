/**
 * a Cancellable Promise overlay of $http
 * @author Brandon Groff
 * @throws {Error} when missing options parameter
 * @param {object}   options the $http options object
 * @param {service} $http   Angular $http service
 * @param {service} $q      Angular $q service
 */
function CancellablePromise(options, $http) {

  var self = this;

  var clearFuncCache = function () {
    self.functionCache.onFulfill = angular.noop;
    self.functionCache.onReject = angular.noop;
    self.functionCache.finally = angular.noop;
  };

  if (!options) {
    throw new Error('Missing required parameter: options');
  };

  if (!options.cancelMessage) {
    options.cancelMessage = 'Request Cancelled';
  }

  this.options = options;

  this.completionFlag = false;

  this.canceller = {};

  this.canceller.promise = new Promise(function (resolve, reject) {
    self.canceller.resolve = resolve;
    self.canceller.reject = reject;
  });

  this.canceller.promise.then(function (response) {
    self.completionFlag = true;
    if (response.status === -1) {
      self.functionCache.onReject(new Error(cancelMessage));
    }
    self.functionCache.onFulfill(response);
    self.functionCache.finally();
    clearFuncCache();
  }).catch(function (error) {
    self.completionFlag = true;
    if (error && error.message === 'http.cancellable:Flush') {
      return;
    }
    if (error && error.status === -1) {
      self.functionCache.onReject(new Error(cancelMessage));
    } else {
      self.functionCache.onReject(error);
    }
    self.functionCache.finally();
    clearFuncCache();
  });
  
  this.canceller.flush = function() {
    if (self.canceller.promise){
      self.canceller.reject(new Error('http.cancellable:Flush'));
      self.canceller.promise = null;
      self.canceller.resolve = angular.noop;
      self.cancel.flush = angular.noop;
      self.$httpPromise = null;
    }
  }

  this.functionCache = {
    onFulfill: angular.noop,
    onReject: function (err) {
      console.warn('Error response is not being handled!');
    },
    finally: angular.noop
  };

  this.$httpPromise = $http(options);
};

/**
 * Cancel the active request
 * @author Brandon Groff
 * @returns {CancellablePromise} this CancellablePromise
 */
CancellablePromise.prototype.cancel = function () {
  this.canceller.resolve(new Error(this.options.cancelMessage));
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
  var self = this;

  this.functionCache.onFulfill = onFulfilled;
  if (onReject) {
    this.functionCache.onReject = onReject;
  }

  this.$httpPromise.then(function (res) {
      if (!self.completionFlag) {
        self.functionCache.onFulfill(res);
        self.completionFlag = true;
        self.canceller.flush();
      }
    },
    function (err) {
      if (!self.completionFlag) {
        self.functionCache.onReject(err);
        self.completionFlag = true;
        self.canceller.flush();
      }
    },
    progressBack);

  return this;
};

/**
 * Standard `catch` handler for a Promise. See Angular docs on $http.catch for more details
 * @author Brandon Groff
 * @param   {function} callback the function to run on an error, will contain an error object
 * @returns {CancellablePromise} this CancellablePRomise
 */
CancellablePromise.prototype.catch = function (callback) {
  var self = this;
  
  if (callback) {
    self.functionCache.onReject = callback;
  }

  this.$httpPromise.catch(function (err) {
    if (!self.completionFlag) {
      self.functionCache.onReject(err);
      self.completionFlag = true;
      self.canceller.flush();
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
  this.functionCache.finally = callback;
  var self = this;

  this.$httpPromise
    .finally(self.functionCache.finally, progressBack)
    .then(angular.noop, angular.noop); // Fix unhandled rejection error: https://stackoverflow.com/a/41638905
  return this;
};


cancellableModule.factory('$httpCancellable', ['$http', function ($http) {
  return function (options) {
    return new CancellablePromise(options, $http);
  };
}]);
