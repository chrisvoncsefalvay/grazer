(function() {
  var grazer;

  grazer = require('./../../src/grazer');

  describe('Grazer', function() {
    var Grazer;
    Grazer = null;
    beforeEach(function() {
      return Grazer = new grazer.Grazer();
    });
    return describe('url()', function() {
      it('returns a URL for product details', function() {
        var result;
        result = Grazer.url('productDetails', 1033);
        return expect(result).toBe('https://www.graze.com/api/products/details?p=1033');
      });
      it('returns a URL for product categories', function() {
        var result;
        result = Grazer.url('productCategories');
        return expect(result).toBe('https://www.graze.com/api/products/categories');
      });
      it('returns a URL for a search string', function() {
        var result;
        result = Grazer.url('productSearch', 'jalapeno');
        return expect(result).toBe('https://www.graze.com/api/products/search?q=jalapeno');
      });
      it('returns a URL for a complex search string', function() {
        var result;
        result = Grazer.url('productSearch', 'modified tapioca starch');
        return expect(result).toBe('https://www.graze.com/api/products/search?q=modified%20tapioca%20starch');
      });
      it('returns a URL for box contents', function() {
        var result;
        result = Grazer.url('boxContents', 'F9H0N');
        return expect(result).toBe('https://www.graze.com/api/box/contents?k=F9H0N');
      });
      it('catches incorrect method', function() {
        var result;
        result = function() {
          return Grazer.url('abcd', 'jalapeno');
        };
        return expect(result).toThrow(new Error('Unknown method.'));
      });
      it('catches missing argument where it is necessary', function() {
        var result;
        result = function() {
          return Grazer.url('productDetails');
        };
        return expect(result).toThrow(new Error('Missing argument.'));
      });
      return it('does not throw a `missing argument` error for productCategories', function() {
        var result;
        result = function() {
          return Grazer.url('productCategories');
        };
        return expect(result).not.toThrow(new Error('Missing argument.'));
      });
    });
  });

}).call(this);
