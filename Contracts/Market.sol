pragma solidity ^0.4.2;
import "Order.sol";
import "Base.sol";

contract Market {

	/* The Eternal Address of the Market */
    address eternalAddress;

    
    /*Contract Variables and Events*/
       
    uint public listing_rate = 5;          			// Listing rate is a fee charged for each new listing as a percent (ie 12% charge would be 12)
    uint public order_rate = 2;                     // Order rate is a fee charged on each order submitted as a percent( ie 2% charge would be 2)
    uint public bad_seller_threshold = 15;          //If a listing has more than this amount (as a percentage) of disputed sales, any user can remove this listing.
    uint public nextFreeListingID = 1;		           //the next free listing ID availible
    uint public nextFreeOrderID = 1;       //the next free order ID availible
    mapping (uint => Listing) public listings;
    mapping (uint => address) public orders;

    /* Structures representing a listing and an order */
    struct Listing {
    
        address seller;
        string title;
        string listingDescription;
        string publicKey;					//public key of the seller used to encrypt shipping addresses for orders
        uint price;
        uint timeListed;
        bool enabled;
    }
    
    function Market(address _eternal){
    eternalAddress = _eternal;
    }
    
    /* Returns the current address of the community contract */
    function getCommunity() constant returns (address){
    	Base b = Base(eternalAddress);
    	return b.community();
    }

    /* Used to find only listings with a valid index (not out of bounds or disabled) */
    modifier onlyValidListings(uint id) { 
        if(id<1 || id>= nextFreeListingID){throw;}
	_;
    }
    
    /* Used to find only orders with a valid index (not out of bounds) */
    modifier onlyValidOrders(uint id){
        if(id<1 || id>= nextFreeOrderID){throw;}
        _;
    }
    
    /* only the community can execute some functions (via a proposal which is voted on and executed) */
    modifier onlyCommunity() {
    	if (msg.sender!=getCommunity()){ throw;}
		_;
    }
    
    
    /*Constant Functions*/
    
    // Compute the fee paid by the buyer for each order that is submitted
    function buildOrderFee(uint price) public constant returns(uint){
        //returns the fee charged for an order
        return (price*order_rate)/100;
    }
    
    // Compute the fee charged to the seller when a new listing is created
    function getListingFee(uint price) public constant returns(uint){
        return (price*listing_rate)/100;
    }
    //returns successful, disputed, aborted listings
    function getStats(uint _id) constant onlyValidListings(_id) returns(uint, uint, uint){
    	address seller = listings[_id].seller;
		
		//figures out if a listing is bad
		uint sales_disputed = 0;
		uint sales_successful = 0;
		uint sales_aborted = 0;
		for(uint i = 1;i<nextFreeOrderID;i++){
			if(orders[i]==seller){
				uint state = Order(orders[i]).getState();
				if(state == 2) {sales_successful++;}
				else if(state == 3){sales_disputed++;}
				else if(state == 4){sales_aborted++;}
			}
		}
        
    return(sales_successful, sales_disputed, sales_aborted);
    }
    
    // Determines if a listing is below the threshold to be considered for purging
    function isBadListing(uint _id) constant onlyValidListings(_id) returns(bool){
		var (succ, disp,) = getStats(_id);
		
        uint listing_bad_rate = (disp*100)/(disp+succ);
        return listing_bad_rate>=bad_seller_threshold;
    }
    
    /* Order and Listing functions*/
    
    //buyers place orders for a listing using this function
    function addOrder (uint index, string shippingAddress) payable onlyValidListings(index) returns(bool){
        Listing listing = listings[index];
        
        //calculate the fee for the order
        uint fee = buildOrderFee(listing.price);
        
        //you can only order if you paid enough money, and if the listing is enabled
        if(msg.value < listing.price || !(listing.enabled)){ throw;}	

        //create a purchase contract for the order. keep the fee, transfer the remainder to the contract
        address orderAddress = (new Order).value(msg.value-fee)(msg.sender,listing.seller,index,shippingAddress,this);
        orders[nextFreeOrderID] = orderAddress;
        nextFreeOrderID++;
        return true;
        
     }
    
    
    //a seller can create a new listing using this function
    function addListing (string _title, string _description, string _publicKey, uint _price) payable returns(bool){
        
        //check to see that the ether provided is enough to pay the listing fee.
        if(getListingFee(_price)>msg.value){ throw; }
        
        //add the new listing to our database
        listings[nextFreeListingID] = Listing(msg.sender,_title,_description,_publicKey,_price,now,true);
        nextFreeListingID++;
    	
        
        return true;
    }

    //disables a listing
    function removeListing(uint index) onlyValidListings(index) returns (bool){
        
        
       //A listing can be removed in only three cases:
       //1) The seller wishes to remove their own listing
       //2) The listing has a high percent of disputed transactions 
       //3) The shareholders vote for the listing to be removed
       //This allows any user to purge a listing created by a bad actor
       if (!((msg.sender == listings[index].seller) || isBadListing(index) || (msg.sender==getCommunity()))) {throw;}
       
	   listings[index].enabled = false;
	   
       return true;
     }
     
     /* a seller can change the price of their order at any time to compensate for changes in 
     the value of ether. there is no fee to reduce the price of a listing. if a seller increases
     the price of a listing, they must pay the listing fee only for the difference in cost between
     the old and new price */
     function changePrice(uint id, uint newPrice) payable onlyValidListings(id) returns (bool){
     
     		if(msg.sender!= listings[id].seller){throw;}
	    	if(!listings[id].enabled){throw;}
     		if(newPrice>listings[id].price && msg.value<( getListingFee(newPrice-listings[id].price))){throw;}
     		listings[id].price = newPrice;
     	
     }
    
    //any funds in the market are transferred as profits to the shareholders
    function getProfits() {
        getCommunity().transfer(this.balance);
    }
 
}
