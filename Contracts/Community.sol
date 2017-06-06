pragma solidity ^0.4.2;
import "Market.sol";

contract Community{
/* This creates an array with all balances */
    mapping (address => uint256) public shares;
    uint256 public totalShares;
    
	address eternalAddress;
	Proposal[] public proposals;
	uint public nextProposalNumber;
	uint timeCreated;
	uint offeringPrice;
	address  ICOManager;
	bool ICO_enabled;	
	
	//enum for possible actions
	
	struct Proposal {
		uint yesVotes;
		uint dateCreated;
		uint action;     //1 change market, 2 change database, 3 remove listing, 4 update rates, 5 change community
		string reason;
		uint data1;
		uint data2;
		bool executed;
		mapping (address => bool) voted;
		
	}
	
	
	
	modifier onlyShareholders {
		if (shares[msg.sender]==0){ throw;}
		_;
	}
	
	modifier onlyValidProposals(uint proposalID) {
	
		if(proposalID<=0 || proposalID>=nextProposalNumber){ throw; }
		if(proposals[proposalID].yesVotes<(totalShares/2) || now > (proposals[proposalID].dateCreated + (3 days))){throw;}
		_;
	}
	
	
	event Transfer(address from, address to, uint256 value);
	event Action(string action);
	
/* Initializes contract with initial supply tokens to the creator of the contract */
function Community() {
    shares[msg.sender] = 2500;              // Give the founder half of the initial tokens
    
    ICOManager = msg.sender;
   
    totalShares = 2500;
    nextProposalNumber = 1;
    eternalAddress = '0xc00F735869DD637C5AA92e89E124d6A6368Bf702';
    offeringPrice = (1 ether)/5;
    ICO_enabled = true;
}


	function isShareholder(address _address) constant returns (bool){
		if(shares[_address]>0){ return true; }
		return false;
	}

    /* Send coins */
    function transferShares(address _to, uint256 _value) {
        if (shares[msg.sender] < _value) throw;           // Check if the sender has enough
        if (shares[_to] + _value < shares[_to]) throw; // Check for overflows
        
        shares[msg.sender] -= _value;                     // Subtract from the sender
        shares[_to] += _value;         					// Add the same to the recipient
        Transfer(msg.sender,_to,_value);                   
    }
    
    function buyPrice() constant returns (uint){
    	return ((this.balance/totalShares)*(101))/100;
    }
    
    function sellPrice() constant returns (uint){
    	return (this.balance/totalShares);
    }
    
    function endICO() {
    	if(msg.sender!=ICOManager){throw;}
    	if(now<(timeCreated+(8 weeks))){throw;}
    	ICO_enabled = false;
    }
    
    function ICO() payable returns (uint amount){
    if(!ICO_enabled){throw;}
    amount = msg.value / offeringPrice;               // calculates the amount
    if(amount<1){ throw; }							  // minimum buy is at least one share
    shares[msg.sender] += amount;                     // adds the amount to buyer's balance
    totalShares += amount;                            // adds the number of shares created
    Transfer(this, msg.sender, amount);               // execute an event reflecting the change
    return amount;                                    // ends function and returns
}
    
    
    function buy() payable returns (uint amount){
    if(ICO_enabled){throw;}
    
    amount = msg.value / buyPrice();                     // calculates the amount
    if (shares[this] < amount) {throw;  }             // checks if it has enough to sell
    shares[this] -= amount;                         // subtracts amount from seller's balance
    shares[msg.sender] += amount;                   // adds the amount to buyer's balance
    Transfer(this, msg.sender, amount);                // execute an event reflecting the change
    return amount;                                     // ends function and returns
}

function sell(uint amount) returns (uint revenue){
	if (shares[msg.sender] < amount ){ throw;}       // checks if the sender has enough to sell
    shares[msg.sender] -= amount;                   // subtracts the amount from seller's balance
    shares[this] += amount;                         // adds the amount to owner's balance
    revenue = amount * sellPrice();
    if (!msg.sender.send(revenue)) {                   // sends ether to the seller: it's important
        throw;                                         // to do this last to prevent recursion attacks
    } else {
        Transfer(msg.sender, this, amount);             // executes an event reflecting on the change
        return revenue;                                 // ends function and returns
    }
}

function collectProfits(address contract_address) onlyShareholders{
    	Market m = Market(contract_address);
    	m.getProfits();
    }
    

function propose(uint action, string reason, uint data1, uint data2) onlyShareholders{
    if(action<1||action>5){throw;}
	
	proposals.length++;
	proposals[proposals.length-1]= Proposal(shares[msg.sender],now,action,reason,data1, data2, false);
}

function getProposal(uint id) constant returns(uint, uint, uint, string, uint, uint, bool){
		Proposal p = proposals[id];
		return(p.yesVotes,p.dateCreated,p.action,p.reason,p.data1,p.data2,p.executed);
	}

function voteYes(uint propID) onlyShareholders{
	Proposal p = proposals[propID];
	if(now> (p.dateCreated+(3 days)) || p.executed){throw;}
	if(p.voted[msg.sender]){throw;}
	p.voted[msg.sender] = true;
	p.yesVotes+=shares[msg.sender];
}

	function changeMarket(address new_add,uint proposalID) onlyValidProposals(proposalID) {
		if(proposals[proposalID].action!=1){throw;}
		proposals[proposalID].executed = true;
		Base b = Base(eternalAddress);
		b.changeMarketAddress(new_add);
	}
	
	function changeDatabase(address new_add,uint proposalID) onlyValidProposals(proposalID){
	if(proposals[proposalID].action!=2){throw;}
		proposals[proposalID].executed = true;
		Base b = Base(eternalAddress);
		b.changeDatabaseAddress(new_add);
	
	}
		
	
	function removeListing(uint listingID,uint proposalID) onlyValidProposals(proposalID){
	if(proposals[proposalID].action!=3){throw;}
		proposals[proposalID].executed = true;
		Base b = Base(eternalAddress);
		address market_address = b.market();
		Market m = Market(market_address);
		m.removeListing(listingID);
	
	}
	function updateRates(uint order, uint listing,uint proposalID) onlyValidProposals(proposalID){
	if(proposals[proposalID].action!=4){throw;}
		proposals[proposalID].executed = true;
		Base b = Base(eternalAddress);
		address market_address = b.market();
		Market m = Market(market_address);
		m.updateRates(order,listing);
	
	
	}
	
	function changeCommunity(address new_add,uint proposalID) onlyValidProposals(proposalID){
	if(proposals[proposalID].action!=5){throw;}
		if(proposals[proposalID].yesVotes<((totalShares*3)/4)){throw;}
		proposals[proposalID].executed = true;
		Base b = Base(eternalAddress);
		b.changeCommunityAddress(new_add);
	
	}

function() payable{}
    
}