'use strict';

const assert = require('assert');
const bufferShim = require('../');
const safe = bufferShim.alloc(10);

function isZeroFilled(buf) {
  for (let n = 0; n < buf.length; n++)
    if (buf[n] > 0) return false;
  return true;
}

assert(isZeroFilled(safe));
