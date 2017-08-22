pragma solidity ^0.4.2;
import "./Purchase.sol";

contract Market {
    
/* Contract Variables */
       
    uint public listing_rate = 5;          			// Listing rate is the fee charged for each new listing as a percent (ie 12% charge would be 12)
    uint public order_rate = 2;                     // Order rate is the fee charged on each order submitted as a percent( ie 2% charge would be 2)
    uint public bad_seller_threshold = 15;          //If a listing has more than this amount (as a percentage) of disputed sales, any user can remove this listing.
    uint public nextFreeListingID = 1;		        //the next free listing ID availible
    uint public nextFreeOrderID = 1;       			//the next free order ID availible
    mapping (uint => Listing) public listings;		// mapping of listings
    mapping (uint => Order) public orders;			// mapping of orders
    mapping (address=> string) public publicKeys;	// mapping of users public keys
    mapping (address=> string) public userDescription; // mapping of users descriptions
    address public owner;							// the owner address of the market


    /* Listing Structure */
    struct Listing {
    
        address seller;						// ether address of the seller 
        string title;						// listing title
        string description;     			// sellers description of the listing. may include links to images, other info.
        uint price;							//price in wei of the listing
        uint timeListed;					// date and time the listing was created
        bool enabled;						// is the listing active or not
        uint successes;						// # of successful orders
        uint aborted;						// # of aborted orders
        uint disputed;						// # of disputed orders
    }
    
    /* Order Structure */
    
    struct Order {
    
	    address seller;					// ether address of the seller
	    address buyer;					// ether address of the buyer
	    uint listingID;					// id of the listing the order was created from
	    string shippingDetails;			// the shipping address of the buyer, encrypted with the sellers public key
	    uint timeTracker;   			// time the contract was created. if the order has been finished this shows the time feedback was issued instead
	    uint state;         		    // 0 unconfirmed, 1 shipped, 2 successful, 3 disputed, 4 aborted, 5 deadman activated
	    string feedback;    			// buyer-submitted feedback on the order
	    uint stars;						// buyer-submitted 1 through 5 star rating system
	    address contractAddress;        // the contract location which stores the ether
	    
    }
    
    /* Market Constructor /*
    function Market(){
    	owner = msg.sender;
    }
    
    
    /*Constant Functions*/
    
    /* Used to find only listings with a valid index (not out of bounds) */
    modifier onlyValidListings(uint id) { 
        require(id>0 && id < nextFreeListingID);
		_;
    }
    
    /* Used to find only orders with a valid index (not out of bounds) */
    modifier onlyValidOrders(uint id){
        require(id>0 && id < nextFreeOrderID);
        _;
    }
    
    /* Returns the fee charged for an order in wei */
    function buildOrderFee(uint price) public constant returns(uint){
        return (price*order_rate)/100;
    }
    
    /* Returns the fee charged for a new listing in wei*/
    function getListingFee(uint price) public constant returns(uint){
        return (price*listing_rate)/100;
    }
    
    /* Determines if a listing is below the threshold to be considered for purging */
    function isBadListing(uint _id) constant onlyValidListings(_id) returns(bool){
		Listing memory i = listings[_id];
		if(i.disputed == 0 && i.successes == 0){return false;} 				//listing has no orders yet
        uint listing_bad_rate = (i.disputed*100)/(i.disputed+i.successes);	//current dispute rate
        return listing_bad_rate>=bad_seller_threshold;
    }
    
    
    /* General User Functions*/
    
    /* User can change their public key */
    function setUserPublicKey (string _publicKey) returns(bool){
        publicKeys[msg.sender] = _publicKey;
        return true;
        
    }
    
    /* User can provide some basic info about themselves */
    function setUserDescription (string _desc) returns(bool){
        userDescription[msg.sender] = _desc;
        return true;
        
    }
    
    
    /* Seller and Buyer Functions */
    
    /* Seller creates a new listing using this function */
    function addListing (string _title, string _description, string _publicKey, uint _price) payable returns(bool){
        
        //check to see that the ether provided is enough to pay the listing fee.
        require(msg.value>=getListingFee(_price));
        
        //add the new listing to our database
        nextFreeListingID++;
        listings[nextFreeListingID-1] = Listing(msg.sender,_title,_description,_price,now,true,0,0,0);
        return true;
    }
    
    /* Buyer places a new order with this function */
    function addOrder (uint _id, string shippingAddress) payable onlyValidListings(_id) returns(bool){
    
        require(listings[_id].enabled);		//the listing for this order must be active
        
        //calculate the fee charged for the order
        uint fee = buildOrderFee(listings[_id].price);
        
        //buyer can only order if they sent enough funds
        require(msg.value >= listings[_id].price);	
		
        //add the order to the orders database
        nextFreeOrderID++;
        uint i = nextFreeOrderID-1;
        orders[i].contractAddress = orderAddress;
        orders[i].buyer = msg.sender;
        orders[i].seller = listings[_id].seller;
        orders[i].listingID = _id;
        orders[i].shippingDetails = shippingAddress;
        orders[i].timeTracker = now;
        
        
        //create a purchase contract for the order. keep the fee, transfer the rest of the payment to the contract
        address orderAddress = (new Purchase).value(msg.value-fee)(this);
        
        
        return true;
        
     }
    
    
    /* Used to remove a listing */
    function removeListing(uint index) onlyValidListings(index) returns (bool){
        
       // A listing can be removed in only two cases:
       // 1) The seller wishes to remove their own listing
       // 2) The listing has a high ratio of disputed to successful transactions
       // This allows any user to purge a listing created by a bad actor
       
       require ((msg.sender == listings[index].seller) || isBadListing(index));
       
	   listings[index].enabled = false;
	   
       return true;
     }
     
     /* Seller can change the price of a listing */
     function changeListingPrice(uint id, uint newPrice) payable onlyValidListings(id) returns (bool){
     
     	// a seller can change the price of their listing at any time to compensate for changes in 
     	// the value of ether. there is no fee to reduce the price of a listing. if a seller increases
     	// the price of a listing, they must pay the listing fee only for the difference in cost between
     	// the old and new price 
     
     		require(msg.sender == listings[id].seller);
	    	require(listings[id].enabled);
	    	if(newPrice>listings[id].price){
     			require( msg.value>=( getListingFee(newPrice-listings[id].price)));
     		}
     		listings[id].price = newPrice;
     		
     		return true;
     }
    
    /* Seller can change the description of a listing */
     function changeListingDescription(uint id, string newDescription) onlyValidListings(id) returns (bool){
     
     		require(msg.sender == listings[id].seller);
	    	require(listings[id].enabled);
     		listings[id].description = newDescription;
     		return true;
     }
     
    
    /* Functions used to execute transactions */
    
    /* Abort an unconfirmed order before it is shipped */
    function abort(uint _id) onlyValidOrders(_id) returns(bool){
    
    /// The purchase can be aborted by the seller before they confirm shipment. 
    /// The purchase can also be aborted by the buyer if the seller has not confirmed shipment within three days.
    
    	require(orders[_id].state == 0); 
    	require( (msg.sender==orders[_id].seller) || (msg.sender==orders[_id].buyer && now> (orders[_id].timeTracker + (3 days))) );
        orders[_id].state = 4;
        
    	sendOrderFunds(_id,orders[_id].buyer);		// Buyer recieves a refund
    	return true;
    }

	
	/* Seller confirms the shipment of an order */
    function confirmShippment(uint _id) onlyValidOrders(_id) returns(bool) {
			
		require(msg.sender == orders[_id].seller);
		require(orders[_id].state== 0 );
		        
        orders[_id].state = 1;
        return true;
    }
        
    /* Buyer confirms delivery of the item, seller is paid. */
    function confirmDelivery(uint _id, string _feedback, uint _stars) onlyValidOrders(_id) returns(bool) {
    	require(msg.sender == orders[_id].buyer);
    	require(orders[_id].state == 1);
    	require(_stars>0 && _stars<6); // rating must be between 1 and 5 stars
    	
        orders[_id].state = 2;
        orders[_id].feedback = _feedback;
        orders[_id].stars = _stars;
        orders[_id].timeTracker = now;
    	sendOrderFunds(_id,orders[_id].seller); //send funds from this order to the seller
    	return true;
    }
    
    /* Deadman's Switch */
    function recoverFunds(uint _id) onlyValidOrders(_id)   returns(bool)  {	
    
    ///If for whatever reason the buyer is incapacitated after the order is shipped, 
    /// any user can trigger release of the funds to the seller once 12 weeks have elapsed.
    
        require(now>(orders[_id].timeTracker+(12 weeks))); //DISABLE FOR TESTING
    	require(orders[_id].state == 1 );
    	orders[_id].state = 5;
    	orders[_id].timeTracker = now;
    	sendOrderFunds(_id,orders[_id].seller);
    	return true;
    }
    
    function dispute(uint _id, string _feedback, uint stars) onlyValidOrders(_id) returns(bool) {	
    //only the buyer can dispute an order, they must wait at least three weeks after shipment before doing so.
    //recovered funds are transfered to the market
    
    	require(msg.sender==orders[_id].buyer);
    	require(orders[_id].state == 1);
        require(now> (orders[_id].timeTracker+(3 weeks)));
        require(stars>0 && stars<6);
            orders[_id].state = 3;
    		sendOrderFunds(_id,this);
            orders[_id].feedback = _feedback;
            orders[_id].stars = stars;
            orders[_id].timeTracker = now;
            return true;
       
    }
    
    //internal method, used to send money to the buyer or seller from each order's contract
    function sendOrderFunds(uint id, address dest) private returns(bool){
    	//calls the sendFunds method of the Order contract for order *id, and sends the
    	//contracts funds to *dest
    	
    	        Purchase orderContract = Purchase(orders[id].contractAddress);
    	        orderContract.sendFunds(dest);
    	        return true;
    	
    }
 
    
    
    /* Owner Functions */
    
    function changeOrderRate(uint _new){
    require(msg.sender==owner);
    	order_rate = _new;
    }
    
    function changeListingRate(uint _new){
    require(msg.sender==owner);
    	listing_rate = _new;
    }
    
    //any funds in the market are transferred as profits to the owner
    function collectProfits() {
    	require(msg.sender==owner);
        owner.transfer(this.balance);
    }
    
    /* Transfers ownership of TEM */
    function transferOwner(address _newOwner){
    	require(msg.sender==owner);
    	owner = _newOwner;
    }
    
}
