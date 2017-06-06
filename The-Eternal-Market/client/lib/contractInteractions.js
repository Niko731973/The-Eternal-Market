//creates a new order transaction on the blockchain
newOrder = function newOrder(listing_id,delivery_address){  				
	var temp = ListingsDB.findOne({listingID : Number(listing_id)});
    var price = web3.toWei(temp.price, "ether");
	var conf = confirm("Please confirm that you have encrypted your delivery address!"); 
	if(conf==true){ 
		//Once your transaction is confirmed, it will take a few minutes to propagate through the blockchain!<br>Once your transaction has been confirmed by the blockchain, you can check the status of your order under the "My Orders" menu.
		web3.eth.defaultAccount = web3.eth.accounts[0];
		EV.addOrder(listing_id, delivery_address, {value: price});
		showConfirmationOrError();
	}
}

//create new listing
newListing = function newListing(title,description,public_key,price,fee){
	console.log(title,description,public_key,price,fee);
	fee = web3.toWei(fee, "ether");
    var conf = confirm("Please confirm the information for your listing is correct! You cannot modify the listing once it has been submitted!");
	if(conf){
		web3.eth.defaultAccount = web3.eth.accounts[0];
		
    	EV.addListing(title,description,public_key,price, {value:fee});
	}
}

//if the listings ratio of disputed transactions is too high, anyone may remove the listing
is_bad_seller = function is_bad_seller(listing_id){
    return EV.isBadListing(DB.getListing(listing_id));
}

confirmShipment = function confirmShipment(order_id){
	var conf = confirm("Have you shipped this order?");
	if(conf==true){ 
		web3.eth.defaultAccount = web3.eth.accounts[0];
		var result = EV.confirmShipment(order_id);
		showConfirmationOrError();
	}
}


confirmDelivery = function confirmDelivery(order_id){
    var conf = confirm("Have you received your order?");
	if(conf==true){ 
		web3.eth.defaultAccount = web3.eth.accounts[0];
		var result = EV.confirmDelivery(order_id);
		//alert("Please allow a few minutes for your confirmation to propagate.");
	}
}

disputeOrder = function disputeOrder(order_id){
    var conf = confirm("Disputing this order will prevent the seller from recieving their payment. Would you like to dispute this transaction?"); 
	if(conf==true){ 
		web3.eth.defaultAccount = web3.eth.accounts[0];
		EV.disputeOrder(order_id);
		alert("Please allow a few minutes for your dispute to propagate.");
	}
}

abortOrder = function abortOrder(order_id){
	var conf = confirm("Would you like to cancel this order?");
	if(conf==true){ 
		web3.eth.defaultAccount = web3.eth.accounts[0];
		EV.abortOrder(order_id);
		alert("Please allow a few minutes for your cancelation to propagate.");
	}
}

computeListingFee = function computeListingFee(original_price){
    return EV.getListingFee(original_price);
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
		var result = EV.removeListing(id);
		//alert('Listing Successfully Removed! Please wait a few minutes for the blockchain to confirm.');
	}
}

flagListing = function flagListing(id){
	confirm("blerg");
}


function showConfirmationOrError(){
	//confirm("please allow a few minutes for your transaction to be confirmed by the blockchain");
}