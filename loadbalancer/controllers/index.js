var express = require('express');
var axios = require('axios');
var router = express.Router();
var ip = require('../config/ip.js');

activeBackend = 1;

postPaths = [
  '/login',
  // '/createGroup',
  // '/joinGroup',
  // '/leaveGroup',
  // '/sendMessage',
  // '/setReadAt',
];

getPaths = [
  // '/getUserInfo',
  // '/getAllGroup',
  // '/getAllMessage',
  // '/getUnreadMessage',
  // '/viewUnreadMessages',
];

postPaths.map(path => {
  console.log(path);
  router.post(path, function (req, res, next) {
    // ACTIVE PRIMARY BACKEND
    console.log("IN");
    axios.post(ip.primaryBackend + path, req.body)
      .then(function (response) {
        console.log("get from server");
        if (activeBackend === 2) {
          console.log("primary backend is back and taking over the system");
          activeBackend = 1;
        }
        if (path === '/sendMessage') io.emit('chat', { message: response.data.message });
        res.send(response.data);
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
            if (path === '/sendMessage') io.emit('chat', { message: response.data.message });
            res.send(response.data);
          })
          .catch(function (err) {
            console.error(err);
            res.send('ERROR');
          });
      });
  });
});

getPaths.map(path => {
  router.get(path, function (req, res, next) {
    // ACTIVE PRIMARY BACKEND
    console.log('fm', req.query);
    axios.get(ip.primaryBackend + path, { params: req.query} )
      .then(function (response) {
        if (activeBackend === 2) {
          console.log("primary backend is back and taking over the system");
          activeBackend = 1;
        }
        res.send(response.data);
      })
      .catch(function (err) {

        // ACTIVE SECONDARY BACKEND
        axios.get(ip.secondaryBackend + path, req.query)
          .then(function (response) {
            if (activeBackend === 1) {
              console.log("primary backend is inactived");
              console.log("secondary backend is taking over the system");
              activeBackend = 2;
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
