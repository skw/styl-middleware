/*jshint node:true*/
'use strict';

/*!
 * Styl middleware
 *
 * Copyright(c) 2013 Shaun Wong
 * MIT Licensed
 */

var styl = require( 'styl' )
, fs = require( 'fs' )
, url = require( 'url' )
, basename = require( 'path' ).basename
, dirname = require( 'path' ).dirname
, mkdirp = require( 'mkdirp' )
, join = require( 'path' ).join
, sep = require( 'path' ).sep
, compare = require( 'util' ).compare
, _ = require( 'lodash' ) 
;

var check = function( files, callback ) {
  
};

exports = module.exports = function( options ) {

  var options = options || {}
  , src = options.src || false
  , dest = options.dest || false
  , compress = options.compress || false
  , whitespace = options.whitespace || true
  , ext = options.ext || '.css'
  , files
  , reqs = { 
      src: src
      , dest: dest
    }
  ;
  
  // check require options
  _.each( reqs, function( req, key ) {
    if( !req ) {
      throw new Error('styl-middleware requires ' + key + ' directory' );
    };
  });
  
  files = fs.readdirSync( src );

  return function( req, res, next ) {
    // filter requests
    if ('GET' != req.method && 'HEAD' != req.method) return next();
    
    // get the requested path name
    var name = url.parse(req.url).pathname;
    
    // ignore non css file requests (eg: favicon)
    if( !/\.css$/.test( name ) ) {
      return next();
    };
      
    var srcPath = src + '/' + name.replace( /^.*[\\\/]/, '' ).replace( '.css', '.styl' )
    , output
    ;

    fs.exists( srcPath, function( exists ) {
      if( exists ) {

        fs.readFile( srcPath , function( err, data ) {
          if ( err ) {
            return err;
          };

          output = styl( data.toString(), { 
            compress: compress
            , whitespace: whitespace
          }).toString();
          
          res.send( output );
        })
      } else {
        res.send( 404 );
      };
    });
  };
};