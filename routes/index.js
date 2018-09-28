var express = require("express");
var router = express.Router();
var Q = require("q");
var metadata = require("node-ec2-metadata");
var os = require('os');
const cores = parseInt(os.cpus().length);

var isAWS = process.env.HOSTNAME ? process.env.HOSTNAME.endsWith('.compute.internal') : false;
console.log('isAWS', isAWS);
/* GET home page. */
router.get("/", function (req, res, next) {
  if (isAWS) {
    Q.all([
      metadata.getMetadataForInstance("ami-id"),
      metadata.getMetadataForInstance("public-ipv4"),
      metadata.getMetadataForInstance("placement/availability-zone"),
      metadata.getMetadataForInstance("instance-id"),
      metadata.getMetadataForInstance("instance-type"),
      metadata.getMetadataForInstance("hostname")
    ])
      .spread(function (amiID, ipv4, az, instanceId, instanceType, hostname) {
        const data = {
          cores,
          amiID,
          ipv4,
          az,
          instanceId,
          instanceType,
          hostname
        };
        res.render("index", data);
      })
      .fail(function (error) {
        console.log("Error: " + error);
      });
  } else {
    const data = {
      cores,
      amiID: "13.57.230.27",
      ipv4: "13.57.31.141",
      az: "us-west-1b",
      instanceId: "i-04d5ced80e4dd0bdf",
      instanceType: "m5.2xlarge",
      hostname: "ip-172-31-21-19.us-west-1.compute.internal"
    };
    res.render("index", data);
  }
});

module.exports = router;
