var express = require('express');
var router = express.Router();
var Q = require('q');
var metadata = require('node-ec2-metadata');

var isAWS = false;
/* GET home page. */
router.get('/', function (req, res, next) {
  if (isAWS) {
    Q.all([
      metadata.getMetadataForInstance('ami-id'),
      metadata.getMetadataForInstance('public-ipv4'),
      metadata.getMetadataForInstance('placement/availability-zone'),
      metadata.getMetadataForInstance('instance-id'),
      metadata.getMetadataForInstance('mac'),
    ])
      .spread(function (amiID, ipv4, az, instanceId) {
        const data = {
          amiID,
          ipv4,
          az,
          instanceId
        };
        res.render('index', data);
      })
      .fail(function (error) {
        console.log("Error: " + error);
      });
  } else {
    const data = {
      amiID: 'i-04d5ced80e4dd0bdf',
      ipv4: '13.57.31.141',
      az: 'us-west-1b',
      instanceId: 'ami-0782017a917e973e7'
    };
    res.render('index', data);
  }

});

module.exports = router;
