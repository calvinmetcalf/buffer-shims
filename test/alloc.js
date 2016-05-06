'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var assert = require('assert');

var Buffer = require('buffer').Buffer;
var bufferShim = require('../');

// counter to ensure unique value is always copied
var cntr = 0;

var b = bufferShim.allocUnsafe(1024);

console.log('b.length == %d', b.length);
assert.strictEqual(1024, b.length);

b[0] = -1;
assert.strictEqual(b[0], 255);

for (var i = 0; i < 1024; i++) {
  b[i] = i % 256;
}

for (var _i = 0; _i < 1024; _i++) {
  assert.strictEqual(_i % 256, b[_i]);
}

var c = bufferShim.allocUnsafe(512);
console.log('c.length == %d', c.length);
assert.strictEqual(512, c.length);

var d = bufferShim.from([]);
assert.strictEqual(0, d.length);

var ui32 = new Uint32Array(4);
ui32[0] = 42;
ui32[1] = 42;
ui32[2] = 42;
ui32[3] = 42;
var e = bufferShim.from(ui32);
assert.strictEqual(e.toString('hex'), '2a2a2a2a');

assert.throws(function () {
  bufferShim.allocUnsafe(8).fill('a', -1);
});

assert.throws(function () {
  bufferShim.allocUnsafe(8).fill('a', 0, 9);
});

// Make sure this doesn't hang indefinitely.
bufferShim.allocUnsafe(8).fill('');
bufferShim.alloc(8, '');

{
  var buf = bufferShim.alloc(64, 10);
  for (var _i2 = 0; _i2 < buf.length; _i2++) {
    assert.equal(buf[_i2], 10);
  }buf.fill(11, 0, buf.length >> 1);
  for (var _i3 = 0; _i3 < buf.length >> 1; _i3++) {
    assert.equal(buf[_i3], 11);
  }for (var _i4 = (buf.length >> 1) + 1; _i4 < buf.length; _i4++) {
    assert.equal(buf[_i4], 10);
  }buf.fill('h');
  for (var _i5 = 0; _i5 < buf.length; _i5++) {
    assert.equal('h'.charCodeAt(0), buf[_i5]);
  }buf.fill(0);
  for (var _i6 = 0; _i6 < buf.length; _i6++) {
    assert.equal(0, buf[_i6]);
  }buf.fill(null);
  for (var _i7 = 0; _i7 < buf.length; _i7++) {
    assert.equal(0, buf[_i7]);
  }buf.fill(1, 16, 32);
  for (var _i8 = 0; _i8 < 16; _i8++) {
    assert.equal(0, buf[_i8]);
  }for (var _i9 = 16; _i9 < 32; _i9++) {
    assert.equal(1, buf[_i9]);
  }for (var _i10 = 32; _i10 < buf.length; _i10++) {
    assert.equal(0, buf[_i10]);
  }
}

{
  var _buf = bufferShim.alloc(10, 'abc');
  assert.equal(_buf.toString(), 'abcabcabca');
  // _buf.fill('է');
  // assert.equal(_buf.toString(), 'էէէէէ');
}

{
  // copy 512 bytes, from 0 to 512.
  b.fill(++cntr);
  c.fill(++cntr);
  var copied = b.copy(c, 0, 0, 512);
  console.log('copied %d bytes from b into c', copied);
  assert.strictEqual(512, copied);
  for (var _i11 = 0; _i11 < c.length; _i11++) {
    assert.strictEqual(b[_i11], c[_i11]);
  }
}

{
  // copy c into b, without specifying sourceEnd
  b.fill(++cntr);
  c.fill(++cntr);
  var _copied = c.copy(b, 0, 0);
  console.log('copied %d bytes from c into b w/o sourceEnd', _copied);
  assert.strictEqual(c.length, _copied);
  for (var _i12 = 0; _i12 < c.length; _i12++) {
    assert.strictEqual(c[_i12], b[_i12]);
  }
}

{
  // copy c into b, without specifying sourceStart
  b.fill(++cntr);
  c.fill(++cntr);
  var _copied2 = c.copy(b, 0);
  console.log('copied %d bytes from c into b w/o sourceStart', _copied2);
  assert.strictEqual(c.length, _copied2);
  for (var _i13 = 0; _i13 < c.length; _i13++) {
    assert.strictEqual(c[_i13], b[_i13]);
  }
}

{
  // copy longer buffer b to shorter c without targetStart
  b.fill(++cntr);
  c.fill(++cntr);
  var _copied3 = b.copy(c);
  console.log('copied %d bytes from b into c w/o targetStart', _copied3);
  assert.strictEqual(c.length, _copied3);
  for (var _i14 = 0; _i14 < c.length; _i14++) {
    assert.strictEqual(b[_i14], c[_i14]);
  }
}

{
  // copy starting near end of b to c
  b.fill(++cntr);
  c.fill(++cntr);
  var _copied4 = b.copy(c, 0, b.length - Math.floor(c.length / 2));
  console.log('copied %d bytes from end of b into beginning of c', _copied4);
  assert.strictEqual(Math.floor(c.length / 2), _copied4);
  for (var _i15 = 0; _i15 < Math.floor(c.length / 2); _i15++) {
    assert.strictEqual(b[b.length - Math.floor(c.length / 2) + _i15], c[_i15]);
  }
  for (var _i16 = Math.floor(c.length / 2) + 1; _i16 < c.length; _i16++) {
    assert.strictEqual(c[c.length - 1], c[_i16]);
  }
}

{
  // try to copy 513 bytes, and check we don't overrun c
  b.fill(++cntr);
  c.fill(++cntr);
  var _copied5 = b.copy(c, 0, 0, 513);
  console.log('copied %d bytes from b trying to overrun c', _copied5);
  assert.strictEqual(c.length, _copied5);
  for (var _i17 = 0; _i17 < c.length; _i17++) {
    assert.strictEqual(b[_i17], c[_i17]);
  }
}

{
  // copy 768 bytes from b into b
  b.fill(++cntr);
  b.fill(++cntr, 256);
  var _copied6 = b.copy(b, 0, 256, 1024);
  console.log('copied %d bytes from b into b', _copied6);
  assert.strictEqual(768, _copied6);
  for (var _i18 = 0; _i18 < b.length; _i18++) {
    assert.strictEqual(cntr, b[_i18]);
  }
}

// copy string longer than buffer length (failure will segfault)
var bb = bufferShim.allocUnsafe(10);
bb.fill('hello crazy world');

// try to copy from before the beginning of b
// assert.doesNotThrow(function () {
//   b.copy(c, 0, 100, 10);
// });

// copy throws at negative sourceStart
// assert.throws(function () {
//   bufferShim.allocUnsafe(5).copy(bufferShim.allocUnsafe(5), 0, -1);
// }, RangeError);

// {
//   // check sourceEnd resets to targetEnd if former is greater than the latter
//   b.fill(++cntr);
//   c.fill(++cntr);
//   var _copied7 = b.copy(c, 0, 0, 1025);
//   console.log('copied %d bytes from b into c', _copied7);
//   for (var _i19 = 0; _i19 < c.length; _i19++) {
//     assert.strictEqual(b[_i19], c[_i19]);
//   }
// }

// throw with negative sourceEnd
// console.log('test copy at negative sourceEnd');
// assert.throws(function () {
//   b.copy(c, 0, 0, -1);
// }, RangeError);

// // when sourceStart is greater than sourceEnd, zero copied
// assert.equal(b.copy(c, 0, 100, 10), 0);
//
// // when targetStart > targetLength, zero copied
// assert.equal(b.copy(c, 512, 0, 10), 0);
//
// var caught_error;
//
// // invalid encoding for Buffer.toString
// caught_error = null;
// try {
//   b.toString('invalid');
// } catch (err) {
//   caught_error = err;
// }
// assert.strictEqual('Unknown encoding: invalid', caught_error.message);
//
// // invalid encoding for Buffer.write
// caught_error = null;
// try {
//   b.write('test string', 0, 5, 'invalid');
// } catch (err) {
//   caught_error = err;
// }
// assert.strictEqual('Unknown encoding: invalid', caught_error.message);

// try to create 0-length buffers
bufferShim.from('');
bufferShim.from('', 'ascii');
bufferShim.from('', 'binary');
bufferShim.alloc(0);
bufferShim.allocUnsafe(0);

// try to write a 0-length string beyond the end of b
// assert.throws(function () {
//   b.write('', 2048);
// }, RangeError);

// // throw when writing to negative offset
// assert.throws(function () {
//   b.write('a', -1);
// }, RangeError);
//
// // throw when writing past bounds from the pool
// assert.throws(function () {
//   b.write('a', 2048);
// }, RangeError);
//
// // throw when writing to negative offset
// assert.throws(function () {
//   b.write('a', -1);
// }, RangeError);
//
// // try to copy 0 bytes worth of data into an empty buffer
// b.copy(bufferShim.alloc(0), 0, 0, 0);
//
// // try to copy 0 bytes past the end of the target buffer
// b.copy(bufferShim.alloc(0), 1, 1, 1);
// b.copy(bufferShim.alloc(1), 1, 1, 1);
//
// // try to copy 0 bytes from past the end of the source buffer
// b.copy(bufferShim.alloc(1), 0, 2048, 2048);
//
//
// // testing for smart defaults and ability to pass string values as offset
// var writeTest = bufferShim.from('abcdes');
// writeTest.write('n', 'ascii');
// writeTest.write('o', '1', 'ascii');
// writeTest.write('d', '2', 'ascii');
// writeTest.write('e', 3, 'ascii');
// writeTest.write('j', 4, 'ascii');
// assert.equal(writeTest.toString(), 'nodejs');

// ASCII slice test
{
  var asciiString = 'hello world';

  for (var _i20 = 0; _i20 < asciiString.length; _i20++) {
    b[_i20] = asciiString.charCodeAt(_i20);
  }
  var asciiSlice = b.toString('ascii', 0, asciiString.length);
  assert.equal(asciiString, asciiSlice);
}

{
  var _asciiString = 'hello world';
  var _offset = 100;

  var _written = b.write(_asciiString, _offset, 'ascii');
  assert.equal(_asciiString.length, _written);
  var _asciiSlice = b.toString('ascii', _offset, _offset + _asciiString.length);
  assert.equal(_asciiString, _asciiSlice);
}

{
  var _asciiString2 = 'hello world';
  var _offset2 = 100;

  var _sliceA = b.slice(_offset2, _offset2 + _asciiString2.length);
  var _sliceB = b.slice(_offset2, _offset2 + _asciiString2.length);
  for (var _i21 = 0; _i21 < _asciiString2.length; _i21++) {
    assert.equal(_sliceA[_i21], _sliceB[_i21]);
  }
}

// UTF-8 slice test

var utf8String = '¡hέlló wôrld!';
var offset = 100;

b.write(utf8String, 0, Buffer.byteLength(utf8String), 'utf8');
var utf8Slice = b.toString('utf8', 0, Buffer.byteLength(utf8String));
assert.equal(utf8String, utf8Slice);

var written = b.write(utf8String, offset, 'utf8');
assert.equal(Buffer.byteLength(utf8String), written);
utf8Slice = b.toString('utf8', offset, offset + Buffer.byteLength(utf8String));
assert.equal(utf8String, utf8Slice);

var sliceA = b.slice(offset, offset + Buffer.byteLength(utf8String));
var sliceB = b.slice(offset, offset + Buffer.byteLength(utf8String));
for (var _i22 = 0; _i22 < Buffer.byteLength(utf8String); _i22++) {
  assert.equal(sliceA[_i22], sliceB[_i22]);
}

{
  var slice = b.slice(100, 150);
  assert.equal(50, slice.length);
  for (var _i23 = 0; _i23 < 50; _i23++) {
    assert.equal(b[100 + _i23], slice[_i23]);
  }
}

{
  // make sure only top level parent propagates from allocPool
  var _b = bufferShim.allocUnsafe(5);
  var _c = _b.slice(0, 4);
  var _d = _c.slice(0, 2);
  assert.equal(_b.parent, _c.parent);
  assert.equal(_b.parent, _d.parent);
}

{
  // also from a non-pooled instance
  var _b2 = bufferShim.allocUnsafeSlow(5);
  var _c2 = _b2.slice(0, 4);
  var _d2 = _c2.slice(0, 2);
  assert.equal(_c2.parent, _d2.parent);
}

{
  // Bug regression test
  var testValue = 'ö日本語'; // ö日本語
  var buffer = bufferShim.allocUnsafe(32);
  var size = buffer.write(testValue, 0, 'utf8');
  console.log('bytes written to buffer: ' + size);
  var _slice = buffer.toString('utf8', 0, size);
  assert.equal(_slice, testValue);
}

{
  // Test triple  slice
  var a = bufferShim.allocUnsafe(8);
  for (var _i24 = 0; _i24 < 8; _i24++) {
    a[_i24] = _i24;
  }var _b3 = a.slice(4, 8);
  assert.equal(4, _b3[0]);
  assert.equal(5, _b3[1]);
  assert.equal(6, _b3[2]);
  assert.equal(7, _b3[3]);
  var _c3 = _b3.slice(2, 4);
  assert.equal(6, _c3[0]);
  assert.equal(7, _c3[1]);
}

{
  var _d3 = bufferShim.from([23, 42, 255]);
  assert.equal(_d3.length, 3);
  assert.equal(_d3[0], 23);
  assert.equal(_d3[1], 42);
  assert.equal(_d3[2], 255);
  assert.deepEqual(_d3, bufferShim.from(_d3));
}

{
  var _e = bufferShim.from('über');
  console.error('uber: \'%s\'', _e.toString());
  assert.deepEqual(_e, bufferShim.from([195, 188, 98, 101, 114]));
}

{
  var f = bufferShim.from('über', 'ascii');
  console.error('f.length: %d     (should be 4)', f.length);
  assert.deepEqual(f, bufferShim.from([252, 98, 101, 114]));
}

['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach(function (encoding) {
  {
    var _f = bufferShim.from('über', encoding);
    console.error('f.length: %d     (should be 8)', _f.length);
    assert.deepEqual(_f, bufferShim.from([252, 0, 98, 0, 101, 0, 114, 0]));
  }

  {
    var _f2 = bufferShim.from('привет', encoding);
    console.error('f.length: %d     (should be 12)', _f2.length);
    assert.deepEqual(_f2, bufferShim.from([63, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66, 4]));
    assert.equal(_f2.toString(encoding), 'привет');
  }

  {
    var _f3 = bufferShim.from([0, 0, 0, 0, 0]);
    assert.equal(_f3.length, 5);
    var _size = _f3.write('あいうえお', encoding);
    console.error('bytes written to buffer: %d     (should be 4)', _size);
    assert.equal(_size, 4);
    assert.deepEqual(_f3, bufferShim.from([0x42, 0x30, 0x44, 0x30, 0x00]));
  }
});

{
  var _f4 = bufferShim.from('👍', 'utf-16le'); // THUMBS UP SIGN (U+1F44D)
  assert.equal(_f4.length, 4);
  assert.deepEqual(_f4, bufferShim.from('3DD84DDC', 'hex'));
}

var arrayIsh = { 0: 0, 1: 1, 2: 2, 3: 3, length: 4 };
var g = bufferShim.from(arrayIsh);
assert.deepEqual(g, bufferShim.from([0, 1, 2, 3]));
var strArrayIsh = { 0: '0', 1: '1', 2: '2', 3: '3', length: 4 };
g = bufferShim.from(strArrayIsh);
assert.deepEqual(g, bufferShim.from([0, 1, 2, 3]));

//
// Test toString('base64')
//
assert.equal('TWFu', bufferShim.from('Man').toString('base64'));

{
  // test that regular and URL-safe base64 both work
  var expected = [0xff, 0xff, 0xbe, 0xff, 0xef, 0xbf, 0xfb, 0xef, 0xff];
  assert.deepEqual(bufferShim.from('//++/++/++//', 'base64'), bufferShim.from(expected));
  assert.deepEqual(bufferShim.from('__--_--_--__', 'base64'), bufferShim.from(expected));
}

{
  // big example
  var quote = 'Man is distinguished, not only by his reason, but by this ' + 'singular passion from other animals, which is a lust ' + 'of the mind, that by a perseverance of delight in the ' + 'continued and indefatigable generation of knowledge, ' + 'exceeds the short vehemence of any carnal pleasure.';
  var _expected = 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb' + '24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlci' + 'BhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQ' + 'gYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGlu' + 'dWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZ' + 'GdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm' + '5hbCBwbGVhc3VyZS4=';
  assert.equal(_expected, bufferShim.from(quote).toString('base64'));

  var _b4 = bufferShim.allocUnsafe(1024);
  var bytesWritten = _b4.write(_expected, 0, 'base64');
  assert.equal(quote.length, bytesWritten);
  assert.equal(quote, _b4.toString('ascii', 0, quote.length));

  // check that the base64 decoder ignores whitespace
  var expectedWhite = _expected.slice(0, 60) + ' \n' + _expected.slice(60, 120) + ' \n' + _expected.slice(120, 180) + ' \n' + _expected.slice(180, 240) + ' \n' + _expected.slice(240, 300) + '\n' + _expected.slice(300, 360) + '\n';
  _b4 = bufferShim.allocUnsafe(1024);
  bytesWritten = _b4.write(expectedWhite, 0, 'base64');
  assert.equal(quote.length, bytesWritten);
  assert.equal(quote, _b4.toString('ascii', 0, quote.length));

  // check that the base64 decoder on the constructor works
  // even in the presence of whitespace.
  _b4 = bufferShim.from(expectedWhite, 'base64');
  assert.equal(quote.length, _b4.length);
  assert.equal(quote, _b4.toString('ascii', 0, quote.length));

  // check that the base64 decoder ignores illegal chars
  var expectedIllegal = _expected.slice(0, 60) + ' \x80' + _expected.slice(60, 120) + ' \xff' + _expected.slice(120, 180) + ' \x00' + _expected.slice(180, 240) + ' \x98' + _expected.slice(240, 300) + '\x03' + _expected.slice(300, 360);
  _b4 = bufferShim.from(expectedIllegal, 'base64');
  assert.equal(quote.length, _b4.length);
  assert.equal(quote, _b4.toString('ascii', 0, quote.length));
}

assert.equal(bufferShim.from('', 'base64').toString(), '');
assert.equal(bufferShim.from('K', 'base64').toString(), '');

// multiple-of-4 with padding
assert.equal(bufferShim.from('Kg==', 'base64').toString(), '*');
assert.equal(bufferShim.from('Kio=', 'base64').toString(), '**');
assert.equal(bufferShim.from('Kioq', 'base64').toString(), '***');
assert.equal(bufferShim.from('KioqKg==', 'base64').toString(), '****');
assert.equal(bufferShim.from('KioqKio=', 'base64').toString(), '*****');
assert.equal(bufferShim.from('KioqKioq', 'base64').toString(), '******');
assert.equal(bufferShim.from('KioqKioqKg==', 'base64').toString(), '*******');
assert.equal(bufferShim.from('KioqKioqKio=', 'base64').toString(), '********');
assert.equal(bufferShim.from('KioqKioqKioq', 'base64').toString(), '*********');
assert.equal(bufferShim.from('KioqKioqKioqKg==', 'base64').toString(), '**********');
assert.equal(bufferShim.from('KioqKioqKioqKio=', 'base64').toString(), '***********');
assert.equal(bufferShim.from('KioqKioqKioqKioq', 'base64').toString(), '************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKg==', 'base64').toString(), '*************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKio=', 'base64').toString(), '**************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKioq', 'base64').toString(), '***************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKioqKg==', 'base64').toString(), '****************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKioqKio=', 'base64').toString(), '*****************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKioqKioq', 'base64').toString(), '******************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKioqKioqKg==', 'base64').toString(), '*******************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKioqKioqKio=', 'base64').toString(), '********************');

// no padding, not a multiple of 4
assert.equal(bufferShim.from('Kg', 'base64').toString(), '*');
assert.equal(bufferShim.from('Kio', 'base64').toString(), '**');
assert.equal(bufferShim.from('KioqKg', 'base64').toString(), '****');
assert.equal(bufferShim.from('KioqKio', 'base64').toString(), '*****');
assert.equal(bufferShim.from('KioqKioqKg', 'base64').toString(), '*******');
assert.equal(bufferShim.from('KioqKioqKio', 'base64').toString(), '********');
assert.equal(bufferShim.from('KioqKioqKioqKg', 'base64').toString(), '**********');
assert.equal(bufferShim.from('KioqKioqKioqKio', 'base64').toString(), '***********');
assert.equal(bufferShim.from('KioqKioqKioqKioqKg', 'base64').toString(), '*************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKio', 'base64').toString(), '**************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKioqKg', 'base64').toString(), '****************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKioqKio', 'base64').toString(), '*****************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKioqKioqKg', 'base64').toString(), '*******************');
assert.equal(bufferShim.from('KioqKioqKioqKioqKioqKioqKio', 'base64').toString(), '********************');

// handle padding graciously, multiple-of-4 or not
assert.equal(bufferShim.from('72INjkR5fchcxk9+VgdGPFJDxUBFR5/rMFsghgxADiw==', 'base64').length, 32);
assert.equal(bufferShim.from('72INjkR5fchcxk9+VgdGPFJDxUBFR5/rMFsghgxADiw=', 'base64').length, 32);
assert.equal(bufferShim.from('72INjkR5fchcxk9+VgdGPFJDxUBFR5/rMFsghgxADiw', 'base64').length, 32);
assert.equal(bufferShim.from('w69jACy6BgZmaFvv96HG6MYksWytuZu3T1FvGnulPg==', 'base64').length, 31);
assert.equal(bufferShim.from('w69jACy6BgZmaFvv96HG6MYksWytuZu3T1FvGnulPg=', 'base64').length, 31);
assert.equal(bufferShim.from('w69jACy6BgZmaFvv96HG6MYksWytuZu3T1FvGnulPg', 'base64').length, 31);

// This string encodes single '.' character in UTF-16
var dot = bufferShim.from('//4uAA==', 'base64');
assert.equal(dot[0], 0xff);
assert.equal(dot[1], 0xfe);
assert.equal(dot[2], 0x2e);
assert.equal(dot[3], 0x00);
assert.equal(dot.toString('base64'), '//4uAA==');

{
  // Writing base64 at a position > 0 should not mangle the result.
  //
  // https://github.com/joyent/node/issues/402
  var segments = ['TWFkbmVzcz8h', 'IFRoaXM=', 'IGlz', 'IG5vZGUuanMh'];
  var _b5 = bufferShim.allocUnsafe(64);
  var pos = 0;

  for (var _i25 = 0; _i25 < segments.length; ++_i25) {
    pos += _b5.write(segments[_i25], pos, 'base64');
  }
  assert.equal(_b5.toString('binary', 0, pos), 'Madness?! This is node.js!');
}
function repeat(string, times) {
  var out = '';
  while (times--) {
    out += string;
  }
  return out;
}
// Regression test for https://github.com/nodejs/node/issues/3496.
//assert.equal(bufferShim.from(repeat('=bad', 1e4), 'base64').length, 0);

{
  // Creating buffers larger than pool size.
  var l = Buffer.poolSize + 5;
  var s = '';
  for (var _i26 = 0; _i26 < l; _i26++) {
    s += 'h';
  }

  var _b6 = bufferShim.from(s);

  for (var _i27 = 0; _i27 < l; _i27++) {
    assert.equal('h'.charCodeAt(0), _b6[_i27]);
  }

  var sb = _b6.toString();
  assert.equal(sb.length, s.length);
  assert.equal(sb, s);
}

{
  // Single argument slice
  var _b7 = bufferShim.from('abcde');
  assert.equal('bcde', _b7.slice(1).toString());
}

// slice(0,0).length === 0
assert.equal(0, bufferShim.from('hello').slice(0, 0).length);

// test hex toString
console.log('Create hex string from buffer');
var hexb = bufferShim.allocUnsafe(256);
for (var _i28 = 0; _i28 < 256; _i28++) {
  hexb[_i28] = _i28;
}
var hexStr = hexb.toString('hex');
assert.equal(hexStr, '000102030405060708090a0b0c0d0e0f' + '101112131415161718191a1b1c1d1e1f' + '202122232425262728292a2b2c2d2e2f' + '303132333435363738393a3b3c3d3e3f' + '404142434445464748494a4b4c4d4e4f' + '505152535455565758595a5b5c5d5e5f' + '606162636465666768696a6b6c6d6e6f' + '707172737475767778797a7b7c7d7e7f' + '808182838485868788898a8b8c8d8e8f' + '909192939495969798999a9b9c9d9e9f' + 'a0a1a2a3a4a5a6a7a8a9aaabacadaeaf' + 'b0b1b2b3b4b5b6b7b8b9babbbcbdbebf' + 'c0c1c2c3c4c5c6c7c8c9cacbcccdcecf' + 'd0d1d2d3d4d5d6d7d8d9dadbdcdddedf' + 'e0e1e2e3e4e5e6e7e8e9eaebecedeeef' + 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff');

console.log('Create buffer from hex string');
var hexb2 = bufferShim.from(hexStr, 'hex');
for (var _i29 = 0; _i29 < 256; _i29++) {
  assert.equal(hexb2[_i29], hexb[_i29]);
}

{
  // test an invalid slice end.
  console.log('Try to slice off the end of the buffer');
  var _b8 = bufferShim.from([1, 2, 3, 4, 5]);
  var _b9 = _b8.toString('hex', 1, 10000);
  var b3 = _b8.toString('hex', 1, 5);
  var b4 = _b8.toString('hex', 1);
  assert.equal(_b9, b3);
  assert.equal(_b9, b4);
}

function buildBuffer(data) {
  if (Array.isArray(data)) {
    var buffer = bufferShim.allocUnsafe(data.length);
    data.forEach(function (v, k) {
      buffer[k] = v;
    });
    return buffer;
  }
  return null;
}

var x = buildBuffer([0x81, 0xa3, 0x66, 0x6f, 0x6f, 0xa3, 0x62, 0x61, 0x72]);

console.log(x.inspect());
assert.equal('<Buffer 81 a3 66 6f 6f a3 62 61 72>', x.inspect());

{
  var z = x.slice(4);
  console.log(z.inspect());
  console.log(z.length);
  assert.equal(5, z.length);
  assert.equal(0x6f, z[0]);
  assert.equal(0xa3, z[1]);
  assert.equal(0x62, z[2]);
  assert.equal(0x61, z[3]);
  assert.equal(0x72, z[4]);
}

{
  var _z = x.slice(0);
  console.log(_z.inspect());
  console.log(_z.length);
  assert.equal(_z.length, x.length);
}

{
  var _z2 = x.slice(0, 4);
  console.log(_z2.inspect());
  console.log(_z2.length);
  assert.equal(4, _z2.length);
  assert.equal(0x81, _z2[0]);
  assert.equal(0xa3, _z2[1]);
}

{
  var _z3 = x.slice(0, 9);
  console.log(_z3.inspect());
  console.log(_z3.length);
  assert.equal(9, _z3.length);
}

{
  var _z4 = x.slice(1, 4);
  console.log(_z4.inspect());
  console.log(_z4.length);
  assert.equal(3, _z4.length);
  assert.equal(0xa3, _z4[0]);
}

{
  var _z5 = x.slice(2, 4);
  console.log(_z5.inspect());
  console.log(_z5.length);
  assert.equal(2, _z5.length);
  assert.equal(0x66, _z5[0]);
  assert.equal(0x6f, _z5[1]);
}

assert.equal(0, bufferShim.from('hello').slice(0, 0).length);

['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach(function (encoding) {
  var b = bufferShim.allocUnsafe(10);
  b.write('あいうえお', encoding);
  assert.equal(b.toString(encoding), 'あいうえお');
});

{
  // Binary encoding should write only one byte per character.
  var _b10 = bufferShim.from([0xde, 0xad, 0xbe, 0xef]);
  var _s = String.fromCharCode(0xffff);
  _b10.write(_s, 0, 'binary');
  assert.equal(0xff, _b10[0]);
  assert.equal(0xad, _b10[1]);
  assert.equal(0xbe, _b10[2]);
  assert.equal(0xef, _b10[3]);
  _s = String.fromCharCode(0xaaee);
  _b10.write(_s, 0, 'binary');
  assert.equal(0xee, _b10[0]);
  assert.equal(0xad, _b10[1]);
  assert.equal(0xbe, _b10[2]);
  assert.equal(0xef, _b10[3]);
}

{
  // #1210 Test UTF-8 string includes null character
  var _buf2 = bufferShim.from('\0');
  assert.equal(_buf2.length, 1);
  _buf2 = bufferShim.from('\0\0');
  assert.equal(_buf2.length, 2);
}

{
  var _buf3 = bufferShim.allocUnsafe(2);
  var _written2 = _buf3.write(''); // 0byte
  assert.equal(_written2, 0);
  _written2 = _buf3.write('\0'); // 1byte (v8 adds null terminator)
  assert.equal(_written2, 1);
  _written2 = _buf3.write('a\0'); // 1byte * 2
  assert.equal(_written2, 2);
  _written2 = _buf3.write('あ'); // 3bytes
  assert.equal(_written2, 0);
  _written2 = _buf3.write('\0あ'); // 1byte + 3bytes
  assert.equal(_written2, 1);
  _written2 = _buf3.write('\0\0あ'); // 1byte * 2 + 3bytes
  assert.equal(_written2, 2);
}

{
  var _buf4 = bufferShim.allocUnsafe(10);
  written = _buf4.write('あいう'); // 3bytes * 3 (v8 adds null terminator)
  assert.equal(written, 9);
  written = _buf4.write('あいう\0'); // 3bytes * 3 + 1byte
  assert.equal(written, 10);
}

{
  (function () {
    // #243 Test write() with maxLength
    var buf = bufferShim.allocUnsafe(4);
    buf.fill(0xFF);
    var written = buf.write('abcd', 1, 2, 'utf8');
    console.log(buf);
    assert.equal(written, 2);
    assert.equal(buf[0], 0xFF);
    assert.equal(buf[1], 0x61);
    assert.equal(buf[2], 0x62);
    assert.equal(buf[3], 0xFF);

    buf.fill(0xFF);
    written = buf.write('abcd', 1, 4);
    console.log(buf);
    assert.equal(written, 3);
    assert.equal(buf[0], 0xFF);
    assert.equal(buf[1], 0x61);
    assert.equal(buf[2], 0x62);
    assert.equal(buf[3], 0x63);

    buf.fill(0xFF);
    written = buf.write('abcd', 1, 2, 'utf8');
    console.log(buf);
    assert.equal(written, 2);
    assert.equal(buf[0], 0xFF);
    assert.equal(buf[1], 0x61);
    assert.equal(buf[2], 0x62);
    assert.equal(buf[3], 0xFF);

    buf.fill(0xFF);
    written = buf.write('abcdef', 1, 2, 'hex');
    console.log(buf);
    assert.equal(written, 2);
    assert.equal(buf[0], 0xFF);
    assert.equal(buf[1], 0xAB);
    assert.equal(buf[2], 0xCD);
    assert.equal(buf[3], 0xFF);

    ['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach(function (encoding) {
      buf.fill(0xFF);
      written = buf.write('abcd', 0, 2, encoding);
      console.log(buf);
      assert.equal(written, 2);
      assert.equal(buf[0], 0x61);
      assert.equal(buf[1], 0x00);
      assert.equal(buf[2], 0xFF);
      assert.equal(buf[3], 0xFF);
    });
  })();
}

// {
//   // test offset returns are correct
//   var _b11 = bufferShim.allocUnsafe(16);
//   assert.equal(4, _b11.writeUInt32LE(0, 0));
//   assert.equal(6, _b11.writeUInt16LE(0, 4));
//   assert.equal(7, _b11.writeUInt8(0, 6));
//   assert.equal(8, _b11.writeInt8(0, 7));
//   assert.equal(16, _b11.writeDoubleLE(0, 8));
// }

{
  // test unmatched surrogates not producing invalid utf8 output
  // ef bf bd = utf-8 representation of unicode replacement character
  // see https://codereview.chromium.org/121173009/
  var _buf5 = bufferShim.from('ab�cd', 'utf8');
  assert.equal(_buf5[0], 0x61);
  assert.equal(_buf5[1], 0x62);
  assert.equal(_buf5[2], 0xef);
  assert.equal(_buf5[3], 0xbf);
  assert.equal(_buf5[4], 0xbd);
  assert.equal(_buf5[5], 0x63);
  assert.equal(_buf5[6], 0x64);
}

{
  // test for buffer overrun
  var _buf6 = bufferShim.from([0, 0, 0, 0, 0]); // length: 5
  var sub = _buf6.slice(0, 4); // length: 4
  written = sub.write('12345', 'binary');
  assert.equal(written, 4);
  assert.equal(_buf6[4], 0);
}

// Check for fractional length args, junk length args, etc.
// https://github.com/joyent/node/issues/1758

// Call .fill() first, stops valgrind warning about uninitialized memory reads.
// var t = bufferShim.allocUnsafe(3.3);
// t.fill();
// t.toString();
// // throws bad argument error in commit 43cb4ec
// bufferShim.alloc(3.3).fill().toString();
assert.equal(bufferShim.allocUnsafe(-1).length, 0);
assert.equal(bufferShim.allocUnsafe(NaN).length, 0);
//assert.equal(bufferShim.allocUnsafe(3.3).length, 3);
//assert.equal(bufferShim.from({ length: 3.3 }).length, 3);
assert.equal(bufferShim.from({ length: 'BAM' }).length, 0);

// Make sure that strings are not coerced to numbers.
assert.equal(bufferShim.from('99').length, 2);
assert.equal(bufferShim.from('13.37').length, 5);

// Ensure that the length argument is respected.
'ascii utf8 hex base64 binary'.split(' ').forEach(function (enc) {
  assert.equal(bufferShim.allocUnsafe(1).write('aaaaaa', 0, 1, enc), 1);
});

{
  // Regression test, guard against buffer overrun in the base64 decoder.
  var _a = bufferShim.allocUnsafe(3);
  var _b12 = bufferShim.from('xxx');
  _a.write('aaaaaaaa', 'base64');
  assert.equal(_b12.toString(), 'xxx');
}

// // issue GH-3416
// bufferShim.from(bufferShim.allocUnsafe(0), 0, 0);
//
// ['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach(function (enc) {
//   assert.equal(Buffer.isEncoding(enc), true);
// });
//
// ['utf9', 'utf-7', 'Unicode-FTW', 'new gnu gun'].forEach(function (enc) {
//   assert.equal(Buffer.isEncoding(enc), false);
// });

// // GH-5110
// (function () {
//   var buffer = bufferShim.from('test');
//   var string = JSON.stringify(buffer);
//
//   assert.equal(string, '{"type":"Buffer","data":[116,101,115,116]}');
//
//   assert.deepEqual(buffer, JSON.parse(string, function (key, value) {
//     return value && value.type === 'Buffer' ? bufferShim.from(value.data) : value;
//   }));
// })();

// issue GH-7849
(function () {
  var buf = bufferShim.from('test');
  var json = JSON.stringify(buf);
  var obj = JSON.parse(json);
  var copy = bufferShim.from(obj);

  assert(buf.toString('hex') === copy.toString('hex'));
})();

// issue GH-4331
assert.throws(function () {
  bufferShim.allocUnsafe(0xFFFFFFFF);
});
assert.throws(function () {
  bufferShim.allocUnsafe(0xFFFFFFFFF);
});

// attempt to overflow buffers, similar to previous bug in array buffers
assert.throws(function () {
  var buf = bufferShim.allocUnsafe(8);
  buf.readFloatLE(0xffffffff);
});

assert.throws(function () {
  var buf = bufferShim.allocUnsafe(8);
  buf.writeFloatLE(0.0, 0xffffffff);
});

assert.throws(function () {
  var buf = bufferShim.allocUnsafe(8);
  buf.readFloatLE(0xffffffff);
});

assert.throws(function () {
  var buf = bufferShim.allocUnsafe(8);
  buf.writeFloatLE(0.0, 0xffffffff);
});

// ensure negative values can't get past offset
// assert.throws(function () {
//   var buf = bufferShim.allocUnsafe(8);
//   buf.readFloatLE(-1);
// });
//
// assert.throws(function () {
//   var buf = bufferShim.allocUnsafe(8);
//   buf.writeFloatLE(0.0, -1);
// });
//
// assert.throws(function () {
//   var buf = bufferShim.allocUnsafe(8);
//   buf.readFloatLE(-1);
// });
//
// assert.throws(function () {
//   var buf = bufferShim.allocUnsafe(8);
//   buf.writeFloatLE(0.0, -1);
// });

// offset checks
{
  (function () {
    var buf = bufferShim.allocUnsafe(0);

    assert.throws(function () {
      buf.readUInt8(0);
    });
    assert.throws(function () {
      buf.readInt8(0);
    });
  })();
}

{
  var _buf7 = bufferShim.from([0xFF]);

  assert.equal(_buf7.readUInt8(0), 255);
  assert.equal(_buf7.readInt8(0), -1);
}

[16, 32].forEach(function (bits) {
  var buf = bufferShim.allocUnsafe(bits / 8 - 1);

  assert.throws(function () {
    buf['readUInt' + bits + 'BE'](0);
  }, 'readUInt' + bits + 'BE');

  assert.throws(function () {
    buf['readUInt' + bits + 'LE'](0);
  }, 'readUInt' + bits + 'LE');

  assert.throws(function () {
    buf['readInt' + bits + 'BE'](0);
  }, 'readInt' + bits + 'BE()');

  assert.throws(function () {
    buf['readInt' + bits + 'LE'](0);
  }, 'readInt' + bits + 'LE()');
});

[16, 32].forEach(function (bits) {
  var buf = bufferShim.from([0xFF, 0xFF, 0xFF, 0xFF]);

  assert.equal(buf['readUInt' + bits + 'BE'](0), 0xFFFFFFFF >>> 32 - bits);

  assert.equal(buf['readUInt' + bits + 'LE'](0), 0xFFFFFFFF >>> 32 - bits);

  assert.equal(buf['readInt' + bits + 'BE'](0), 0xFFFFFFFF >> 32 - bits);

  assert.equal(buf['readInt' + bits + 'LE'](0), 0xFFFFFFFF >> 32 - bits);
});


// test Buffer slice
// (function () {
//   var buf = bufferShim.from('0123456789');
//   assert.equal(buf.slice(-10, 10), '0123456789');
//   assert.equal(buf.slice(-20, 10), '0123456789');
//   assert.equal(buf.slice(-20, -10), '');
//   assert.equal(buf.slice(), '0123456789');
//   assert.equal(buf.slice(0), '0123456789');
//   assert.equal(buf.slice(0, 0), '');
//   assert.equal(buf.slice(undefined), '0123456789');
//   assert.equal(buf.slice('foobar'), '0123456789');
//   assert.equal(buf.slice(undefined, undefined), '0123456789');
//
//   assert.equal(buf.slice(2), '23456789');
//   assert.equal(buf.slice(5), '56789');
//   assert.equal(buf.slice(10), '');
//   assert.equal(buf.slice(5, 8), '567');
//   assert.equal(buf.slice(8, -1), '8');
//   assert.equal(buf.slice(-10), '0123456789');
//   assert.equal(buf.slice(0, -9), '0');
//   assert.equal(buf.slice(0, -10), '');
//   assert.equal(buf.slice(0, -1), '012345678');
//   assert.equal(buf.slice(2, -2), '234567');
//   assert.equal(buf.slice(0, 65536), '0123456789');
//   assert.equal(buf.slice(65536, 0), '');
//   assert.equal(buf.slice(-5, -8), '');
//   assert.equal(buf.slice(-5, -3), '56');
//   assert.equal(buf.slice(-10, 10), '0123456789');
//   for (var _i30 = 0, _s2 = buf.toString(); _i30 < buf.length; ++_i30) {
//     assert.equal(buf.slice(_i30), _s2.slice(_i30));
//     assert.equal(buf.slice(0, _i30), _s2.slice(0, _i30));
//     assert.equal(buf.slice(-_i30), _s2.slice(-_i30));
//     assert.equal(buf.slice(0, -_i30), _s2.slice(0, -_i30));
//   }
//
//   var utf16Buf = bufferShim.from('0123456789', 'utf16le');
//   assert.deepEqual(utf16Buf.slice(0, 6), bufferShim.from('012', 'utf16le'));
//
//   // assert.equal(buf.slice('0', '1'), '0');
//   // assert.equal(buf.slice('-5', '10'), '56789');
//   // assert.equal(buf.slice('-10', '10'), '0123456789');
//   // assert.equal(buf.slice('-10', '-5'), '01234');
//   // assert.equal(buf.slice('-10', '-0'), '');
//   // assert.equal(buf.slice('111'), '');
//   // assert.equal(buf.slice('0', '-111'), '');
//
//   // try to slice a zero length Buffer
//   // see https://github.com/joyent/node/issues/5881
//   bufferShim.alloc(0).slice(0, 1);
// })();

// Regression test for #5482: should throw but not assert in C++ land.
assert.throws(function () {
  bufferShim.from('', 'buffer');
});

// Regression test for #6111. Constructing a buffer from another buffer
// should a) work, and b) not corrupt the source buffer.
(function () {
  var a = [0];
  for (var _i31 = 0; _i31 < 7; ++_i31) {
    a = a.concat(a);
  }a = a.map(function (_, i) {
    return i;
  });
  var b = bufferShim.from(a);
  var c = bufferShim.from(b);
  assert.equal(b.length, a.length);
  assert.equal(c.length, a.length);
  for (var _i32 = 0, k = a.length; _i32 < k; ++_i32) {
    assert.equal(a[_i32], _i32);
    assert.equal(b[_i32], _i32);
    assert.equal(c[_i32], _i32);
  }
})();

assert.throws(function () {
  bufferShim.allocUnsafe((-1 >>> 0) + 1);
});

assert.throws(function () {
  bufferShim.allocUnsafeSlow((-1 >>> 0) + 1);
});

// Test Compare
// {
//   var _b13 = bufferShim.alloc(1, 'a');
//   var _c4 = bufferShim.alloc(1, 'c');
//   var _d4 = bufferShim.alloc(2, 'aa');
//
//   assert.equal(_b13.compare(_c4), -1);
//   assert.equal(_c4.compare(_d4), 1);
//   assert.equal(_d4.compare(_b13), 1);
//   assert.equal(_b13.compare(_d4), -1);
//   assert.equal(_b13.compare(_b13), 0);
//
//   assert.equal(Buffer.compare(_b13, _c4), -1);
//   assert.equal(Buffer.compare(_c4, _d4), 1);
//   assert.equal(Buffer.compare(_d4, _b13), 1);
//   assert.equal(Buffer.compare(_b13, _d4), -1);
//   assert.equal(Buffer.compare(_c4, _c4), 0);
//
//   assert.equal(Buffer.compare(bufferShim.alloc(0), bufferShim.alloc(0)), 0);
//   assert.equal(Buffer.compare(bufferShim.alloc(0), bufferShim.alloc(1)), -1);
//   assert.equal(Buffer.compare(bufferShim.alloc(1), bufferShim.alloc(0)), 1);
// }

assert.throws(function () {
  var b = bufferShim.allocUnsafe(1);
  Buffer.compare(b, 'abc');
});

assert.throws(function () {
  var b = bufferShim.allocUnsafe(1);
  Buffer.compare('abc', b);
});

assert.throws(function () {
  var b = bufferShim.allocUnsafe(1);
  b.compare('abc');
});

// Test Equals
//{
//   var _b14 = bufferShim.alloc(5, 'abcdf');
//   var _c5 = bufferShim.alloc(5, 'abcdf');
//   var _d5 = bufferShim.alloc(5, 'abcde');
//   var _e2 = bufferShim.alloc(6, 'abcdef');
//
//   assert.ok(_b14.equals(_c5));
//   assert.ok(!_c5.equals(_d5));
//   assert.ok(!_d5.equals(_e2));
//   assert.ok(_d5.equals(_d5));
// }

assert.throws(function () {
  var b = bufferShim.allocUnsafe(1);
  b.equals('abc');
});

// Regression test for https://github.com/nodejs/node/issues/649.
assert.throws(function () {
  bufferShim.allocUnsafe(1422561062959).toString('utf8');
});

var ps = Buffer.poolSize;
Buffer.poolSize = 0;
// assert.equal(bufferShim.allocUnsafe(1).parent, undefined);
Buffer.poolSize = ps;

// Test Buffer.copy() segfault
// assert.throws(function () {
//   bufferShim.allocUnsafe(10).copy();
// });

assert.throws(function () {
  bufferShim.from();
}, TypeError);

assert.throws(function () {
  bufferShim.from(null);
}, TypeError);

// Test that ParseArrayIndex handles full uint32
assert.throws(function () {
  bufferShim.from(new ArrayBuffer(0), -1 >>> 0);
}, /RangeError: 'offset' is out of bounds/);

// Unpooled buffer (replaces SlowBuffer)
var ubuf = bufferShim.allocUnsafeSlow(10);
assert(ubuf);
// assert(ubuf.buffer);
// assert.equal(ubuf.buffer.byteLength, 10);


var abBuf = bufferShim.alloc(8, 'ab');
assert.equal(abBuf.toString('hex'), '6162616261626162');

var abBuf2 = bufferShim.alloc(8, 'ab', 'hex');
assert.equal(abBuf2.toString('hex'), 'abababababababab');
