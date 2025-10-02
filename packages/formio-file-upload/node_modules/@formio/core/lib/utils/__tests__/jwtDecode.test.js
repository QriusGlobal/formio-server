"use strict";
// copied from https://github.com/auth0/jwt-decode
Object.defineProperty(exports, "__esModule", { value: true });
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJleHAiOjEzOTMyODY4OTMsImlhdCI6MTM5MzI2ODg5M30.4-iaDojEVl0pJQMjrbM1EzUIfAZgsbK_kgnVyVxFSVo';
const jwtDecode_1 = require("../jwtDecode");
const chai_1 = require("chai");
describe('Test jwtDecode', function () {
    it('should fail to construct without a clientID', function () {
        const decoded = (0, jwtDecode_1.jwtDecode)(token);
        (0, chai_1.expect)(decoded.exp).to.equal(1393286893);
        (0, chai_1.expect)(decoded.iat).to.equal(1393268893);
        (0, chai_1.expect)(decoded.foo).to.equal('bar');
    });
    it('should return header information', function () {
        const decoded = (0, jwtDecode_1.jwtDecode)(token, { header: true });
        (0, chai_1.expect)(decoded.typ).to.equal('JWT');
        (0, chai_1.expect)(decoded.alg).to.equal('HS256');
    });
    it('should work with utf8 tokens', function () {
        const utf8_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiSm9zw6kiLCJpYXQiOjE0MjU2NDQ5NjZ9.1CfFtdGUPs6q8kT3OGQSVlhEMdbuX0HfNSqum0023a0';
        const decoded = (0, jwtDecode_1.jwtDecode)(utf8_token);
        (0, chai_1.expect)(decoded.name).to.equal('José');
    });
    it('should work with binary tokens', function () {
        const binary_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiSm9z6SIsImlhdCI6MTQyNTY0NDk2Nn0.cpnplCBxiw7Xqz5thkqs4Mo_dymvztnI0CI4BN0d1t8';
        const decoded = (0, jwtDecode_1.jwtDecode)(binary_token);
        (0, chai_1.expect)(decoded.name).to.equal('José');
    });
    it('should work with double padding', function () {
        const utf8_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpvc8OpIiwiaWF0IjoxNTE2MjM5MDIyfQ.7A3F5SUH2gbBSYVon5mas_Y-KCrWojorKQg7UKGVEIA';
        const decoded = (0, jwtDecode_1.jwtDecode)(utf8_token);
        (0, chai_1.expect)(decoded.name).to.equal('José');
    });
    it('should work with single padding', function () {
        const utf8_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpvc8OpZSIsImlhdCI6MTUxNjIzOTAyMn0.tbjJzDAylkKSV0_YGR5xBJBlFK01C82nZPLIcA3JX1g';
        const decoded = (0, jwtDecode_1.jwtDecode)(utf8_token);
        (0, chai_1.expect)(decoded.name).to.equal('Josée');
    });
    it('should throw error on nonstring', function () {
        const bad_token = null;
        (0, chai_1.expect)(function () {
            (0, jwtDecode_1.jwtDecode)(bad_token);
        }).to.throw();
    });
    it('should throw error on string that is not a token', function () {
        const bad_token = 'fubar';
        (0, chai_1.expect)(function () {
            (0, jwtDecode_1.jwtDecode)(bad_token);
        }).to.throw();
    });
    it('should throw InvalidTokenErrors when token is null', function () {
        const bad_token = null;
        (0, chai_1.expect)(function () {
            (0, jwtDecode_1.jwtDecode)(bad_token, { header: true });
        }).to.throw('Invalid token specified: must be a string');
    });
    it('should throw error when missing part #1', function () {
        const bad_token = '.FAKE_TOKEN';
        (0, chai_1.expect)(function () {
            (0, jwtDecode_1.jwtDecode)(bad_token, { header: true });
        }).to.throw('Invalid token specified: invalid json for part #1');
    });
    it('should throw error when part #1 is not valid base64', function () {
        const bad_token = 'TOKEN';
        (0, chai_1.expect)(function () {
            (0, jwtDecode_1.jwtDecode)(bad_token, { header: true });
        }).to.throw('Invalid token specified: invalid base64 for part #1');
    });
    it('should throw error when part #1 is not valid JSON', function () {
        const bad_token = 'FAKE.TOKEN';
        (0, chai_1.expect)(function () {
            (0, jwtDecode_1.jwtDecode)(bad_token, { header: true });
        }).to.throw('Invalid token specified: invalid json for part #1');
    });
    it('should throw error when missing part #2', function () {
        const bad_token = 'FAKE_TOKEN';
        (0, chai_1.expect)(function () {
            (0, jwtDecode_1.jwtDecode)(bad_token);
        }).to.throw('Invalid token specified: missing part #2');
    });
    it('should throw error when part #2 is not valid base64', function () {
        const bad_token = 'FAKE.TOKEN';
        (0, chai_1.expect)(function () {
            (0, jwtDecode_1.jwtDecode)(bad_token);
        }).to.throw('Invalid token specified: invalid base64 for part #2');
    });
    it('should throw error when part #2 is not valid JSON', function () {
        const bad_token = 'FAKE.TOKEN2';
        (0, chai_1.expect)(function () {
            (0, jwtDecode_1.jwtDecode)(bad_token);
        }).to.throw('Invalid token specified: invalid json for part #2');
    });
});
