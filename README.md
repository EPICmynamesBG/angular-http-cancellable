# angular-http-cancellable

A simple libary for making Angular $http requests cancellable

Note: This library only applies for Angular v1. Testing only done on angular > 1.6.0. 

## Setup - Install via npm

`npm install --save angular-http-cancellable`

Link to the file in the node_modules folder. `node_modules/angular-http-cancellable/dist/angular-http-cancellable.min.js`


## Usage

Import the module into your angular application

```javascript
var myApp = angular.module('myApp', ['http.cancellable']);

```

Import and use `$httpCancellable` just like you would use `$http`.

```javascript

myApp.factory('SomeFactory', function($httpCancellable){
  
  var factory = {};
  
  factory.someRequest = function() {
    var request = $httpCancellable({
      method: 'GET',
      url: 'http://example.org/hello'
    }).then(function(response){
      //handleResponse
    }).catch(function(error){
      //Cancel will trigger error here
      //Handle error
    }).finally(function(){
      //do something else
    });

    if (requestTakesTooLong()){
      request.cancel();
    }
    
    return request;
  };
  
  return factory;
  
});


```

## Testing

Testing made using karma + mocha + chai. To test, just run `npm test`.
** Will probably need to compile the dist file first by using `gulp` **


## Contributing

Contributions and feedback accepted! For most cases, please submit an issue to the project with the correct tag (ie. feature request, bug).

### Development

To contribute to developing, please fork the repository and submit a pull request :)

## License

  MIT (see full in LICENSE file)
