//creates a new order 
newOrder = function newOrder(listing_id,delivery_address){  				
	var price = ListingsDB.findOne({listingID : Number(listing_id)}).price;
    
	var conf = confirm("Please confirm that you have encrypted your delivery address!"); 
	if(conf==true){ 
		if(web3.eth.accounts.length==0){
			confirm("You must have an ethereum address connected to create a listing!");
		}
		else{
			web3.eth.defaultAccount = web3.eth.accounts[0];
			EM.addOrder(listing_id, delivery_address, {value: price});
		}
	}
}

//create new listing
newListing = function newListing(title,description,public_key,price,fee){
	price = web3.toWei(price,"ether");
	fee = web3.toWei(fee, "ether");
    var conf = confirm("Please confirm the information for your listing is correct! Then select OK");
	if(conf){
		web3.eth.defaultAccount = web3.eth.accounts[0];
    	EM.addListing(title,description,public_key,price, {value:fee});
	}
}

//if the listings ratio of disputed transactions is too high, anyone may remove the listing
is_bad_seller = function is_bad_seller(listing_id){
	return EM.isBadListing(DB.getListing(listing_id));
}

//sell confirms shipment of an order
confirmShipment = function confirmShipment(order_id){
	var conf = confirm("Have you shipped this order?");
	if(conf==true){ 
		web3.eth.defaultAccount = web3.eth.accounts[0];
		var order_address = EM.orders(order_id);
		var order = order_contract.at(order_address);
		order.confirmShippment();
	}
}


confirmDelivery = function confirmDelivery(order_id){
    var feedback = feedbackPrompt();
		if(feedback!="")
		{
		web3.eth.defaultAccount = web3.eth.accounts[0];
		var order_address = EM.orders(order_id);
		var order = order_contract.at(order_address);
		order.confirmDelivery(feedback);
		}
	
}

disputeOrder = function disputeOrder(order_id){
    	var feedback = feedbackPrompt();
		if(feedback!="")
		{
		web3.eth.defaultAccount = web3.eth.accounts[0];
		var order_address = EM.orders(order_id);
		var order = order_contract.at(order_address);
		order.dispute(feedback);
				}
}

abortOrder = function abortOrder(order_id){
	var conf = confirm("Would you like to cancel this order?");
	if(conf==true){ 
		web3.eth.defaultAccount = web3.eth.accounts[0];
				var order_address = EM.orders(order_id);
		var order = order_contract.at(order_address);
		order.abort(order_id);
		}
}

//given a price in ether, returns the fee in ether
computeListingFee = function computeListingFee(ether_price){
	var wei_price = web3.toWei(ether_price, "ether");
	var wei_fee = EM.getListingFee(wei_price);
    return web3.fromWei(wei_fee, "ether");
}

//used to set the fee dynamically on the new listing page
setListingFeeDynamic = function(n) {
			var price_box = document.getElementById('price');
			var fee_box = document.getElementById('fee');
   			var fee = computeListingFee(Number(price_box.value));
   			fee_box.value = fee;
}			

removeListing = function removeListing(id){
	var conf = confirm("Are you sure you would like to remove this listing?");
	if(conf==true){
		web3.eth.defaultAccount = web3.eth.accounts[0];
		var result = EM.removeListing(id);
		//alert('Listing Successfully Removed! Please wait a few minutes for the blockchain to confirm.');
	}
}

//gets the percentage as a decimal of voting results
getVotingResults = function(id){
var results = CM.currentVotingResults(id);
var yes = Number(results[0]);
var oustanding = Number(results[1]);
if(yes==0){ return 0;}
return yes/outstanding;
}

//creates a proposal to remove a listing from the market
flagListing = function flagListing(id){
	var conf = confirm("Would you like to submit a proposal to have this listing removed?");
	if(conf==true){
		web3.eth.defaultAccount = web3.eth.accounts[0];
		var title = ListingsDB.findOne({listingID : Number(id)}).title;
		CM.propose(1, "remove listing: "+title, '0x0000000000000000000000000000000000000000' , Number(id));
		
	}
}

//executes a proposal
executeProposal = function(id){
web3.eth.defaultAccount= web3.eth.accounts[0];
CM.executeProposal(id);
}
//shows an error if a proposal by a non-shareholder is made to remove a listing
flagListingButtonNotAShareHolder = function (){
	confirm("You must be a shareholder to propose that a listing is removed!");
}

//seller can change the price of a listing
changeListingPrice = function(id,newPrice,oldPrice){
	var cost = 0;
	oldPrice = web3.fromWei(oldPrice,"ether");
	var conf = false;
	if(newPrice>oldPrice){
	 cost = computeListingFee(newPrice - oldPrice);
	 	conf = confirm("There is a cost of "+cost+" ether to change the price of this listing. Do you wish to proceed?");
	}
	else{
		 conf = confirm("Are you sure you wish to change the price of this listing?");
	}
	if(conf==true){
	web3.eth.defaultAccount = web3.eth.accounts[0];
	var weiFee = Number(web3.toWei(cost,"ether"));
	var weiNewPrice = Number(web3.toWei(newPrice,"ether"));
	EM.changePrice(id,weiNewPrice,{value: weiFee});
	}
}

//anyone on the blockchain can purchase shares
buyShares = function(value){
	var conf = confirm("You are purchasing "+value+" ether worth of shares");
	if(conf){
		web3.eth.defaultAccount = web3.eth.accounts[0];
		
			CM.buy({value:Number( web3.toWei(value,"ether"))});
	}
}

//shares can be sold after the ICO is finished
sellShares = function(shares){
var conf = confirm("You are selling "+shares+" shares");
	if(conf){
		web3.eth.defaultAccount = web3.eth.accounts[0];
		if(CM.ICO_enabled()){
			confirm("You may sell shares as soon as the ICO period has ended");
		}else{
	CM.sell(shares);
	}}
}

//sets the cost to buy shares dynamically on the community page
setCostToBuyDynamic = function (shares, price){
	var fee = shares*price;
	var fee_box = document.getElementById('costToBuyShares');
	fee_box.value = fee;
}

//sets the sell price dynamically on the community page
setSellBoxDynamic = function (shares,price){
	var fee = shares*price;
	var fee_box = document.getElementById('profitFromShareSales');
	fee_box.value = fee;
}

//vote yes on a proposal 
voteYes = function(id){
	var conf = confirm("Do you wish to approve this proposal?");
	if(conf){
			web3.eth.defaultAccount = web3.eth.accounts[0];
	CM.voteYes(id);
	}
}

function feedbackPrompt(){
var feedback = prompt("Please enter feedback for your order", "Great seller, great product! -or- Never arrived!");

if (feedback == null || feedback == "") {
    return "";
} else {
    return feedback;
}

}

//remove this
function showConfirmationOrError(){
	//confirm("please allow a few minutes for your transaction to be confirmed by the blockchain");
}