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
    console.log("sending to "+instance+" with title : " + title +" description: "+description+" price: "+price+" from: "+fromacct+" and sending "+web3.fromWei(sendvalue)+"ETH");
    console.log("");
    
    return instance.addListing.sendTransaction(title,description,price,{
            from: fromacct,
            gas:4000000,
            value: sendvalue},
            function (error, result){ //get callback from function which is your transaction key
                if(!error){
                    resolve(result);
                } else{
                    reject(error);
                }
        }
        );

}

module.exports = function(deployer, accounts){
    
    
// Deploy the price oracle, set a starting price, record the address of the oracle contract
var m = Market.address;
var b = Base.address;
var p = PriceOracle.address;
    
var newprice = 12345; //price of eth at beginning in cents
var listing_fee = 500;      // Fee in cents to create a listing
var order_fee = 200;  
    
deployer.then(function (){
    return Market.at(m);
     }).then( instance => {
    
    console.log("adding listing 1");
    var i = listingsToAdd[0];
    
    var listingUSD = listing_fee/100;
    console.log("fee is $"+listingUSD+"")
    var usdeth = newprice/100;
    console.log("1 eth costs $"+usdeth);
    var listing_fee_eth = listingUSD/usdeth;
    
    console.log("sending fee of: "+web3.toWei(listing_fee_eth) + " wei, or "+listing_fee_eth.toFixed(8)+" ETH");
    
    return myaddlisting(instance,i.title,i.description,i.price, accounts[0] , web3.toWei(listing_fee_eth));
    
    
 }).then( result => {
    console.log(result);
    return console.log("done");
    
 }).catch(error => {
    console.log(error);
});
         
}
