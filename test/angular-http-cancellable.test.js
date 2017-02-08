describe('$httpCancellable', function () {


  beforeEach(module('http.cancellable'));

  var $httpCancellable;
  var $httpBackend;

  beforeEach(inject(function (_$httpCancellable_, _$httpBackend_) {
    $httpCancellable = _$httpCancellable_;
    $httpBackend = _$httpBackend_;
  }));

  describe('making a succesful request', function () {

    beforeEach(function () {
      $httpBackend.expect('GET', 'http://example.org/test')
        .respond(200, {
          message: 'Hello World'
        });

    });

    it('should respond 200', function () {

      var $scope = {};

      /* Code Under Test */
      var request = $httpCancellable({
          method: 'GET',
          url: 'http://example.org/test'
        })
        .then(function (response) {
          $scope.valid = true;
          $scope.response = response;
        })
        .catch(function (error) {
          $scope.valid = false;
          $scope.error = error;
        });

      /* End */
      $httpBackend.flush();
//      expect($httpBackend.flush).not.toThrow();

      $scope.valid.should.equal(true);
      $scope.response.data.should.equal({
        message: 'Hello World'
      });

      //      expect($scope.valid).toBe(true);
      //      expect($scope.response.data).toEqual({
      //        message: 'Hello World'
      //      });
    });


    it('should cancel', function () {

      var $scope = {};

      /* Code Under Test */
      var request = $httpCancellable({
          method: 'GET',
          url: 'http://example.org/test'
        })
        .then(function (response) {
          $scope.valid = false;
          $scope.response = response;
        })
        .catch(function (error) {
          $scope.valid = true;
          $scope.error = error;
        });

      request.cancel();

      /* End */

//      expect($httpBackend.flush).toThrow();

      $scope.valid.should.equal(true);
      $scope.response.should.equal(undefined);
      $scope.error.should.exist();

    });

  });



});