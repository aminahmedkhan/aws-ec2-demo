var express = require('express');
var router = express.Router();
var Q = require('q');
var metadata = require('node-ec2-metadata');

/* GET home page. */
router.get('/', function (req, res, next) {
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
});

module.exports = router;
