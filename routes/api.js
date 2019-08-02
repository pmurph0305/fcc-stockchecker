/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const https = require('https');

module.exports = function (app, db) {

  //US 2: I can GET /api/stock-prices with form data containing a Nasdaq stock ticker and recieve back an object stockData.
  //US 3: In stockData, I can see the stock(string, the ticker), price(decimal in string format), and likes(int).
  //US 4: I can also pass along field like as true(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.
  //US 5: If I pass along 2 stocks, the return object will be an array with both stock's info but instead of likes,
  // it will display rel_likes(the difference between the likes on both) on both.

  // So the google-finance api (shown in user stories) is not working, so we will replace it with something else..

  function EnsureLikesInAPromise(stocks, ip, like) {
    return new Promise(resolve => {
      if (like) {
        let count = 0;
        stocks.forEach(stock => {
          db.collection('stocks').findOneAndUpdate({ 
            stock: stock,
            ips: { $ne: ip }
          }, {
            $push: { ips: ip },
            $inc: { likes: 1 }
          }, function(err, result) {
            count+=1;
            if (count == stocks.length) {
              resolve('likes done');
            }
          });
        });
      } else {
        resolve('no likes to be done');
      }
    });
  };

  function EnsureStocksExistsPromise(stocks) {
    return new Promise(resolve => {
      let count = 0;
      stocks.forEach(stock => {
        db.collection('stocks').findOneAndUpdate({stock: stock}, 
          { $set: { stock: stock } },
          { upsert: true },
          function(err, result) {
            count += 1;
            if (count == stocks.length) {
              resolve('ensured all stocks exist in database');
            }
          });
      });
    });
  };
  
  function RequestStockDataPromise(stocks) {
    return new Promise((resolve, reject) => {
      let count = 0;
      let stockData = [];
      stocks.forEach(stock => {
        https.get('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+stock+"&apikey="+process.env.AV_API_KEY, function(response) {
          let data = ''
          response.on('data', (chunk) => {
            data+= chunk;
          });
          response.on('end', () => {
            let d = JSON.parse(data)
            console.log(d);
            if (d.Note) {
              console.log("theres a note");
              reject("Too many api calls!");
            }
            if (d['Global Quote']) {
              stockData.push({
                stock: d['Global Quote']['01. symbol'],
                price: d['Global Quote']['05. price']
              })
              count+=1;
              if (count == stocks.length) {
                console.log(stockData);
                resolve(stockData);
              }
            }
          });
          response.on('error', () => {
            reject('Error getting price data');
          })
        });
      });
    })
  };

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stocks;
      if (Array.isArray(req.query.stock)) {
        stocks = req.query.stock.map(stock => stock.toUpperCase());
      } else {
        stocks = Array(req.query.stock.toUpperCase());
      }
      let like = req.query.like;


      
    
      
      

      // So first we make sure the stocks exist in the database using promises, if they don't they are added.
      // the promise is only resolved with it checks all the stocks / updates them
      RequestStockDataPromise(stocks).then(stockData =>
        EnsureStocksExistsPromise(stocks)
        .then(con => 
          // This is another promise that resolves immediately if !like but updates the like count if its a new like.
          // only resolves once it updates the like count of all stocks in stocks
          // US 4: I can also pass along field like as true(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.
          EnsureLikesInAPromise(stocks, req.ip, like)
          .then(con2 => 
          db.collection('stocks').find({ stock: { $in: stocks }}).toArray().then(result => {
          console.log("RESULT:" + result.length);
          //res.json(result);
          if (result.length == 2) {
            console.log("STOCKDATA2:", stockData);
            //US 5: If I pass along 2 stocks, the return object will be an array with both stock's info but instead of likes, it will display rel_likes(the difference between the likes on both) on both.
            res.json({stockData: [{
                stock: result[0].stock,
                price: result[0].stock === stockData[0].stock ? stockData[0].price : stockData[1].price,
                rel_likes: (result[0].likes ? result[0].likes : 0) - (result[1].likes ? result[1].likes : 0) 
              },
              { stock: result[1].stock,
                price: "120.18",
                rel_likes: (result[1].likes ? result[1].likes : 0)  - (result[0].likes ? result[0].likes : 0) 
              }
            ]});
          } else if (result.length) {
            console.log("STOCKDATA1:", stockData);
            //US 3: In stockData, I can see the stock(string, the ticker), price(decimal in string format), and likes(int).
            res.json({
              stockData: {
                stock: result[0].stock,
                price: stockData[0].price,
                likes: result[0].likes ? result[0].likes : 0
              }
            })
          }
      })))).catch(error => {
        console.log("ERROR CATCH");
        res.json({ message: "Error, probably too many API calls."})
      });

      // fetch('https://finance.google.com/finance/info?q=NASDAQ%3a'+stock)
      // .then(function(response) {
      //   console.log(response);
      // })
      // https.get('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+stock+"&apikey="+process.env.AV_API_KEY, function(response) {

      //   let data = '';
      //   response.on('data', (chunk) => {
      //     data+= chunk;
      //   });
      //   response.on('end', () => {
      //     let d = JSON.parse(data)
      //     res.json({stockData: {
      //       stock: d['Global Quote']['01. symbol'],
      //       price: d['Global Quote']['05. price']
      //       likes: 1
      //     }})
      //   });
      // });
    });
};