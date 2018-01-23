var PriceOracle = artifacts.require("PriceOracle");
var Market = artifacts.require("Market");
var Base = artifacts.require("Base");

var PriceOracleAddress, MarketAddress, BaseAddress;

module.exports = function(deployer) {
    
    
// Deploy the price oracle, set a starting price, record the address of the oracle contract
    
var p, m, b;

PriceOracle.deployed().then(function (instance){
    p = instance;
    return p.setPrice(12345);})
.then(function (result){
console.log(result);
 //deployer.link(PriceOracle,Market); 
   return p.read();})

.then(function (val){    

return console.log("price is now: "+val);})
.then(function (){
  return Market.deployed();  })

.then(function (instance){
    m = instance;
    return m.changeOracleAddress(p.address); })

.then(function (){
    
    return m.oracleAddress.call(); })


.then(function (result){
    
    return console.log("set oracle address to: "+result); })
        
.then(function(){
    return m.updatePrice(); })
        
.then(function(){
  return m.eth_price.call(); })

.then(function(result){

  return console.log("new eth price in market is: "+result); })

.then(function(){
  return Base.deployed(); })

        
.then(function(instance){
  b = instance;
  console.log(m.address);
  return b.changeMarketAddress(m.address); })

.then(function(){

console.log("Success");
});
    

}