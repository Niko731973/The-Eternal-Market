/*
var Listing = function(seller, title, description, price, timeListed, enabled, successes, aborted, disputed) {

   		 this.seller = seller;						// ether address of the seller 
         this.title = title;						// listing title
         this.description = description;     		// sellers description of the listing. may include links to images, other info.
         this.price = price;						//price in wei of the listing
         this.timeListed = timeListed;				// date and time the listing was created
         this.enabled = enabled;					// is the listing active or not
         this.successes = successes;				// # of successful orders
         this.aborted  = aborted;					// # of aborted orders
         this.disputed = disputed;					// # of disputed orders
}

var Order = function(seller,buyer,listingID,shippingDetails,timeTracker,state,feedback,stars,contractAddress){
		this.seller = seller;						// ether address of the seller
	    this.buyer = buyer;							// ether address of the buyer
	    this.listingID = listingID;					// id of the listing the order was created from
	    this.shippingDetails = shippingDetails;		// the shipping address of the buyer, encrypted with the sellers public key
	    this.timeTracker = timeTracker;   			// time the contract was created. if the order has been finished this shows the time feedback was issued instead
	    this.state = state;         		    	// 0 unconfirmed, 1 shipped, 2 successful, 3 disputed, 4 aborted, 5 deadman activated
	    this.feedback = feedback;    				// buyer-submitted feedback on the order
	    this.stars = stars;							// buyer-submitted 1 through 5 star rating system
	    this.contractAddress = contractAddress;     // the contract location which stores the ether
	    

}
*/


//gets the details of one order
export function fetchOrder(id){

}
/*
//returns all the details of a single listing
export function GetListing(id){
var temp = new Listing("seller"," title"," description"," price"," timeListed"," enabled"," successes"," aborted"," disputed");
return temp; 

}
*/
//returns the short form info for all active listings, used on the buy page
export function ShortListings(){
var listings = [];
var a = {rating:"rating",price:"price1",title:"title1",successes:"successfulListings"};
var b = {rating:"rat22ing",price:"pr22ice1",title:"tit22le1",successes:"successfulListings2"};
listings.push(a);
listings.push(b);
listings.push(b);
return listings; 

}

/*
//returns the database with all of the user (sellers) active orders
export function getSellerOrders(userAddress){
var Orders = {};
Orders[1] = new Order("seller","buyer","listingID","shippingDetails","timeTracker","state","feedback","stars","contractAddress");
return Orders;
}


//returns all of the user (buyers) active orders
export function getBuyerOrders(buyerAddress){
var Orders = {};
Orders[1] = new Order("seller","buyer","listingID","shippingDetails","timeTracker","state","feedback","stars","contractAddress");
return Orders;
}

//gets the feedback for a single listing
export function feedback(id){

}
*/