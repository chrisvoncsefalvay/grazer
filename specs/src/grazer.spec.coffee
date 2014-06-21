grazer = require('../../lib/grazer')

describe 'Grazer', ->
  Grazer = null

  beforeEach ->
    Grazer = new grazer.Grazer()

  describe 'url()', ->

    it 'returns a URL for product details', ->
      result = Grazer.url('productDetails', 1033)
      expect(result).toBe 'https://www.graze.com/api/products/details?p=1033'

    it 'returns a URL for product categories', ->
      result = Grazer.url('productCategories')
      expect(result).toBe 'https://www.graze.com/api/products/categories'

    it 'returns a URL for a search string', ->
      result = Grazer.url('productSearch', 'jalapeno')
      expect(result).toBe 'https://www.graze.com/api/products/search?q=jalapeno'

    it 'returns a URL for a complex search string', ->
      result = Grazer.url('productSearch', 'modified tapioca starch')
      expect(result).toBe 'https://www.graze.com/api/products/search?q=modified%20tapioca%20starch'

    it 'returns a URL for box contents', ->
      result = Grazer.url('boxContents', 'F9H0N')
      expect(result).toBe 'https://www.graze.com/api/box/contents?k=F9H0N'

    it 'catches incorrect method', ->
      result = -> Grazer.url('abcd', 'jalapeno')
      expect(result).toThrow new Error 'Unknown method.'

    it 'catches missing argument where it is necessary', ->
      result = -> Grazer.url('productDetails')
      expect(result).toThrow new Error 'Missing argument.'

    it 'does not throw a `missing argument` error for productCategories', ->
      result = -> Grazer.url('productCategories')
      expect(result).not.toThrow new Error 'Missing argument.'

