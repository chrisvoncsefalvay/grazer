#
#  grazer
#  A Node.js wrapper to Graze's public API
#  http://octowombat.github.io/grazer
#
#  Copyright (c) 2014 Chris von Csefalvay
#  Licensed under the MIT license.
#
# @author Chris von Csefalvay <chris@chrisvoncsefalvay.com>
# @copyright Chris von Csefalvay, 2014.

# @module grazer
# @exports Grazer

'use strict';

q = require('querystring')
request = require('superagent')
prettyjson = require('prettyjson')

exports.Grazer = ->

  # Base values to enable quick updating if the Graze API should change.

  # @property URL root of the Graze API
  urlRoot: 'https://www.graze.com/api'

  # @property Associative array of methods and their URL suffixes.
  methods:
    'productDetails': '/products/details'
    'productCategories': '/products/categories'
    'productSearch': '/products/search'
    'boxContents': '/box/contents'


  # Returns current version of package.
  #
  # @return [String] Semantic version string.

  version: ()->
    pjson = require('../package.json')
    return pjson.version


  # Constructs a URL with the appropriate method and argument
  #
  # @note This method is exposed for the sake of completeness - you should not normally need to use it and should be able to rely on the other convenience methods provided.
  #
  # @param method [String] The method to be used. This has to be a part of the global methods array.
  # @param argument [String, Integer] The argument corresponding to the call.
  # @return [String] Constructed URL to the API call.
  # @throws [UnknownMethod] Will throw an error if the method is not a member of the global associative array of methods.
  # @throws [MissingArgument] Will throw an error if the method requires an argument and none is supplied.

  url: (method, argument) ->
    queryObject = switch
      when method is 'productDetails' then queryObject =
        p: argument
      when method is 'productSearch' then queryObject =
        q: argument
      when method is 'boxContents' then queryObject =
        k: argument
      else queryObject = undefined

    if method not of @methods
      throw new Error 'Unknown method.'

    if not argument?
      throw new Error 'Missing argument.' unless method is 'productCategories'

    query = if queryObject? then '?' + q.stringify(queryObject) else ''
    url = @urlRoot + @methods[method] + query
    return url;

  # Universal retrieval method.
  #
  # @note This method is exposed for the sake of completeness - you should not normally need to use it and should be able to rely on the other convenience methods provided.
  #
  # @param method [String] The method to be used. This has to be a part of the global methods array.
  # @param argument [String, Integer] The argument corresponding to the call.
  # @param callback [Function] cb The callback to be executed once the results arrive.

  retrieve: (method, argument, callback) ->
    url = @url(method, argument)
    request
      .get(url)
      .end (res) ->
        callback(res)

  # Retrieves a product by ID
  #
  # @example Retrieve product ID 1033 and output result to console.
  #   new Grazer.getProduct(1033, true, function(result) {
  #     console.log (result);
  #   });
  #
  # @param productId [String, Number] Product ID to be retrieved.
  # @param verbose [Boolean] Whether result should be rendered in the console.
  # @param callback [Function] cb The callback to be executed once the results arrive.
  # @throw [ProductIDNotFound] Product ID must be a valid Graze product ID.
  # @throw [ConnectionError] Will throw an error if no response can be received from the Graze API or if the response is malformed.

  getProduct: (productId, verbose, callback) ->
    @retrieve 'productDetails', productId, (result) ->
      if result?
        if result.body.success is false
          throw new Error 'Product ID ' + productId + ' not found. Please double-check ID.'
          callback []
        else if result.body
          console.log prettyjson.render result.body if verbose is true
          callback result.body
      else
        throw new Error 'Connection error. No reply from API.'


  # Searches for a product by free-form search expression
  #
  # @example Search for products that have 'jalapeno' in their description.
  #   new Grazer.getProductSearch('jalapeno', true, function(result) {
  #     console.log (result);
  #   });
  #
  # @param searchTerm [String] Term to be searched for.
  # @param verbose [Boolean] Whether result should be rendered in the console.
  # @param callback [Function] cb The callback to be executed once the results arrive.
  # @throw [ConnectionError] Will throw an error if no response can be received from the Graze API or if the response is malformed.
  getProductSearch: (searchTerm, verbose, callback) ->
    @retrieve 'productSearch', searchTerm, (result) ->
      if result?
        if result.body.success? and result.body.products?
          if result.body.products.indexOf(',') isnt -1
            products = result.body.products.split ','
          else
            products = result.body.products
          console.log 'Products:\n' + prettyjson.render products if verbose is true
          callback(products)
        else
          console.log 'No matching products found.'
          callback([])
      else
        throw new Error 'Connection error. No reply from API.'


  # Retrieves the contents of a box by box key
  #
  # @example Retrieve the contents of box F9H0N and output result to console.
  #   new Grazer.getBoxContents('F9H0N', true, function(result) {
  #     console.log (result);
  #   });
  #
  # @param boxKey [String] Box key.
  # @param verbose [Boolean] Whether result should be rendered in the console.
  # @param callback [Function] cb The callback to be executed once the results arrive.
  # @throw [BoxNotFound] Box key must be a valid Graze box key.
  # @throw [ConnectionError] Will throw an error if no response can be received from the Graze API or if the response is malformed.

  getBoxContents: (boxKey, verbose, callback) ->
    @retrieve 'boxContents', boxKey, (result) ->
      if result?
        if result.body.success? and result.body.products?
          if result.body.products.indexOf(',') isnt -1
            products = result.body.products.split ','
          else
            products = result.body.products
          console.log 'Box contains:\n' + prettyjson.render products if verbose is true
          callback(products)
        else
          if result?
            throw new Error 'Box not found. Please double-check box key.'
      else
        throw new Error 'Connection error. No reply from API.'


  # Retrieves category list of products.
  #
  # @example Get category list and output them to the console.
  #   new Grazer.getCategories(false, function(result) {
  #     console.log (result);
  #   });
  #
  # @param verbose [Boolean] Whether result should be rendered in the console.
  # @param callback [Function] cb The callback to be executed once the results arrive.
  # @throw [ConnectionError] Will throw an error if no response can be received from the Graze API or if the response is malformed.

  getCategories: (verbose, callback) ->
    @retrieve 'productCategories', null, (result) ->
      if result?.body?.success? is true
        console.log prettyjson.render result.body.categories if verbose is true
        callback(result.body.categories)
      else
        throw new Error 'Connection error. No reply from API or reply malformatted.'
