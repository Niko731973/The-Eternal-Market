pragma solidity ^0.4.2;
import "Purchase.sol";
import "Database.sol";
import "Community.sol";
import "Base.sol";

contract Market {

	/* The Eternal Address of the Market */
    address public eternalAddress = '0x06eCea90E03cA3474c5626837918253eEc96F5d0';

    
    /*Contract Variables and Events*/
       
    uint public listing_rate = 5;          			// Listing rate is a fee charged for each new listing as a percent (ie 12% charge would be 12)
    uint public order_rate = 2;                     // Order rate is a fee charged on each order submitted as a percent( ie 2% charge would be 2)
    uint public bad_seller_threshold = 15;          //If a listing has more than this amount (as a percentage) of disputed sales, any user can remove this listing.
    
	
    
    /* Structures representing a listing and an order */
    struct Listing {
    
        address seller;
        string title;
        string listingDescription;
        string publicKey;					//public key of the seller used to encrypt shipping addresses for orders
        uint price;
        uint timeListed;
        uint salesSuccessful;
        uint salesDisputed;
        uint lastsuccessfulSale;
        bool enabled;
    }
    
    struct Order {
    
        address buyer;
        address seller;
        string shippingAddress;             // buyers shipping address encrypted with the sellers public key
        address contractAddress;            // address of the purchase contract
        uint listingID;						// the index in the array of listings the order was placed for
        uint orderStatus;                   //0 created, 1 shipped, 2 successful, 3 disputed, 4 aborted
        uint timeListed;
    }
    
    /* Constructor, sets the base address of TEM */
    function Market(){
        
    }
    
    /* Returns the current address of the database contract */
    function getDatabase() constant returns (address){
    	Base b = Base(eternalAddress);
    	return b.database();
    }
    
    /* Returns the current address of the community contract */
    function getCommunity() constant returns (address){
    	Base b = Base(eternalAddress);
    	return b.community();
    }
    
    
    
    /* Used to find only listings with a valid index (not out of bounds or disabled) */
    modifier onlyValidListings(uint index) { 
        if (!Database(getDatabase()).isValidListing(index)){ throw;}
        _;
    }
    
    /* Used to find only orders with a valid index (not out of bounds) */
    modifier onlyValidOrders(uint index){
        if (!Database(getDatabase()).isValidOrder(index)){ throw;}
        _;
    }
    
    /* only the community can execute some functions (via a proposal which is voted on and executed) */
    modifier onlyCommunity() {
    	if (msg.sender!=getCommunity()){ throw;}
		_;
    }
    
    
    /*Constant Functions*/
    
    // Compute the fee paid by the buyer for each order that is submitted
    function buildOrderFee(uint original_price) public constant returns(uint){
        //returns the fee charged for an order
        return (original_price*order_rate)/100;
    }
    
    // Compute the fee charged to the seller when a new listing is created
    function getListingFee(uint original_price) public constant returns(uint){
        return (original_price*listing_rate)/100;
    }
    
    // Determines if a listing is below the threshold to be considered for purging
    function isBadListing(uint _id) constant onlyValidListings(_id) returns(bool){
        var (,,,,,,sales_successful,sales_disputed,,) = Database(getDatabase()).getListing(_id);
        
        uint listing_bad_rate = (sales_disputed*100)/(sales_disputed+sales_successful);
        return listing_bad_rate>=bad_seller_threshold;
    }
    
	// What is the next free index in our listing array
    function nextListingID() public constant returns (uint){
        return Database(getDatabase()).getNextFreeListingID();
    }
    
    // What is the next free index in our order array
    function nextOrderID() public constant returns (uint){
        return Database(getDatabase()).getNextFreeOrderID();
    }
    
    
    /* Order and Listing functions*/
    
    //buyers place orders for a listing using this function
    function addOrder (uint index, string shippingAddress) payable onlyValidListings(index) returns(bool){
        var (seller,,,,price,,,,,listing_enabled) = Database(getDatabase()).getListing(index);
        
        //you can only order if you paid enough money, and if the listing is enabled
        if(msg.value < price || !(listing_enabled)){ throw;}	
        
        //calculate the fee for the order
        uint fee = buildOrderFee(price);
        
        
        //create a purchase contract for the order. keep the fee, transfer the remainder to the contract
        address purchaseContractAddress = (new Purchase).value(msg.value-fee)(msg.sender,seller);
        
        //add the order to our database
        Database(getDatabase()).addOrder(msg.sender,seller,shippingAddress,purchaseContractAddress,index);
        
        
        return true;
        
     }
    
    
    //a seller can create a new listing using this function
    function addListing (string _title, string _description, string _publicKey, uint _price) payable returns(bool){
        
        //check to see that the ether provided is enough to pay the listing fee.
        if(getListingFee(_price)>msg.value){ throw; }
        
        //add the new listing to our database
        Database(getDatabase()).addListing(msg.sender,_title,_description,_publicKey,_price);
    	
        
        return true;
    }
    
    
    
    //disables a listing
    function removeListing(uint index) onlyValidListings(index) returns (bool){
        var (seller,,,,,,,,,) = Database(getDatabase()).getListing(index);
        //address seller = a;
        
       //A listing can be removed in only three cases:
       //1) The seller wishes to remove their own listing
       //2) The listing has a high percent of disputed transactions 
       //3) The shareholders vote for the listing to be removed
       //This allows any user to purge a listing created by a bad actor
       if (!((msg.sender == seller) || isBadListing(index) || (msg.sender==getCommunity()))) {throw;}
       
       Database(getDatabase()).removeListing(index);
       
       return true;
     }
     
     /* a seller can change the price of their order at any time to compensate for changes in 
     the value of ether. there is no fee to reduce the price of a listing. if a seller increases
     the price of a listing, they must pay the listing fee only for the difference in cost between
     the old and new price */
     function changePrice(uint index, uint newPrice) payable onlyValidListings(index) returns (bool){
             var (seller,,,,price,,,,,listing_enabled) = Database(getDatabase()).getListing(index);
     		if(msg.sender!=seller){throw;}
	    	if(!listing_enabled){throw;}
     		if(newPrice>price && msg.value<( getListingFee(newPrice-price))){throw;}
     		
     		Database(getDatabase()).changePrice(index,newPrice);
     	
     }
     
    
    // Allows the seller to confirm shipment of an order
    function confirmShipment(uint index) onlyValidOrders(index) returns (bool){

        
        var (,seller,,contract_address,,orderStatus,) = Database(getDatabase()).getOrder(index);
               
        //only the seller can confirm shipment
        if(msg.sender != seller){throw;}
        
        if(orderStatus!=0){throw;} // order must be created, not already shipped, delivered disputed, or aborted
        
        Purchase p = Purchase(contract_address);
        p.confirmShippment();
        
        Database(getDatabase()).confirmShipment(index); //changes the state of the order to shipped
        return true;
        
    }
    
    //allows the buyer to confirm delivery of an order
    function confirmDelivery(uint index) onlyValidOrders(index) returns (bool){
        var (buyer,,,contract_address,,orderStatus,) = Database(getDatabase()).getOrder(index);
       
        
        if(msg.sender !=buyer){throw;}
        if(orderStatus!=1){throw;} //order state must be LOCKED
        
        Purchase p = Purchase(contract_address);
        p.confirmReceived();
        Database(getDatabase()).confirmDelivery(index);
        
        return true;
        
    }
    function disputeOrder(uint index) onlyValidOrders(index) returns (bool){
        //only the buyer can dispute an order. Buyer must wait at least 3 weeks after shipping confirmation before they can dispute
        var (buyer,,,contract_address,,orderStatus,time_listed) = Database(getDatabase()).getOrder(index);
        
        if(msg.sender !=buyer){throw;}
        if(now<(time_listed+(3 weeks))){throw;}
        if(orderStatus!=1){throw;} //LOCKED
        
        Purchase p = Purchase(contract_address);
        p.dispute();
        
        Database(getDatabase()).disputeOrder(index);
        
        return true;
        
    }
    
    function abortOrder(uint index) onlyValidOrders(index) returns (bool){
    	//the seller can abort any order which has not been shipped
    	//the buyer can abort any order which has not shipped within three days
    	var (buyer,seller,,contract_address,,orderStatus,time_listed) = Database(getDatabase()).getOrder(index);
    	if(!(msg.sender==seller || (msg.sender==buyer && now>(time_listed+(3 days))))){throw;}
    	if(orderStatus!=0){throw;}
    	
    	Purchase p = Purchase(contract_address);
    	p.abort();
    	
    	Database(getDatabase()).abortOrder(index);
    	
    	
    }
    
    /* Shareholder Functions */
    
    //changes the threshold upon which a listing can be removed by the community
    function change_bad_seller_threshold(uint new_num) onlyCommunity returns(bool){
        
    bad_seller_threshold = new_num;
    }
    
    function updateRates(uint _order, uint _listing) onlyCommunity returns(bool){
    	order_rate = _order;
    	listing_rate = _listing;
    }
    
    //any funds in the market are transferred as profits to the shareholders
    function getProfits() onlyCommunity {
        getCommunity().transfer(this.balance);
    }
 
}
