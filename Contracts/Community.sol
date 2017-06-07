pragma solidity ^0.4.2;
import "Market.sol";

contract Community{

	/* Contract variables */

    mapping (address => uint256) public shares;				// array representing the shares an address owns
    uint public sharesOutstanding;							// number of outstanding shares
	address eternalAddress;									// the eternal base address of TEM
	Proposal[] public proposals;							// list of proposals
	uint timeCreated;										// time and date this contract was created
	uint public offeringPrice;										// initial offering price for a share
	address  wizard;										// instantiator of the community
	bool public ICO_enabled;										// Is the initial coin offering active?
	uint public proposalWaitTime = 1 days;					// How long does a proposal have to be executed?
	
	
	/* A proposal can be introduced by any shareholder*/
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
	
	modifier onlyValidProposals(uint proposalID) {
	
		if(proposalID<0 || proposalID>=proposals.length){ throw; }
		_;
	}
	
	
	event Transfer(address from, address to, uint256 value);
	event Action(string action);
	
/* Initializes contract with initial supply tokens to the creator of the contract */
function Community() {
    shares[msg.sender] = 2500;          
    wizard = msg.sender;
    sharesOutstanding = 2500;
    eternalAddress = '0xc00F735869DD637C5AA92e89E124d6A6368Bf702';
    offeringPrice = (1 ether)/5;
    ICO_enabled = true;
}

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

    /* Send coins */
    function transferShares(address _to, uint256 _value) {
        if (shares[msg.sender] < _value) throw;           // Check if the sender has enough
        if (shares[_to] + _value < shares[_to]) throw; // Check for overflows
        
        shares[msg.sender] -= _value;                     // Subtract from the sender
        shares[_to] += _value;         					// Add the same to the recipient
        Transfer(msg.sender,_to,_value);                   
    }
    
    function sharePrice() constant returns (uint){
    	return (this.balance/sharesOutstanding);
    }
    
    function endICO() {
    	if(msg.sender!=wizard){throw;}
    	if(now<(timeCreated+(8 weeks))){throw;}
    	ICO_enabled = false;
    }
    
    function ICO() payable returns (uint){
    if(!ICO_enabled){throw;}
    uint amount = msg.value / offeringPrice;          // calculates the amount
    sharesOutstanding += amount;                      // adds the number of shares created
    shares[msg.sender] += amount;                     // adds the amount to buyer's balance
    Transfer(this, msg.sender, amount);               // execute an event reflecting the change
    return amount;                                    // ends function and returns
}
    
    
function buy() payable returns (uint){
    if(ICO_enabled){throw;}
    uint amount = msg.value / sharePrice();           // Number of shares to be purchased
    amount = (amount*99)/100;					      // 1% purchase fee
    sharesOutstanding += amount;                      // increments the number of shares outstanding
    shares[msg.sender] += amount;                     // assigns the shares to the buyer
    Transfer(this, msg.sender, amount);               // execute an event reflecting the change
    return amount;                                    // ends function and returns
}

function sell(uint amount) returns (uint revenue){
	if(ICO_enabled){throw;}
	if (shares[msg.sender] < amount ){ throw;}       // checks if the sender has enough to sell
    shares[msg.sender] -= amount;                    // subtracts the amount from seller's balance
    sharesOutstanding -= amount;                     // removes the shares from circulation
    revenue = (amount * this.balance)/(sharesOutstanding+amount);
    if (!msg.sender.send(revenue)) {                 // sends ether to the seller: it's important
        throw;                                       // to do this last to prevent recursion attacks
    } else {
        Transfer(msg.sender, this, amount);          // executes an event reflecting on the change
        return revenue;                              // ends function and returns
    }
}

/* collects any profits from the market @ the given address,
which increases the NAV (this.balance), and the value of all the outstanding shares*/

function collectProfits(address contract_address) onlyShareholders{
    	Market m = Market(contract_address);
    	m.getProfits();
    }

function propose(uint action, string reason, address newAdd, uint listing) onlyShareholders{
    if(action<1||action>4){throw;}
    if(action!=4 && msg.sender!=wizard){throw;}
	uint id = proposals.length++;
	Proposal p = proposals[id];
	p.action=action;
	p.timeCreated=now;
	p.reason = reason;
	p.newAdd= newAdd;
	p.listing_id = listing;
	
}

//returns 
function getProposal(uint id) constant returns(uint, uint, string, address, uint, bool){
		Proposal p = proposals[id];
		return(p.action,p.timeCreated,p.reason,p.newAdd,p.listing_id,p.executed);
	}

function voteYes(uint propID) onlyShareholders{
	Proposal p = proposals[propID];
	if(now> (p.timeCreated+( proposalWaitTime)) || p.executed){throw;}
	if(p.voted[msg.sender]){throw;}
	p.voted[msg.sender] = true;
	p.votes.length++;
	p.votes[p.votes.length-1]=msg.sender;
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
	
	return (yesVotes,this.balance);
	
}

function executeProposal(uint propID) onlyValidProposals(propID) returns (bool){
	uint yesVotes = 0;
	Proposal p = proposals[propID];	
	if(now>(p.timeCreated+(proposalWaitTime))){throw;}
	
	uint voteLen = p.votes.length;
	for(uint i = 0;i<voteLen;i++){
		yesVotes+=shares[p.votes[i]];
	}
	
	if (yesVotes>=(this.balance/2)){
		
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

function() payable{}
    
}