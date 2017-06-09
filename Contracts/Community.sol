pragma solidity ^0.4.2;
import "Market.sol";

contract Community{

	/* The Eternal Address of the Market */
    address eternalAddress;

	/* Contract variables */

    mapping (address => uint256) public shares;				// array representing the shares an address owns
    enum Propose { none, removeListing, changeMarket, changeCommunity }
    uint public sharesOutstanding;							// number of outstanding shares
	Proposal[] public proposals;							// list of proposals
	uint timeCreated;										// time and date this contract was created
	uint public offeringPrice;								// initial offering price for a share
	address wizard;										    // instantiator of the community
	bool public ICO_enabled;								// Is the initial coin offering active?
	uint public proposalWaitTime = 1 days;					// How long does a proposal have to be executed?
	
	
	/* A proposal can be voted on by any shareholder*/
	struct Proposal {
		Propose action;     	// Proposed action 
		uint timeCreated;		// time of creation
		string reason;			// reason for the proposal
		address newAdd;			// used to set a new address for the database, market, or community
		uint listing_id;		// used to remove a listing
		bool executed; 			// has the thing been executed
		address[] votes;
		mapping (address => bool) voted;
	}
	
	
	modifier onlyShareholders {
		if (shares[msg.sender]==0){ throw;}
		_;
	}
	
	// Makes sure we do not go out of bounds when checking a proposal ID
	modifier onlyValidProposals(uint proposalID) {
	
		if(proposalID<1 || proposalID>=proposals.length){ throw; }
		_;
	}
	
	
	event Transfer(address from, address to, uint256 value);
	event Action(string action);
	
	function Community(address _eternal){
	    eternalAddress = _eternal;
	
	}
	
/* Initializes contract with initial supply tokens to the instantiator of the contract */
function Community() {  
    wizard = msg.sender;
    shares[wizard] = 2500;        
    sharesOutstanding = 2500;
    offeringPrice = (1 ether)/5;
    ICO_enabled = true;
}

/* Constant Functions */

function getProposalsLength() constant returns (uint){
		return proposals.length;
	}

	function isShareholder(address _address) constant returns (bool){
		if(shares[_address]>0){ return true; }
		return false;
	}
	
	function sharesOwned(address _address) constant returns (uint){
		return shares[_address];
	}
	
	
    function sharePrice() constant returns (uint){
    	return (this.balance/sharesOutstanding);
    }
  
	function hasVotedOn(uint id) constant onlyValidProposals(id) returns (bool){
		return	proposals[id].voted[msg.sender];
	}

function currentVotingResults(uint id) constant onlyValidProposals(id) returns (uint,uint){
	uint yesVotes = 0;
	Proposal p = proposals[id];	
	
	uint voteLen = p.votes.length;
	for(uint i = 0;i<voteLen;i++){
		yesVotes+=shares[p.votes[i]];
	}
	
	return (yesVotes,sharesOutstanding);
	
}

/* Buying and Selling Shares */


	
 
    /* Transfer your shares to another address */
    function transferShares(address _to, uint256 _value) {
        if (shares[msg.sender] < _value) throw;           	// Check if the sender has enough
        if (shares[_to] + _value < shares[_to]) throw; 		// Check for overflows
        shares[msg.sender] -= _value;                       // Subtract from the sender
        shares[_to] += _value;         					    // Add the same to the recipient
        Transfer(msg.sender,_to,_value);                   
    }
       
       /* Shares may be purchased at the market price after ICO has ended.
          A 1% fee on purchases is levied against buyers as compensation for
          share dilution. Shares purchased during the ICO are issued at a fixed
          price and not subjected to any purchase fee*/
function buy() payable returns (uint){
    uint amount;
    if(ICO_enabled){
        amount = msg.value/offeringPrice;             //ICO price is fixed
    }
    else{
        amount = msg.value / sharePrice();           // Normal purchase is floating market rate
        amount = (amount*99)/100;					 // 1% purchase fee (as a reduction of shares transferred)
    }
    
    sharesOutstanding += amount;                      // increments the number of shares outstanding
    shares[msg.sender] += amount;                     // assigns the shares to the buyer
    Transfer(this, msg.sender, amount);               // execute an event reflecting the change
    return amount;                                    // ends function and returns
}

/* Shares may be sold at the market price after ICO has ended. No fees are charged,
	the seller will always recieve market value for their shares */
function sell(uint amount) returns (uint revenue){
	if(ICO_enabled){throw;}                                         // No selling during ICO period allowed
	if (shares[msg.sender] < amount ){ throw;}                      // checks if the sender has enough to sell
    shares[msg.sender] -= amount;                                   // subtracts the amount from seller's balance
    sharesOutstanding -= amount;                                    // removes the shares from circulation
    revenue = (amount * this.balance)/(sharesOutstanding+amount);   //Exact market value of their shares prior to decrement
    if (!msg.sender.send(revenue)) {                                // then ether to the seller: Last functions prevent recursion attacks
        throw;                                       
    } else {
        Transfer(msg.sender, this, amount);          
        return revenue;                              
    }
}

/* Shareholder Functions */

    
/* Any member can propose to remove a listing. Only the instantiator can propose a shift in addresses */
function propose(uint action, string reason, address newAdd, uint listing) onlyShareholders{
    if(action<1||action>3){throw;}					//Only valid proposal actions are allowed
    if(action == 1 && msg.sender!=wizard ){throw;}		//Only the instantiator can propose to change the addresses of the market
	uint id = proposals.length++;
	Proposal p = proposals[id];
	p.action=Propose(action);
	p.timeCreated=now;
	p.reason = reason;
	p.newAdd= newAdd;
	p.listing_id = listing;
	
}

/* Votes Yes for the proposal @propID */
function voteYes(uint propID) onlyShareholders{
	Proposal p = proposals[propID];
	if(now> (p.timeCreated+( proposalWaitTime)) || p.executed){throw;}	//Can only vote on proposals within the allowed period which are not already executed
	if(p.voted[msg.sender]){throw;}										//Can not vote more than once
	p.voted[msg.sender] = true;
	p.votes.length++;
	p.votes[p.votes.length-1]=msg.sender;								//Add this addresses to the voted array
}

/* Tallies the votes for a propsal and executes it if at least 50% of outstanding shares voted yes */
function executeProposal(uint propID) onlyValidProposals(propID) returns (bool){
	uint yesVotes = 0;
	Proposal p = proposals[propID];	
	if(now>(p.timeCreated+(proposalWaitTime))){throw;}		//can only execute proposals within the allowed time
	
	uint voteLen = p.votes.length;
	for(uint i = 0;i<voteLen;i++){
		yesVotes+=shares[p.votes[i]];						//tallies votes
	}
	
	if (yesVotes>=(sharesOutstanding/2)){					//executes proposal if 50%> outstanding shares voted yes
		
		Base b = Base(eternalAddress);
		
		if (p.action == Propose.removeListing){
		    
    		address market_address = b.market();
		    Market m = Market(market_address);
		    m.removeListing(p.listing_id);}
		
		else if(p.action==Propose.changeMarket){ 
		    b.changeMarketAddress(p.newAdd); }
		else if (p.action==Propose.changeCommunity){ 
		    b.changeCommunityAddress(p.newAdd);
		}
	return true;
	}
	return false;
}

/* Administrative functions only the instantiator can perform */

    /* End the ICO period after a fixed number of weeks, which allows free buying/selling
       of shares at the market price */
    function endICO() {
    	if(msg.sender!=wizard){throw;}
    	//if(now<(timeCreated+(8 weeks))){throw;} //remove this line during production
    	ICO_enabled = false;
    }
    
/* The instantiator my delegate to another address */
function transferFounder(address _new){
if(msg.sender!=wizard){throw;}
wizard = _new;
}

function() payable{}
    
}