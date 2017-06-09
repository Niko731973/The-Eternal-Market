pragma solidity ^0.4.2;

contract Order {

	/* The Eternal Address of the Market */
	
    address public seller;
    address public buyer;
    uint public listingID;
    string public shippingAddress;
    address market;
    uint public timeTracker;   // time the contract was created. if delivery was successful or disputed this shows the time feedback was issued instead
    uint public state;          // 0 unconfirmed, 1 shipped, 2 successful, 3 disputed, 4 aborted
    string public feedback;

    function Order(address _buyer, address _seller, uint _listingID, string _shippingAddress, address _market) payable {
        
        buyer = _buyer;
        seller = _seller;
        timeTracker = now;
        listingID = _listingID;
        shippingAddress = _shippingAddress;
        market = _market;
        
    }
    
    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    

    /// The purchase can be aborted by the seller before they confirm shipment. 
    /// The purchase can also be aborted by the buyer if the seller has not responded within three days.
    
    function abort() {
    	require(state == 0);
    	require( (msg.sender==seller) || (msg.sender==buyer && now> (timeTracker + (3 days))) );
        state = 4;
        buyer.transfer(this.balance);
    }

    /// Seller confirms shipment of the order.
    /// The ether will be Shipped until confirmReceived
    /// is called, or a dispute arises.
    function confirmShippment() {
		require(msg.sender == seller);
		require(state == 0);
		        
        state = 1;
        
    }
        
    /// Confirm that you (the buyer) received the item.
    /// This will release the Shipped ether to the seller.
    function confirmDelivery(string _feedback) {
    	require(msg.sender == buyer);
    	require(state == 1);
        state = 2;
        seller.transfer(this.balance);    
        feedback = _feedback;
        timeTracker = now;
    }
    
    ///If for whatever reason the seller is incapicatated and the contract is not disputed, after 12 weeks
    ///any user can trigger release of the funds. the funds are split 50/50 between
    /// the buyer and seller.
    function recoverFunds()     {	
        require(now>(timeTracker+(12 weeks))); //DISABLE
    	require(state == 1 );
        seller.transfer(this.balance);
    }
    
    //only the buyer can dispute an order, they must wait at least three weeks before doing so.
    //funds are transfered to the market
    function dispute(string _feedback) {	
    	require(msg.sender==buyer);
    	require(state == 1);
        require(now> (timeTracker+(3 weeks)));
            state = 3;
            market.transfer(this.balance);    
            feedback = _feedback;
            timeTracker = now;
       
    }
    function getState() constant returns(uint){
        return state;
    }
    
    function() payable { }
}
