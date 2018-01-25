var PriceOracle = artifacts.require("PriceOracle");
var Market = artifacts.require("Market");
var Base = artifacts.require("Base"); 

module.exports = function(deployer){
    
    
// Deploy the price oracle, set a starting price, record the address of the oracle contract
var m, b, p;
var newprice = 12345;
    
deployer.then(function (){
    return deployer.deploy(PriceOracle);
    
 }).then( function (){
    p = PriceOracle.address;
    console.log("Deployed PriceOracle at address: "+p)
    return PriceOracle.at(p).setPrice(newprice);
    
 }).then( function (result){
    
console.log("Sent Price of "+newprice+ " to the oracle");
 //deployer.link(PriceOracle,Market); 
   return PriceOracle.at(p).read.call();

 }).then( function (val){   

return console.log("Oracle price is now: "+val);
    
 }).then( function (){
    
  return deployer.deploy(Market);  

 }).then( function (){
    
    m = Market.address;
    console.log("Deployed Market at address: "+m)
    return Market.at(m).changeOracleAddress(p); 

 }).then( function (){
    
    console.log("setting market address to: "+ p);
    return Market.at(m).oracleAddress.call(); 


 }).then( function (result){
    
    return console.log("market has oracle address of: "+result); 
        
 }).then( function (){
    
    console.log("updating price...");
    return Market.at(m).updatePrice(); 
        
 }).then( function (){
    
  return Market.at(m).eth_price.call(); 

 }).then( function (result){
  var theprice = web3.toDecimal(result);
  theprice = web3.fromWei(theprice);
  return console.log("new eth price in market is: "+theprice); 

 }).then( function (){
    
  return deployer.deploy(Base); 

 }).then( function (){
    
  b = Base.address;
  console.log("Deployed Base at address: "+b)
  console.log("setting market address to: "+ m);
  return Base.at(b).changeMarketAddress(m); 

 }).then( function (){    
    
    return Base.at(b).market.call(); 

 }).then(function (result){
    
    console.log("market address recorded as: "+result);
    return console.log("Done");
    
});
         
         }
