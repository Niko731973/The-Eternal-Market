pragma solidity ^0.4.9;

contract PriceOracle {
  function read() constant returns (bytes32);
}


contract Market {
    
/* Contract Variables */
       
    uint public listing_fee = 500;          		 // Fee in cents to create a listing
    uint public order_fee = 200;                     // Fee in cents to create an order
    uint public bad_seller_threshold = 15;           //If a listing has more than this amount (as a percentage) of disputed sales, any user can remove this listing.
    uint public nextFreeListingID = 1;		         //the next free listing ID availible
    uint public nextFreeOrderID = 1;       			 //the next free order ID availible
    mapping (uint => Listing) public listings;		 // mapping of listings
    mapping (uint => Order) public orders;			 // mapping of orders
    mapping (address=> string) public publicKeys;	 // mapping of users public keys
    mapping (address=> string) public userDescription; // mapping of users descriptions
    mapping (address=> uint) public wallet;         // funds a given address can withdrawl
    address public owner;							// the owner address of the market
    address public oracleAddress;				//address of price Oracle
    bytes32 public eth_price;				// price of one eth in usd...? needs to be wei?
    
    
    /* Listing Structure */
    struct Listing {
    
        address seller;						// ether address of the seller 
        string title;						// listing title
        string description;     			// sellers description of the listing. may include links to images, other info.
        uint price;							//price in USD cents of the listing
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
	    uint timeTracker;   			// time the contract was created. if the order has been finished this shows the time feedback was issued instead
	    uint state;         		    // 0 unconfirmed, 1 shipped, 2 successful, 3 disputed, 4 aborted, 5 deadman activated
        string deliveryInfo;            // encrypted delivery info
	    string feedback;    			// buyer-submitted feedback on the order
	    uint price;                     // the funds stored for the order (minus fee)
	    
    }
    
    /* Market Constructor */
    function Market() public{
    	owner = msg.sender;
    }
    /* Constant Functions */
    
    /* Determines if a listing is below the threshold to be considered for purging */
    function isBadListing(uint _id) public constant returns(bool){
        
        require(_id < nextFreeListingID);
		Listing memory i = listings[_id];
		if(i.disputed == 0 && i.successes == 0){return false;} 				//listing has no orders yet
        uint listing_bad_rate = (i.disputed*100)/(i.disputed+i.successes);	//current dispute rate
        return listing_bad_rate>=bad_seller_threshold;
    }
    
    function getListing(uint _id) public constant returns(address,string,string,uint,uint,bool,uint,uint,uint){
        require(_id <nextFreeListingID);
        Listing memory i = listings[_id];
        return (i.seller, i.title, i.description, i.price, i.timeListed, i.enabled, i.successes, i.aborted, i.disputed);
       }
    
    function getOrder(uint _id) public constant returns(address, address, uint, uint, uint, string, string, uint){
         require(_id <nextFreeOrderID);
         Order memory i = orders[_id];
         return (i.seller, i.buyer, i.listingID, i.timeTracker, i.state, i.deliveryInfo, i.feedback, i.price);
    
    }
    
    // updates the market price 
    function updatePrice() public {
        eth_price = PriceOracle(oracleAddress).read();
    }
    
    // Returns the Wei cost for USD (in cents) at the current eth price
    function toWei(uint usd, bytes32 ethprice) public constant returns(uint){
        return uint(ethprice)/usd/100;
    }
    
    
    /* General User Functions*/
    
    /* User can change their public key */
    function setUserPublicKey (string _publicKey) public{
        publicKeys[msg.sender] = _publicKey;
    }
    
    /* User can provide contact and other info about themselves */
    function setUserDescription (string _desc) public{
        userDescription[msg.sender] = _desc;
    }
    
    
    /* Seller and Buyer Functions */
    
    /* Seller creates a new listing using this function */
    function addListing (string _title, string _description, uint _price) public payable {
        require(msg.value>=toWei(listing_fee, eth_price));
	    wallet[owner]+=msg.value;
	    //add the new listing to our database
        nextFreeListingID++;
        listings[nextFreeListingID-1] = Listing(msg.sender,_title,_description,_price,now,true,0,0,0);
        
    }
    
    /* Buyer places a new order with this function */
    function addOrder (uint _id, string _deliveryInfo) public payable{
    
        require(_id < nextFreeListingID);
        require(listings[_id].enabled);		//the listing for this order must be active
        bytes32 currentEthPrice = eth_price;
        
        //buyer can only order if they sent enough funds
        uint orderFeeinWei = toWei(order_fee,currentEthPrice);
        uint listingPriceinWei = toWei(listings[_id].price, currentEthPrice);
        require(msg.value >= orderFeeinWei+listingPriceinWei);
        
        wallet[owner] += msg.value-listingPriceinWei;
        
        //add the order to the orders database
        nextFreeOrderID++;
        uint i = nextFreeOrderID-1;
        orders[i].buyer = msg.sender;
        orders[i].seller = listings[_id].seller;
        orders[i].listingID = _id;
        orders[i].timeTracker = now;
        orders[i].price = listingPriceinWei;
        orders[i].deliveryInfo = _deliveryInfo;
        
     }
    
    
    /* Used to remove a listing */
    function removeListing(uint _id) public{
        
       // A listing can be removed in only two cases:
       // 1) The seller wishes to remove their own listing
       // 2) The listing has a high ratio of disputed to successful transactions
       // This allows any user to purge a listing created by a bad actor
       
       require(_id < nextFreeListingID);
       require ((msg.sender == listings[_id].seller) || isBadListing(_id));
       
	   listings[_id].enabled = false;
	   
     }
     
     /* Seller can change the price of a listing */
     function changeListingPrice(uint _id, uint newPrice) public {
     
     	// a seller can change the price of their listing at any time to compensate for changes in 
     	// the value of ether. there is no fee to change the price of a listing.
            
            require(_id < nextFreeListingID);
     		require(msg.sender == listings[_id].seller);
	    	require(listings[_id].enabled);
	    	
     		listings[_id].price = newPrice;
     		
     }
    
    /* Seller can change the description of a listing */
     function changeListingDescription(uint _id, string newDescription) public{
     
            require(_id < nextFreeListingID);
     		require(msg.sender == listings[_id].seller);
	    	require(listings[_id].enabled);
     		listings[_id].description = newDescription;
     }
     
    
    /* Functions used to execute transactions */
    
    /* Abort an unconfirmed order before it is shipped */
    function abort(uint _id) public {
    
    /// The purchase can be aborted by the seller before they confirm shipment. 
    /// The purchase can also be aborted by the buyer if the seller has not confirmed shipment within three days.
        require(_id < nextFreeOrderID);
    	require(orders[_id].state == 0); 
    	require( (msg.sender==orders[_id].seller) || (msg.sender==orders[_id].buyer && now> (orders[_id].timeTracker + (3 days))) );
        orders[_id].state = 4;
        wallet[orders[_id].buyer]+=orders[_id].price;
    }

	
	/* Seller confirms the shipment of an order */
    function confirmShippment(uint _id) public {
		require(_id < nextFreeOrderID);
		require(msg.sender == orders[_id].seller);
		require(orders[_id].state== 0 );
		        
        orders[_id].state = 1;
    }
        
    /* Buyer confirms delivery of the item, seller is paid. */
    function confirmDelivery(uint _id, string _feedback) public{
        require(_id < nextFreeOrderID);
    	require(msg.sender == orders[_id].buyer);
    	require(orders[_id].state == 1);
    	
        orders[_id].state = 2;
        orders[_id].feedback = _feedback;
        orders[_id].timeTracker = now;
        wallet[orders[_id].seller]+=orders[_id].price; //send funds from this order to the seller
    }
    
    /* Deadman's Switch */
    function recoverFunds(uint _id) public{	
    
    ///If for whatever reason the buyer is incapacitated after the order is shipped, 
    /// any user can trigger release of the funds to the seller once 12 weeks have elapsed.
        require(_id < nextFreeOrderID);
        require(now>(orders[_id].timeTracker+(12 weeks))); //DISABLE FOR TESTING
    	require(orders[_id].state == 1 );
    	orders[_id].state = 5;
    	orders[_id].timeTracker = now;
        wallet[orders[_id].seller]+=orders[_id].price;
    	
    }
    
    function dispute(uint _id, string _feedback) public{	
    //only the buyer can dispute an order, they must wait at least three weeks after shipment before doing so.
    //recovered funds are transfered to the market owner
        require(_id < nextFreeOrderID);
    	require(msg.sender==orders[_id].buyer);
    	require(orders[_id].state == 1);
        require(now> (orders[_id].timeTracker+(3 weeks)));
        wallet[owner]+=orders[_id].price;
        orders[_id].state = 3;
        orders[_id].feedback = _feedback;
        orders[_id].timeTracker = now;
       
    }
    
    /* Owner Functions */
    
    function changeOrderFee(uint _new) public{
    require(msg.sender==owner);
    	order_fee = _new;
    }
    
    function changeListingFee(uint _new) public{
    require(msg.sender==owner);
    	listing_fee = _new;
    }
    
    function changeOracleAddress(address _new) public{
        require(msg.sender==owner);
        oracleAddress = _new;
    }
    
    
    /* Transfers ownership of TEM */
    function transferOwner(address _newOwner) public{
    	require(msg.sender==owner);
    	owner = _newOwner;
    }
    
    //any funds in the market are transferred as profits to the requester
    function withdraw(uint _value) public {
        require(wallet[msg.sender]>=_value);
        wallet[msg.sender]-=_value;
	    msg.sender.transfer(_value);
        
    }

    
}
