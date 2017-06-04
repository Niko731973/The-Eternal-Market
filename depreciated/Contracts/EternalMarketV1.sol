pragma solidity ^0.4.2;
contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner { 
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}


contract EternalMarket is owned {
    
    /*Contract Variables and Events*/
    address public databaseAddress;                       //address of the database which contains the orders and listings in the eternal market
    
    Database public database;
    
    uint public listing_rate = 0;                  //Listing rate is a fee charged for each new listing as a percent (ie 12% charge would be 12)
    
    uint order_rate = 2;                    //Order rate is a fee charged on each order submitted as a percent( ie 2% charge would be 2)
    
    uint bad_seller_threshold = 15;         //If a listing has more than this amount (as a percentage) of disputed sales, any user can remove this listing.
    
    bool freeListingsAndOrders = false;     //new listings and orders can be halted to allow for migration to an updated contract version
    
    uint public USD = 1;					//the price of one USD in wei
    
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
    
    function EternalMarket(address _databaseAddress){
        databaseAddress = _databaseAddress;
        database = Database(databaseAddress);
    }
    
    modifier onlyValidListings(uint index) { 
        if (!database.isValidListing(index)){ throw;}
        _;
    }
    
    modifier onlyValidOrders(uint index){
        if (!database.isValidOrder(index)){ throw;}
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
        var (,,,,,,sales_successful,sales_disputed,,) = database.getListing(_id);
        
        uint listing_bad_rate = (sales_disputed*100)/(sales_disputed+sales_successful);
        return listing_bad_rate>=bad_seller_threshold;
    }
    

    function nextListingID() public constant returns (uint){
        return database.getNextFreeListingID();
    }
    
    function nextOrderID() public constant returns (uint){
        return database.getNextFreeOrderID();
    }
    
    
    /* Order and Listing functions*/
    
    //buyers place orders for a listing using this function
    function addOrder (uint index, string shippingAddress) payable onlyValidListings(index) returns(bool){
        var (seller,,,,price,,,,,listing_enabled) = database.getListing(index);
        
        if(msg.value < (price*USD) || !(listing_enabled)){ throw;}
        
        //pay the fee for the order
        uint fee = buildOrderFee(price);
        owner.transfer(fee);
        
        //create a purchase contract for the order
        address purchaseContractAddress = (new Purchase).value(msg.value-fee)(msg.sender,seller,owner);
        
        //add the order to our database
        database.addOrder(msg.sender,seller,shippingAddress,purchaseContractAddress,index);
        
        
        return true;
        
     }
    
    
    //a seller can create a new listing using this function
    function addListing (string _title, string _description, string _publicKey, uint _price) payable returns(bool){
        
        //check to see that the ether provided is enough to create the listing.
        //This payment for new listings is required to prevent scammers and spam
        if(getListingFee(_price*USD)>msg.value){ throw; }
        
        //add the new listing to our database
        database.addListing(msg.sender,_title,_description,_publicKey,_price);
    	
    	//pays the listing fee
        owner.transfer(msg.value);
        
        return true;
    }
    
    //
    
    //disables a listing
    function removeListing(uint index) onlyValidListings(index) returns (bool){
        var (seller,,,,,,,,,) = database.getListing(index);
        //address seller = a;
        
       //A listing can be removed in only two cases:
       //1) The seller wishes to remove their own listing
       //2) The listing has a high percent of disputed transactions 
       //This allows any user to purge a listing created by a bad actor
       if ((msg.sender != seller) && !isBadListing(index) ) {throw;}
       
       database.removeListing(index);
       
       return true;
     }
     
    
    //allows the seller to confirm shipment of an order
    function confirmShipment(uint index) onlyValidOrders(index) returns (bool){

        
        var (,seller,,contract_address,,orderStatus,) = database.getOrder(index);
        //address seller = b;
        //uint orderStatus = f;
       // address contract_address = d;
       
               //only the seller can confirm shipment
        if(msg.sender != seller){throw;}
        
        if(orderStatus!=0){throw;} //order state must be "CREATED"
        
        Purchase p = Purchase(contract_address);
        p.confirmShippment();
        
        database.confirmShipment(index); //LOCKED
        return true;
        
    }
    
    //allows the buyer to confirm delivery of an order
    function confirmDelivery(uint index) onlyValidOrders(index) returns (bool){
        var (buyer,,,contract_address,,orderStatus,) = database.getOrder(index);
        //address buyer = a;
        //uint orderStatus = f;
        //address contract_address = d;
        
        if(msg.sender !=buyer){throw;}
        if(orderStatus!=1){throw;} //order state must be LOCKED
        
        Purchase p = Purchase(contract_address);
        p.confirmReceived();
        database.confirmDelivery(index);
        
        return true;
        
    }
    function disputeOrder(uint index) onlyValidOrders(index) returns (bool){
        //only the buyer can dispute an order. Buyer must wait at least 3 weeks after shipping confirmation before they can dispute
        var (buyer,,,contract_address,,orderStatus,time_listed) = database.getOrder(index);
        
        if(msg.sender !=buyer){throw;}
        if(now<(time_listed+(3 weeks))){throw;}
        if(orderStatus!=1){throw;} //LOCKED
        
        Purchase p = Purchase(contract_address);
        p.dispute();
        
        database.disputeOrder(index);
        
        return true;
        
    }
    
    function abortOrder(uint index) onlyValidOrders(index) returns (bool){
    	//the seller can abort any order which has not been shipped
    	//the buyer can abort any order which has not shipped within three days
    	var (buyer,seller,,contract_address,,orderStatus,time_listed) = database.getOrder(index);
    	if(msg.sender!=seller || !(msg.sender==buyer && now>(time_listed+(3 days)))){throw;}
    	if(orderStatus!=0){throw;}
    	
    	Purchase p = Purchase(contract_address);
    	p.abort();
    	
    	database.abortOrder(index);
    	
    	
    }
    
    /* Market Owner Functions */
    
    //changes the fee charged on every order placed
    function changeOrderRate(uint new_rate) onlyOwner returns(bool){
        order_rate = new_rate;
        return true;
    }
    
    //update the value of one USD in wei
    function updateUSD(uint new_rate) onlyOwner {
    	USD = new_rate;
    }
    
    //changes the fee charged on each listing that is created
    function changeListingRate(uint new_rate) onlyOwner returns(bool){
        listing_rate = new_rate;
        return true;
    }
    
    //changes the threshold upon which a listing can be removed by the community
    function change_bad_seller_threshold(uint new_num) onlyOwner returns(bool){
    bad_seller_threshold = new_num;
    }

    //listings and orders may be disallowed to allow for migration to a new market contract
    function toggleMarketFreeze() onlyOwner{
    
        if(freeListingsAndOrders){
            freeListingsAndOrders = false;
           return;
        }
        freeListingsAndOrders = true;
    }
    
    //any funds left in the market contract are recoverable (used when upgrading the market contract)
    function recover_funds() onlyOwner {
        owner.transfer(this.balance);
    }
    
    function changeDatabaseAddress(address newAddress) onlyOwner{
    	databaseAddress = newAddress;
    	database = Database(databaseAddress);
    }
    
}

contract Purchase {

    address public seller;
    address public buyer;
    address public arbitrator;
    uint creationTime;
    address public market;
    
    enum State { Created, Locked, Inactive, Disputed }
    State public state;

    function Purchase(address _buyer, address _seller, address _arbitrator) payable {
        
        buyer = _buyer;
        seller = _seller;
        arbitrator = _arbitrator;
        creationTime = now;
        state = State.Created;
        market = msg.sender;
    }

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require((msg.sender == buyer) || (msg.sender == arbitrator) || (tx.origin == buyer) || (msg.sender == market));
        _;
    }

    modifier onlySeller() {
        require((msg.sender == seller) || (msg.sender == arbitrator)|| (tx.origin == seller)|| (msg.sender == market));
        _;
    }

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    event Aborted();
    event PurchaseConfirmed();
    event Disputed();
    event ItemReceived();

    /// The purchase can be aborted by the seller before they confirm shipment. 
    /// The purchase can also be aborted by the buyer if the seller has not responded within three days.
    
    function abort()
        inState(State.Created)
    {
    
        if(msg.sender==seller || tx.origin == seller || msg.sender == arbitrator || (msg.sender==buyer && now> (creationTime + 3 days)) || (tx.origin==buyer && now> (creationTime + 3 days))){
        Aborted();
        state = State.Inactive;
        buyer.transfer(this.balance);
        
        }
    }

    /// Seller confirms shipment of the order.
    /// The ether will be locked until confirmReceived
    /// is called, or a dispute arises.
    function confirmShippment()
        onlySeller
        inState(State.Created)
    {
        PurchaseConfirmed();
        state = State.Locked;
    }
        
    /// Confirm that you (the buyer) received the item.
    /// This will release the locked ether to the seller.
    function confirmReceived()
        onlyBuyer
        inState(State.Locked)
    {
        ItemReceived(); 
        // It is important to change the state first because
        // otherwise, the contracts called using `send` below
        // can call in again here.
        state = State.Inactive;

        // NOTE: This actually allows both the buyer and the seller to
        // block the refund - the withdraw pattern should be used.
        
        seller.transfer(this.balance);
    }
    
    ///If for whatever reason the buyer/seller are incapicatated and the contract is not disputed, after 12 weeks
    ///any user can trigger release of the funds. the funds are split 50/50 between
    /// the buyer and seller.
    function recoverFunds()
        inState(State.Locked)
    {
        if(now>(creationTime+(12 weeks))){
        state = State.Inactive;
        seller.transfer(this.balance/2);
        buyer.transfer(this.balance);
        
        }
    }
    
    //only the buyer can dispute an order, they must wait at least three weeks before doing so
    function dispute()
        inState(State.Locked)
    {
        if(now>(creationTime+ (3 weeks)) && (msg.sender == buyer || tx.origin == buyer || msg.sender == market)){
            state = State.Disputed;
            Disputed();
            
        }
    }
    
    
    function sendFundsTo(address recip, uint amount){
        //can only be called by the arbitrator, used to send funds to either the buyer or seller of the contract.
        
        if (msg.sender != arbitrator){ throw;}
        if (!(seller == recip || buyer == recip)){ throw;}
        
        recip.transfer(amount);
    }
    
    function() payable { }
}

contract Database is owned{

    

    /* This database contains all of the listings and orders in the eternal market */
    
    address public market;                      //the address of the current market
    uint public nextFreeListingID = 1;          //the next free listing ID availible
    uint public nextFreeOrderID = 1;            //the next free order ID availible
    
    mapping (uint => Listing) public listings;
    mapping (uint => Order) public orders;
    
    
   
    
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
        uint orderStatus;                   //0 created, 1 shipped, 2 successful, 3 disputed, 4 aborted
        uint timeListed;
    }
    
    function getNextFreeListingID() constant returns (uint){
        return nextFreeListingID;
    }
    
    function getNextFreeOrderID() constant returns (uint){
        return nextFreeOrderID;
    }
    function getListing(uint id) constant returns(address,string,string,string,uint,uint,uint,uint,uint,bool){
            if (!isValidListing(id)){ throw;}
            Listing i = listings[id];
            return( i.seller,i.title,i.listingDescription,i.publicKey,i.price,i.timeListed,i.salesSuccessful,i.salesDisputed,i.lastsuccessfulSale,i.enabled);
    }
    
    function getOrder(uint id) constant returns(address, address, string, address, uint, uint, uint){
        if (!isValidOrder(id)){ throw;}
        Order i = orders[id];
        return(i.buyer,i.seller,i.shippingAddress,i.contractAddress,i.listingID,i.orderStatus,i.timeListed);
    }
    
    function isValidListing(uint id) constant returns (bool){
        if(id<=0 || id>= nextFreeListingID){return false;}
        return true;
    }
    
    function isValidOrder(uint id) constant returns (bool){
        if(id<=0 || id>= nextFreeOrderID){return false;}
        return true;
    }
    
    
    function addListing(address _seller, string _title, string _description, string _publicKey, uint _price)  {
        if (!(msg.sender==market || msg.sender==owner)){ throw;}
        uint i = nextFreeListingID;
        listings[i] = Listing(_seller,_title,_description,_publicKey,_price,now,0,0,0,true);
        
        nextFreeListingID++;
    }
    
    function removeListing(uint id)  {
        if (!isValidListing(id)){ throw;}
        if (!(msg.sender==market)) {throw;}
        listings[id].enabled = false;
        
    }
    
    function addOrder(address _buyer,address  _seller, string _shippingAddress, address  _contractAddress, uint _listingID)  {
        if (msg.sender!=market) {throw;}
        uint i = nextFreeOrderID;
        orders[i] = Order(_buyer,_seller,_shippingAddress,_contractAddress,_listingID,0,now);
        
        nextFreeOrderID++;
    }
    
    function confirmShipment(uint id)   {
        if (!isValidOrder(id)){ throw;}
        if(orders[id].orderStatus!=0){throw;}
        if (!(msg.sender==market)) {throw;}
        orders[id].orderStatus = 1;
    }
    
    function confirmDelivery(uint id)   {
        if (!isValidOrder(id)){ throw;}
        if(orders[id].orderStatus!=1){throw;}
        if (msg.sender!=market) {throw;}
        orders[id].orderStatus = 2;
        listings[orders[id].listingID].salesSuccessful++;
    }
    
    function disputeOrder(uint id)   {
        if (!isValidOrder(id)){ throw;}
        if(orders[id].orderStatus!=1){throw;}
        if (msg.sender!=market) {throw;}
        
        orders[id].orderStatus = 3;
        listings[orders[id].listingID].salesDisputed++;
        
    }
    
    function abortOrder(uint id)   {
    	if (!isValidOrder(id)){ throw;}
        if(orders[id].orderStatus!=0){throw;}
        if (msg.sender!=market) {throw;}
    	orders[id].orderStatus = 4;
    	
    
    }
    
    function changeMarket(address newMarket) onlyOwner {
    
        market = newMarket;
    }

}