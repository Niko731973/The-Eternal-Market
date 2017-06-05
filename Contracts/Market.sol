pragma solidity ^0.4.2;
import "Purchase.sol";
import "Database.sol";
import "Community.sol";
import "Base.sol";

contract Market {
    
    /*Contract Variables and Events*/
       
    uint public listing_rate = 0;          //Listing rate is a fee charged for each new listing as a percent (ie 12% charge would be 12)
    
    uint order_rate = 2;                    //Order rate is a fee charged on each order submitted as a percent( ie 2% charge would be 2)
    
    uint bad_seller_threshold = 15;         //If a listing has more than this amount (as a percentage) of disputed sales, any user can remove this listing.
    address public eternalAddress;
	
    
    struct Listing {
    
        address seller;
        string title;
        string listingDescription;
        string publicKey;
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
        string shippingAddress;             //buyers shipping address encrypted with the sellers public key
        address contractAddress;            //address of the purchase contract
        uint listingID;
        uint orderStatus;                   //0 created, 1 shipped, 2 successful, 3 disputed
        uint timeListed;
    }
    
    function Market(address _eternalAddress){
    eternalAddress = _eternalAddress;
        
    }
    
    
    function getDatabase() constant returns (address){
    	Base b = Base(eternalAddress);
    	return b.getDatabase();
    }
    
    function getCommunity() constant returns (address){
    	Base b = Base(eternalAddress);
    	return b.getCommunity();
    }
    
    
    
    
    modifier onlyValidListings(uint index) { 
        if (!Database(getDatabase()).isValidListing(index)){ throw;}
        _;
    }
    
    modifier onlyValidOrders(uint index){
        if (!Database(getDatabase()).isValidOrder(index)){ throw;}
        _;
    }
    
    modifier onlyProposal() {
    	if (msg.sender!=getCommunity()){ throw;}
		_;
    }
    
    modifier onlyCurrentShareholder(){
    	Community N = Community(getCommunity());
    	if(!N.isShareholder(msg.sender)){throw;}
    	_;
    }
    
    
    /*Constant Functions*/
    
    //compute the fee paid by the buyer for each order that is submitted
    function buildOrderFee(uint original_price) public constant returns(uint){
        //returns the fee charged for an order
        return (original_price*order_rate)/100;
    }
    
    //compute the fee charged to the seller when a new listing is created
    function getListingFee(uint original_price) public constant returns(uint){
        return (original_price*listing_rate)/100;
    }
    
    //determines if a listing is below the threshold to be considered for purging
    function isBadListing(uint _id) constant onlyValidListings(_id) returns(bool){
        var (,,,,,,sales_successful,sales_disputed,,) = Database(getDatabase()).getListing(_id);
        
        uint listing_bad_rate = (sales_disputed*100)/(sales_disputed+sales_successful);
        return listing_bad_rate>=bad_seller_threshold;
    }
    

    function nextListingID() public constant returns (uint){
        return Database(getDatabase()).getNextFreeListingID();
    }
    
    function nextOrderID() public constant returns (uint){
        return Database(getDatabase()).getNextFreeOrderID();
    }
    
    
    /* Order and Listing functions*/
    
    //buyers place orders for a listing using this function
    function addOrder (uint index, string shippingAddress) payable onlyValidListings(index) returns(bool){
        var (seller,,,,price,,,,,listing_enabled) = Database(getDatabase()).getListing(index);
        
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
    function addListing (string _title, string _description, string _publicKey, uint _price) payable onlyCurrentShareholder returns(bool){
        
        //check to see that the ether provided is enough to create the listing.
        //This payment for new listings is required to prevent scammers and spam
        if(getListingFee(_price)>msg.value){ throw; }
        
        //add the new listing to our database
        Database(getDatabase()).addListing(msg.sender,_title,_description,_publicKey,_price);
    	
        
        return true;
    }
    
    //
    
    //disables a listing
    function removeListing(uint index) onlyValidListings(index) returns (bool){
        var (seller,,,,,,,,,) = Database(getDatabase()).getListing(index);
        //address seller = a;
        
       //A listing can be removed in only three cases:
       //1) The seller wishes to remove their own listing
       //2) The listing has a high percent of disputed transactions 
       //3) The shareholders vote for the listing to be removed
       //This allows any user to purge a listing created by a bad actor
       if ((msg.sender != seller) && !isBadListing(index) && (msg.sender!=getCommunity())) {throw;}
       
       Database(getDatabase()).removeListing(index);
       
       return true;
     }
     
    
    //allows the seller to confirm shipment of an order
    function confirmShipment(uint index) onlyValidOrders(index) returns (bool){

        
        var (,seller,,contract_address,,orderStatus,) = Database(getDatabase()).getOrder(index);
        //address seller = b;
        //uint orderStatus = f;
       // address contract_address = d;
       
               //only the seller can confirm shipment
        if(msg.sender != seller){throw;}
        
        if(orderStatus!=0){throw;} //order state must be "CREATED"
        
        Purchase p = Purchase(contract_address);
        p.confirmShippment();
        
        Database(getDatabase()).confirmShipment(index); //LOCKED
        return true;
        
    }
    
    //allows the buyer to confirm delivery of an order
    function confirmDelivery(uint index) onlyValidOrders(index) returns (bool){
        var (buyer,,,contract_address,,orderStatus,) = Database(getDatabase()).getOrder(index);
        //address buyer = a;
        //uint orderStatus = f;
        //address contract_address = d;
        
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
    	if(msg.sender!=seller || !(msg.sender==buyer && now>(time_listed+(3 days)))){throw;}
    	if(orderStatus!=0){throw;}
    	
    	Purchase p = Purchase(contract_address);
    	p.abort();
    	
    	Database(getDatabase()).abortOrder(index);
    	
    	
    }
    
    /* Shareholder Functions */
    
    //changes the threshold upon which a listing can be removed by the community
    function change_bad_seller_threshold(uint new_num) onlyProposal returns(bool){
    bad_seller_threshold = new_num;
    }
    
    function updateRates(uint _order, uint _listing) onlyProposal returns(bool){
    	order_rate = _order;
    	listing_rate = _listing;
    }
    
    //any funds in the market are transferred as profits to the shareholders
    function getProfits() onlyProposal {
        getCommunity().transfer(this.balance);
    }
 
}