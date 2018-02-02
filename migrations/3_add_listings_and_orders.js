var PriceOracle = artifacts.require("PriceOracle");
var Market = artifacts.require("Market");
var Base = artifacts.require("Base"); 

var listingsToAdd = [{title:"First Listing",
                    description: "Here is an example description 111", 
                    price: 2550}, //price in cents USD

                    {title:"Second Listing",
                    description: "Here is an example description 222", 
                    price: 133711}]; //price in cents USD

var ordersToAdd = [{id:1, deliveryInfo:"my encrypted address"}];

function myaddlisting (instance, title, description, price, fromacct , sendvalue){
    return instance.addListing(title,description,price,{
            from: fromacct,
            gas:4000000,
            value: sendvalue});
}

function addmyorder (instance, id, delivery, fromacct, sendvalue){
    
    return instance.addOrder(id,delivery,{
            from: fromacct,
            gas:4000000,
            value: sendvalue});
}


module.exports = function(deployer, network, accounts){
    
    
// Deploy the price oracle, set a starting price, record the address of the oracle contract
var m = Market.address;
var b = Base.address;
var p = PriceOracle.address;
    
var marketInstance;
    
var newprice = 12345; //price of eth at beginning in cents
var listing_fee = 500;      // Fee in cents to create a listing
var order_fee = 200;  
    
deployer.then(function (){
    
    return Market.at(m);
    
     }).then( instance => {
    
    marketInstance = instance;
    console.log("adding listing 1...");
    
    var i = listingsToAdd[0];
    var thisFee = web3.toWei((listing_fee/100)/(newprice/100));
    
    
    return myaddlisting(marketInstance,i.title,i.description,i.price, accounts[0] , thisFee);
    
    
 }).then( result => {
    console.log("Listing 1 Added Successfully");
    console.log("adding listing 2...");
    
    var i = listingsToAdd[1];
    var thisFee = web3.toWei((listing_fee/100)/(newprice/100));
    return myaddlisting(marketInstance,i.title,i.description,i.price, accounts[1] , thisFee);
    
 }).then( result => {
    console.log("Listing 2 Added Successfully");
    console.log("adding order to listing 1")
    
    var myprice = order_fee+listingsToAdd[0].price;
    var thisFee = web3.toWei((listing_fee/100)/(newprice/100));
    return addmyorder(marketInstance,1,"my address here",accounts[1],thisFee);
    
 }).then( result => {
    console.log("Order 1 for listing 1 added Successfully");
    console.log("adding order to listing 2")
    
    var myprice = order_fee+listingsToAdd[1].price;
    var thisFee = web3.toWei((listing_fee/100)/(newprice/100));
    return addmyorder(marketInstance,2,"my address here",accounts[0],thisFee);
    
 }).then( result => {
    return console.log("Order 2 for listing 2 added Successfully");
    
    
 }).catch(error => {
    console.log(error);
});
         
}
