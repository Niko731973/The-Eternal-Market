var PriceOracle = artifacts.require("PriceOracle");
var Market = artifacts.require("Market");
var Base = artifacts.require("Base");

module.exports = function(callback){
    
    
// Deploy the price oracle, set a starting price, record the address of the oracle contract
var m, b, p;
var newprice = 12345;
PriceOracle.new().then(function (instance){
    p = instance;
    return instance.setPrice(newprice);})
.then(function (result){
console.log("Sent Price of "+newprice+ " to the oracle");
 //deployer.link(PriceOracle,Market); 
   return p.read();})

.then(function (val){    

return console.log("Oracle price is now: "+val);})
.then(function (){
  return Market.new();  })

.then(function (instance){
m = instance;
    return instance.changeOracleAddress(PriceOracle.address); })

.then(function (){
    console.log("setting market address to: "+ PriceOracle.address);
    return m.oracleAddress.call(); })


.then(function (result){
    
    return console.log("market has oracle address of: "+result); })
        
.then(function(){
    console.log("updating price...");
    return m.updatePrice(); })
        
.then(function(){
  return m.eth_price.call(); })

.then(function(result){

  return console.log("new eth price in market is: "+web3.toDecimal(result)); })

.then(function(){
  return Base.new(); })

        
.then(function(instance){
  b = instance;
  console.log("setting market address to: "+ m.address);
  return instance.changeMarketAddress(m.address); })

.then(function(){
return b.market.call(); })

.then (function(result){
console.log("market address recorded as: "+result);
console.log("Done");
});
    

}