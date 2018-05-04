var express = require('express');
var axios = require('axios');
var router = express.Router();
var ip = require('../config/ip.js');

activeBackend = 1;

postPaths = [
  '/login',
  '/creategroup',
  '/joingroup',
  '/leavegroup',
  '/send/message'
];

getPaths = [
  '/group',
  '/user',
  '/findgroup'
];


postPaths.map(path => {
  console.log(path);
  router.post(path, function (req, res, next) {
    // ACTIVE PRIMARY BACKEND
    console.log("IN");
	console.log(req.body)
	var data = req.body;
    axios.post(ip.primaryBackend + path, req.body)
      .then(function (response) {
        // console.log("get from server");
        if (activeBackend === 2) {
          console.log("primary backend is back and taking over the system");
          activeBackend = 1;
        }
        else{
          console.log("primary backend is working");
        }
		console.log(path)
        
        // res.send(response.data);
      })
      .catch(function (err) {

        // ACTIVE SECONDARY BACKEND
        console.log("postpath error");
        axios.post(ip.secondaryBackend + path, req.body)
          .then(function (response) {
            if (activeBackend === 1) {
              console.log("primary backend is inactived");
              console.log("secondary backend is taking over the system");
              activeBackend = 2;
            }
            else{
              console.log("secondary backend is working");
            }
          })
          .catch(function (err) {
            console.error(err);
            res.send('ERROR');
          });
      });
  });
});

getPaths.map(path => {
  console.log("GET:",path);
  router.get(path, function (req, res, next) {
    // ACTIVE PRIMARY BACKEND
    console.log('nottyking', req.query);
    console.log(ip.primaryBackend + path + "?params=" + a);
    var a = req.query.params;
    axios.get(ip.primaryBackend + path + "?params=" + a)
      .then(function (response) {
        if (activeBackend === 2) {
          console.log("primary backend is back and taking over the system");
          activeBackend = 1;
        }
        else{
          console.log("primary backend is working");
        }
        res.send(response.data);
      })
      .catch(function (err) {
        console.log(err);
        // ACTIVE SECONDARY BACKEND
        axios.get(ip.secondaryBackend + path, {params: req.query})
          .then(function (response) {
            if (activeBackend === 1) {
              console.log("primary backend is inactived");
              console.log("secondary backend is taking over the system");
              activeBackend = 2;
            }
            else{
              console.log("secondary backend is working");
            }
            res.send(response.data);
          })
          .catch(function (err) {
            console.error(err);
            res.send('ERROR');
          });
      });
  });
});

module.exports = router;
