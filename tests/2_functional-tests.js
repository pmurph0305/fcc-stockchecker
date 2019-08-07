/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
        this.timeout(4000);
        chai.request(server)
          .get('/api/stock-prices')
          .query({ stock: 'goog' })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.stockData.stock, "GOOG");
            assert.isString(res.body.stockData.stock);
            assert.isString(res.body.stockData.price);
            assert.isNumber(Number(res.body.stockData.price));
            assert.isNumber(res.body.stockData.likes);
            done();
          });
      });
      
      var fakeStock = 'GOOG'
      test('1 stock with like', function(done) {
        this.timeout(4000);
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: fakeStock, like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, fakeStock);
          assert.isString(res.body.stockData.stock);
          assert.isString(res.body.stockData.price);
          assert.isNumber(Number(res.body.stockData.price));
          assert.isNumber(res.body.stockData.likes);
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        this.timeout(4000);
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: fakeStock, like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, fakeStock);
          assert.isString(res.body.stockData.stock);
          assert.isString(res.body.stockData.price);
          assert.isNumber(Number(res.body.stockData.price));
          assert.isNumber(res.body.stockData.likes);
          assert.equal(res.body.stockData.likes, 1);
          done();
        });
      });
      
      test('2 stocks', function(done) {
        this.timeout(4000);
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['GOOG','MSFT'] })
        .end(function(err, res) {
          console.log(res.body.stockData);
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 2);
          assert.isString(res.body.stockData[0].stock);
          assert.isString(res.body.stockData[1].stock);
          assert.isString(res.body.stockData[0].price);
          assert.isString(res.body.stockData[1].price);
          assert.isNumber(Number(res.body.stockData[0].price));
          assert.isNumber(Number(res.body.stockData[1].price));
          assert.isNumber(res.body.stockData[0].rel_likes);
          assert.isNumber(res.body.stockData[1].rel_likes);
          done();
        });
      });
      

      test('2 stocks with like', function(done) {
          this.timeout(4000);
          let fakestock1 = 'GOOG'
          let fakestock2 = 'MSFT'
          chai.request(server)
          .get('/api/stock-prices')
          .query({ stock: [fakestock1, fakestock2], like: true })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.stockData);
            assert.equal(res.body.stockData.length, 2);
            assert.isString(res.body.stockData[0].stock);
            assert.isString(res.body.stockData[1].stock);
            assert.isString(res.body.stockData[0].price);
            assert.isString(res.body.stockData[1].price);
            assert.isNumber(Number(res.body.stockData[0].price));
            assert.isNumber(Number(res.body.stockData[1].price));
            assert.isNumber(res.body.stockData[0].rel_likes);
            assert.isNumber(res.body.stockData[1].rel_likes);
            assert.equal(res.body.stockData[0].rel_likes, 0);
            assert.equal(res.body.stockData[1].rel_likes, 0);
            done();
          });        
      });
    });
});
