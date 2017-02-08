describe('$httpCancellable', function () {


  beforeEach(module('http.cancellable'));

  var $httpCancellable;
  var $httpBackend;
  var $timeout;

  beforeEach(inject(function (_$httpCancellable_, _$httpBackend_, _$timeout_) {
    $httpCancellable = _$httpCancellable_;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
  }));

  describe('making a succesful request', function () {

    beforeEach(function () {
      $httpBackend.expect('GET', 'http://example.org/test')
        .respond(200, {
          message: 'Hello World'
        });

    });

    it('should respond 200', function (done) {

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
        }).finally(function(){
          $scope.finally = true;
          done();
        });

      /* End */
      $httpBackend.flush();

      $scope.should.have.property('valid').eql(true);
      $scope.response.data.message.should.equal('Hello World');
      $scope.should.have.property('finally').eql(true);
      
    });


    it('should cancel', function (done) {

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
        }).finally(function(){
          $scope.finally = true;
          done();
        });

      request.cancel();
      
      /* End */
      
      try {
        $httpBackend.flush();
      } catch (err){
        //This should happen
        $scope.should.have.property('valid').eql(true);
        $scope.should.not.have.property('response');
        $scope.should.have.property('error');
        $scope.should.have.property('finally').eql(true);
      }
      
    });

  });



});