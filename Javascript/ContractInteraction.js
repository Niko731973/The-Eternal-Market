//creates a new order transaction on the blockchain
function new_order(listing_id,cost,delivery_address)
{  
	web3.eth.defaultAccount = accounts[0];
	var result = EV.addOrder(listing_id, delivery_address, {value: cost});
}

//if the listings ratio of disputed transactions is too high, anyone may remove the listing
function is_bad_seller(listing_id){
    return EV.isBadListing(EV.database.getListing(listing_id));
}

function confirmShipment(order_id){
	var conf = confirm("Have you shipped this order?");
	if(conf==true){ 
		web3.eth.defaultAccount = accounts[0];
		EV.confirmShipment(order_id);
		alert("Please allow a few minutes for your confirmation to propagate.");
		
	}
}


function confirmDelivery(order_id){
    var conf = confirm("Have you received your order?");
	if(conf==true){ 
		web3.eth.defaultAccount = accounts[0];
		EV.confirmDelivery(order_id);
		alert("Please allow a few minutes for your confirmation to propagate.");
	}
    
}

function disputeOrder(order_id){
    var conf = confirm("Disputing this order will prevent the seller from recieving their payment. Would you like to dispute this transaction?"); 
	if(conf==true){ 
		web3.eth.defaultAccount = accounts[0];
		EV.disputeOrder(order_id);
		alert("Please allow a few minutes for your dispute to propagate.");
	}
}

function abortOrder(order_id){
	var conf = confirm("Would you like to cancel this order?");
	if(conf==true){ 
		web3.eth.defaultAccount = accounts[0];
		EV.abortOrder(order_id);
		alert("Please allow a few minutes for your cancelation to propagate.");
	}
}

function computeListingFee(original_price){
    return EV.getListingFee(original_price);
}


//designate a listing as "inactive", cannot be reversed. called from the listing page by either
//the seller of the listing, or any user if the listing has too many disputed sales
function removeListing(id){
web3.eth.defaultAccount = accounts[0];
var result = EV.removeListing(id);
document.getElementById("button_result").innerHTML = 'Listing Successfully Removed! Please wait a few minutes for the blockchain to confirm.';

}
