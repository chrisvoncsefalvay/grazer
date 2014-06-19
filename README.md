# grazer

An API wrapper to the amazing Graze public API.

## Getting Started
Install the module with: `npm install grazer`

```javascript
var grazer = require('grazer');
```

Create a new Grazer object:

```javascript
var Grazer = new grazer.Grazer();
```

Now you can run any of the methods.


## Documentation
Please look under the `/doc` folder or on CoffeeDocs.info.

## Examples

### Retrieve product ID 1033 and output result to console.

```javascript
   new Grazer.getProduct(1033, true, function(result) {
     console.log (result);
   });
```

### Search for products that have 'jalapeno' in their description.

```javascript
   new Grazer.getProductSearch('jalapeno', true, function(result) {
     console.log (result);
   });
```
  
### Retrieve the contents of box F9H0N and output result to console.

```javascript
   new Grazer.getBoxContents('F9H0N', true, function(result) {
     console.log (result);
   });
```

### Get categories list and log to console

```javascript
   new Grazer.getCategories(false, function(result) {
        console.log (result);
   });
```

## Contributing
**TODO:** the asynch methods need Jasmine tests to be written for them.

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
First release (0.1.0): 19/06/2014

## License
Copyright (c) 2014 Chris von Csefalvay. Licensed under the MIT license.

Disclaimer: I am not affiliated with Graze, just a fan of their snack boxes.

If you enjoy this module, please do me a favour and check out [Special Effect](http://www.specialeffect.org.uk/). They're a charity that helps disabled gamers by acquiring and/or hacking together adaptive and augmentative devices to help them play. The experience of gaming belongs to everyone. Consider donating or helping them out - trust me, it'll change your life.
