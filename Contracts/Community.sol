pragma solidity ^0.4.2;
import "Market.sol";

contract Community{

    mapping (address => uint256) public shares;				// array representing the shares an address owns
    uint public sharesOutstanding;							// number of outstanding shares
	address eternalAddress;									// the eternal base address of TEM
	Proposal[] public proposals;							// list of proposals
	uint public nextProposalNumber;							// the blank index used for the next proposal
	uint timeCreated;										// time and date this contract was created
	uint offeringPrice;										// initial offering price for a share
	address  ICOManager;									// manager of the Initial Coin Offering
	bool ICO_enabled;										// Is the initial coin offering active?
	
	
	/* A proposal can be introduced by any shareholder*/
	struct Proposal {
		uint yesVotes;			// number of yes votes
		uint dateCreated;		// date created
		uint action;     		// Possible codes are: 1 change market, 2 change database, 3 remove listing, 4 update rates, 5 change community
		string reason;			// reason for the proposal
		uint data1;				// fee as a percent on every submitted order, or the listing to be removed
		uint data2;				// fee as a percent on every created listing
		address newAdd;
		bool executed;
		mapping (address => bool) voted;
		
	}
	
	
	
	modifier onlyShareholders {
		if (shares[msg.sender]==0){ throw;}
		_;
	}
	
	modifier onlyValidProposals(uint proposalID) {
	
		if(proposalID<=0 || proposalID>=nextProposalNumber){ throw; }
		if(proposals[proposalID].yesVotes<(sharesOutstanding/2) || now > (proposals[proposalID].dateCreated + (3 days))){throw;}
		_;
	}
	
	
	event Transfer(address from, address to, uint256 value);
	event Action(string action);
	
/* Initializes contract with initial supply tokens to the creator of the contract */
function Community() {
    shares[msg.sender] = 2500;          
    ICOManager = msg.sender;
    sharesOutstanding = 2500;
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
    
    function sharePrice() constant returns (uint){
    	return (this.balance/sharesOutstanding);
    }
    
    function endICO() {
    	if(msg.sender!=ICOManager){throw;}
    	if(now<(timeCreated+(8 weeks))){throw;}
    	ICO_enabled = false;
    }
    
    function ICO() payable returns (uint){
    if(!ICO_enabled){throw;}
    uint amount = msg.value / offeringPrice;          // calculates the amount
    if(amount<1){throw;}							  // must purchase at least one share
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
	if (shares[msg.sender] < amount ){ throw;}       // checks if the sender has enough to sell
    shares[msg.sender] -= amount;                    // subtracts the amount from seller's balance
    sharesOutstanding -= amount;                     // adds the amount to owner's balance
    revenue = amount * sharePrice();
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

/* proposes that the community perform some action. possible actions include:
  1 change market, 2 change database, 3 remove listing, 4 update rates, 5 change community
  @action specifies the action, @reason gives the reason. @data1 & @data2 are used to set the 
  listing and order rates respectivly. @newAdd is used to set the address of community,market, or database location */
function propose(uint action, string reason, uint data1, uint data2, address newAdd) onlyShareholders{
    if(action<1||action>5){throw;}
	
	proposals.length++;
	proposals[proposals.length-1]= Proposal(shares[msg.sender],now,action,reason,data1, data2, newAdd, false);
}

function getProposal(uint id) constant returns(uint, uint, uint, string, uint, uint, address, bool){
		Proposal p = proposals[id];
		return(p.yesVotes,p.dateCreated,p.action,p.reason,p.data1,p.data2,p.newAdd,p.executed);
	}

function voteYes(uint propID) onlyShareholders{
	Proposal p = proposals[propID];
	if(now> (p.dateCreated+(3 days)) || p.executed){throw;}
	if(p.voted[msg.sender]){throw;}
	p.voted[msg.sender] = true;
	p.yesVotes+=shares[msg.sender];
}

	function changeMarket(uint proposalID) onlyValidProposals(proposalID) {
		if(proposals[proposalID].action!=1){throw;}
		proposals[proposalID].executed = true;
		Base b = Base(eternalAddress);
		b.changeMarketAddress(proposals[proposalID].newAdd);
	}
	
	function changeDatabase(uint proposalID) onlyValidProposals(proposalID){
	if(proposals[proposalID].action!=2){throw;}
		proposals[proposalID].executed = true;
		Base b = Base(eternalAddress);
		b.changeDatabaseAddress(proposals[proposalID].newAdd);
	
	}
		
	
	function removeListing(uint proposalID) onlyValidProposals(proposalID){
	if(proposals[proposalID].action!=3){throw;}
		proposals[proposalID].executed = true;
		Base b = Base(eternalAddress);
		address market_address = b.market();
		Market m = Market(market_address);
		Proposal p = proposals[proposalID];
		m.removeListing(p.data1);
	
	}
	function updateRates(uint proposalID) onlyValidProposals(proposalID){
	if(proposals[proposalID].action!=4){throw;}
		proposals[proposalID].executed = true;
		Base b = Base(eternalAddress);
		address market_address = b.market();
		Market m = Market(market_address);
		Proposal p = proposals[proposalID];
		m.updateRates(p.data1,p.data2);
	
	
	}
	
	function changeCommunity(uint proposalID) onlyValidProposals(proposalID){
	if(proposals[proposalID].action!=5){throw;}
		if(proposals[proposalID].yesVotes<((sharesOutstanding*4)/5)){throw;} //note to change the community address over 80% of voters must agree!
		proposals[proposalID].executed = true;
		Base b = Base(eternalAddress);
		b.changeCommunityAddress(proposals[proposalID].newAdd);
	
	}

function() payable{}
    
}