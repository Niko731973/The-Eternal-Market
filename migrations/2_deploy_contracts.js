var PriceOracle = artifacts.require("PriceOracle");
var Market = artifacts.require("Market");
var Base = artifacts.require("Base");

var PriceOracleAddress, MarketAddress, BaseAddress;

module.exports = function(deployer) {
    
    
// Deploy the price oracle, set a starting price, record the address of the oracle contract
    
deployer.deploy(PriceOracle);
PriceOracle.deployed().then(function (instance){

    instance.setPrice(123411);
                                
});

deployer.link(PriceOracle, Market);

deployer.deploy(Market);
    
Market.deployed().then(function (instance){
    
    instance.changeOracleAddress(PriceOracle.address);
    return instance;
    
    
}).then(function(instance){
    
    instance.updatePrice();
});
                             
deployer.deploy(Base);

Base.deployed().then(function(instance){
    instance.changeMarketAddress(Market.address);
});
    
    /*
    PriceOracle.deployed().setPrice(123411);
    PriceOracleAddress = PriceOracle.address;
    
    

    
deployer.link(PriceOracle, Market);


deployer.then(function(instance){
      return Market.new();
  
  }).then(function(instance){
      instance.changeOracleAddress(PriceOracleAddress);
    
      MarketAddress = instance.address;
      return instance;
  }).then(function(instance){
    
    instance.updatePrice();
});
    
    
    
deployer.then(function(instance){
      return Base.new();
  
  }).then(function(instance){
      
    instance.changeMarketAddress(MarketAddress);
    BaseAddress = instance.address;
  });
    



*/
    
}