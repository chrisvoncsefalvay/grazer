(function() {
  'use strict';
  var prettyjson, q, request;

  q = require('querystring');

  request = require('superagent');

  prettyjson = require('prettyjson');

  exports.Grazer = function() {
    return {
      urlRoot: 'https://www.graze.com/api',
      methods: {
        'productDetails': '/products/details',
        'productCategories': '/products/categories',
        'productSearch': '/products/search',
        'boxContents': '/box/contents'
      },
      version: function() {
        var pjson;
        pjson = require('../package.json');
        return pjson.version;
      },
      url: function(method, argument) {
        var query, queryObject, url;
        queryObject = (function() {
          switch (false) {
            case method !== 'productDetails':
              return queryObject = {
                p: argument
              };
            case method !== 'productSearch':
              return queryObject = {
                q: argument
              };
            case method !== 'boxContents':
              return queryObject = {
                k: argument
              };
            default:
              return queryObject = void 0;
          }
        })();
        if (!(method in this.methods)) {
          throw new Error('Unknown method.');
        }
        if (argument == null) {
          if (method !== 'productCategories') {
            throw new Error('Missing argument.');
          }
        }
        query = queryObject != null ? '?' + q.stringify(queryObject) : '';
        url = this.urlRoot + this.methods[method] + query;
        return url;
      },
      retrieve: function(method, argument, callback) {
        var url;
        url = this.url(method, argument);
        return request.get(url).end(function(res) {
          return callback(res);
        });
      },
      getProduct: function(productId, verbose, callback) {
        return this.retrieve('productDetails', productId, function(result) {
          if (result != null) {
            if (result.body.success === false) {
              throw new Error('Product ID ' + productId + ' not found. Please double-check ID.');
              return callback([]);
            } else if (result.body) {
              if (verbose === true) {
                console.log(prettyjson.render(result.body));
              }
              return callback(result.body);
            }
          } else {
            throw new Error('Connection error. No reply from API.');
          }
        });
      },
      getProductSearch: function(searchTerm, verbose, callback) {
        return this.retrieve('productSearch', searchTerm, function(result) {
          var products;
          if (result != null) {
            if ((result.body.success != null) && (result.body.products != null)) {
              if (result.body.products.indexOf(',') !== -1) {
                products = result.body.products.split(',');
              } else {
                products = result.body.products;
              }
              if (verbose === true) {
                console.log('Products:\n' + prettyjson.render(products));
              }
              return callback(products);
            } else {
              console.log('No matching products found.');
              return callback([]);
            }
          } else {
            throw new Error('Connection error. No reply from API.');
          }
        });
      },
      getBoxContents: function(boxKey, verbose, callback) {
        return this.retrieve('boxContents', boxKey, function(result) {
          var products;
          if (result != null) {
            if ((result.body.success != null) && (result.body.products != null)) {
              if (result.body.products.indexOf(',') !== -1) {
                products = result.body.products.split(',');
              } else {
                products = result.body.products;
              }
              if (verbose === true) {
                console.log('Box contains:\n' + prettyjson.render(products));
              }
              return callback(products);
            } else {
              if (result != null) {
                throw new Error('Box not found. Please double-check box key.');
              }
            }
          } else {
            throw new Error('Connection error. No reply from API.');
          }
        });
      },
      getCategories: function(verbose, callback) {
        return this.retrieve('productCategories', null, function(result) {
          var _ref;
          if (((result != null ? (_ref = result.body) != null ? _ref.success : void 0 : void 0) != null) === true) {
            if (verbose === true) {
              console.log(prettyjson.render(result.body.categories));
            }
            return callback(result.body.categories);
          } else {
            throw new Error('Connection error. No reply from API or reply malformatted.');
          }
        });
      }
    };
  };

}).call(this);
