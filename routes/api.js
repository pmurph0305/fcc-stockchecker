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
  // So the google-finance api (shown in user stories) is not working, so we will replace it with something else..
  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.query.stock;
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

      // fake response for now so we dont use API
      res.json({
        stockData: {
          stock: stock.toUpperCase(),
          price: 100,
        }
      })
    });

    
};
