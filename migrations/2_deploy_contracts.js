var PriceOracle = artifacts.require("PriceOracle");
var Market = artifacts.require("Market");
var Base = artifacts.require("Base");

module.exports = function(deployer) {
  deployer.deploy(PriceOracle);
};
module.exports = function(deployer) {
deployer.deploy(Market);
};
module.exports = function(deployer) {
  deployer.deploy(Base);
};