pragma solidity ^0.4.2;
import "Base.sol";

contract Database{

    

    /* This database contains all of the listings and orders in the eternal market */
    
    uint public nextFreeListingID = 1;          //the next free listing ID availible
    uint public nextFreeOrderID = 1;            //the next free order ID availible
    address public eternalAddress;
    
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
    
    function Database(){
    	eternalAddress = '0x06eCea90E03cA3474c5626837918253eEc96F5d0';
    }
    
    function getMarket() constant returns (address){
    	Base b = Base(eternalAddress);
    	return b.market();
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
        if (msg.sender!=getMarket()){ throw;}
        uint i = nextFreeListingID;
        listings[i] = Listing(_seller,_title,_description,_publicKey,_price,now,0,0,0,true);
        
        nextFreeListingID++;
    }
    
    function changePrice(uint index, uint newPrice){
    	if(msg.sender!=getMarket()){throw;}
    	if(!isValidListing(index)){throw;}
    	listings[index].price = newPrice;
    }
    
    function removeListing(uint id)  {
        if (!isValidListing(id)){ throw;}
        if (msg.sender!=getMarket()) {throw;}
        listings[id].enabled = false;
        
    }
    
    function addOrder(address _buyer,address  _seller, string _shippingAddress, address  _contractAddress, uint _listingID)  {
        if (msg.sender!=getMarket()) {throw;}
        uint i = nextFreeOrderID;
        orders[i] = Order(_buyer,_seller,_shippingAddress,_contractAddress,_listingID,0,now);
        
        nextFreeOrderID++;
    }
    
    function confirmShipment(uint id)   {
        if (!isValidOrder(id)){ throw;}
        if(orders[id].orderStatus!=0){throw;}
        if (!(msg.sender==getMarket())) {throw;}
        orders[id].orderStatus = 1;
    }
    
    function confirmDelivery(uint id)   {
        if (!isValidOrder(id)){ throw;}
        if(orders[id].orderStatus!=1){throw;}
        if (msg.sender!=getMarket()) {throw;}
        orders[id].orderStatus = 2;
        listings[orders[id].listingID].salesSuccessful++;
        listings[orders[id].listingID].lastsuccessfulSale = now;
    }
    
    function disputeOrder(uint id)   {
        if (!isValidOrder(id)){ throw;}
        if(orders[id].orderStatus!=1){throw;}
        if (msg.sender!=getMarket()) {throw;}
        
        orders[id].orderStatus = 3;
        listings[orders[id].listingID].salesDisputed++;
        
    }
    
    function abortOrder(uint id)   {
    	if (!isValidOrder(id)){ throw;}
        if(orders[id].orderStatus!=0){throw;}
        if (msg.sender!=getMarket()) {throw;}
    	orders[id].orderStatus = 4;
    	
    
    }
    

}