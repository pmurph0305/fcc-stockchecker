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
      let stock = req.query.stock.toUpperCase();
      let like = req.query.like;
      db.collection('stocks').findOneAndUpdate(
        { stock: stock }, 
        { $inc: { likes: (like ? 1 : 0) } },  
        { upsert: true,
          new: true,
          returnOriginal: false,
        }, 
        function(error, result) {
          if (error) res.json({ message: "Database Error" })
          else {
            // fake response for now so we dont use API
            // US 3: In stockData, I can see the stock(string, the ticker), price(decimal in string format), and likes(int).
            res.json({
              stockData: {
                stock: result.value.stock,
                price: "100.17",
                likes: result.value.likes
              }
            });
          }
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
