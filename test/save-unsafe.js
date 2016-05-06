'use strict';

var assert = require('assert');
var bufferShim = require('../');
var safe = bufferShim.alloc(10);

function isZeroFilled(buf) {
  for (var n = 0; n < buf.length; n++)
    if (buf[n] > 0) return false;
  return true;
}

assert(isZeroFilled(safe));
