pragma solidity ^0.4.2;
import "Base.sol";

contract Purchase {

    address public seller;
    address public buyer;
    uint creationTime;
    address eternalAddress;
    
    enum State { Created, Locked, Inactive, Disputed }
    State public state;

    function Purchase(address _buyer, address _seller,address _eternalAddress) payable {
        
        buyer = _buyer;
        seller = _seller;
        eternalAddress = _eternalAddress;
        creationTime = now;
        state = State.Created;
    }
    
    function getMarket(){
    
    	Base b = Base(eternalAddress);
		return b.getMarket();
		
    
    }

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require((msg.sender == buyer) || (tx.origin == buyer) || (msg.sender == getMarket()));
        _;
    }

    modifier onlySeller() {
        require((msg.sender == seller)|| (tx.origin == seller)|| (msg.sender == getMarket()));
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
        if(msg.sender==seller || tx.origin == seller || (msg.sender==buyer && now> (creationTime + 3 days)) || (tx.origin==buyer && now> (creationTime + 3 days))) || (msg.sender==getMarket() && now> (creationTime + 3 days)))){
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
    
    ///If for whatever reason the seller is incapicatated and the contract is not disputed, after 12 weeks
    ///any user can trigger release of the funds. the funds are split 50/50 between
    /// the buyer and seller.
    function recoverFunds()
        inState(State.Locked)
    {
        if(now>(creationTime+(12 weeks))){
        state = State.Inactive;
        seller.transfer(this.balance);
        
        }
    }
    
    //only the buyer can dispute an order, they must wait at least three weeks before doing so.
    //funds are transfered to the market
    function dispute()
        inState(State.Locked)
    {
        if(now>(creationTime+ (3 weeks)) && (msg.sender == buyer || tx.origin == buyer)){
            state = State.Disputed;
            Disputed();
            getMarket().transfer(this.balance);
            
        }
    }
    
    function() payable { }
}
