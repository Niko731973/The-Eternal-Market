pragma solidity ^0.4.2;
import "Market.sol";

contract Community{

	/* The Eternal Address of the Market */
    address public eternalAddress = '0x06eCea90E03cA3474c5626837918253eEc96F5d0';

	/* Contract variables */

    mapping (address => uint256) public shares;				// array representing the shares an address owns
    uint public sharesOutstanding;							// number of outstanding shares
	Proposal[] public proposals;							// list of proposals
	uint timeCreated;										// time and date this contract was created
	uint public offeringPrice;								// initial offering price for a share
	address  wizard;										// instantiator of the community
	bool public ICO_enabled;								// Is the initial coin offering active?
	uint public proposalWaitTime = 1 days;					// How long does a proposal have to be executed?
	
	
	/* A proposal can be voted on by any shareholder*/
	struct Proposal {
		uint action;     		// Possible codes are: 1 change market, 2 change database, 3 change community, 4 remove listing 
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
	
		if(proposalID<0 || proposalID>=proposals.length){ throw; }
		_;
	}
	
	
	event Transfer(address from, address to, uint256 value);
	event Action(string action);
	
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
    
    
function getProposal(uint id) constant returns(uint, uint, string, address, uint, bool){
		Proposal p = proposals[id];
		return(p.action,p.timeCreated,p.reason,p.newAdd,p.listing_id,p.executed);
	}

	function hasVotedOn(uint propID) constant onlyValidProposals(propID) returns (bool){
		return	proposals[propID].voted[msg.sender];
	}

function currentVotingResults(uint propID) constant onlyValidProposals(propID) returns (uint,uint){
	uint yesVotes = 0;
	Proposal p = proposals[propID];	
	
	uint voteLen = p.votes.length;
	for(uint i = 0;i<voteLen;i++){
		yesVotes+=shares[p.votes[i]];
	}
	
	return (yesVotes,sharesOutstanding);
	
}

/* Buying and Selling Shares 
	Anyone may purchase shares in the market. During the ICO share pricecs are fixed,
	after the ICO period has ended share prices are free-floating. */


	/* Initial Coin Offering allows purchase of shares at a fixed price */
    function ICO() payable returns (uint){
    if(!ICO_enabled){throw;}
    uint amount = msg.value / offeringPrice;          // calculates the amount
    sharesOutstanding += amount;                      // adds the number of shares created
    shares[msg.sender] += amount;                     // adds the amount to buyer's balance
    Transfer(this, msg.sender, amount);               // execute an event reflecting the change
    return amount;                                    // ends function and returns
}
    
 
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
          share dilution. */
function buy() payable returns (uint){
    if(ICO_enabled){throw;}
    uint amount = msg.value / sharePrice();           // Number of shares to be purchased
    amount = (amount*99)/100;					      // 1% purchase fee (as a reduction of shares transferred)
    sharesOutstanding += amount;                      // increments the number of shares outstanding
    shares[msg.sender] += amount;                     // assigns the shares to the buyer
    Transfer(this, msg.sender, amount);               // execute an event reflecting the change
    return amount;                                    // ends function and returns
}

/* Shares may be sold at the market price after ICO has ended. No fees are charged,
	the seller will always recieve market value for their shares */
function sell(uint amount) returns (uint revenue){
	if(ICO_enabled){throw;}
	if (shares[msg.sender] < amount ){ throw;}       // checks if the sender has enough to sell
    shares[msg.sender] -= amount;                    // subtracts the amount from seller's balance
    sharesOutstanding -= amount;                     // removes the shares from circulation
    revenue = (amount * this.balance)/(sharesOutstanding+amount); //Exact market value of their shares prior to decrement
    if (!msg.sender.send(revenue)) {                 // then ether to the seller: Last functions prevent recursion attacks
        throw;                                       
    } else {
        Transfer(msg.sender, this, amount);          
        return revenue;                              
    }
}

/* Shareholder Functions */

/* Collects profits from the market @contract_address and which transfers them to the community,
	increasing the value of each share */
function collectProfits(address contract_address) onlyShareholders{
    	Market m = Market(contract_address);
    	m.getProfits();
    }
    
/* Any member can propose to remove a listing. Only the instantiator can propose a shift in addresses */
function propose(uint action, string reason, address newAdd, uint listing) onlyShareholders{
    if(action<1||action>4){throw;}					//Only valid proposal actions are allowed
    if(action!=4 && msg.sender!=wizard){throw;}		//Only the instantiator can propose to change the contract addresses
	uint id = proposals.length++;
	Proposal p = proposals[id];
	p.action=action;
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
	
		if      (p.action==1){ b.changeMarketAddress(p.newAdd); }
		else if (p.action==2){ b.changeDatabaseAddress(p.newAdd);}
		else if (p.action==3){ b.changeCommunityAddress(p.newAdd);}
		else if (p.action==4){
		address market_address = b.market();
		Market m = Market(market_address);
		m.removeListing(p.listing_id);
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