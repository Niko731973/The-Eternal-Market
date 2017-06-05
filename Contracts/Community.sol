pragma solidity ^0.4.2;
import "Market.sol";

contract Community{
/* This creates an array with all balances */
    mapping (address => uint256) public shares;
    uint256 public totalShares;
    string public shares_name;
	string public symbol;
	uint8 public decimals;
	uint public profits;
	address public eternalAddress;
	address[] public roster;
	
	//enum for possible actions
	
	struct Proposal {
		uint yesVotes;
		uint dateCreated;
		uint action;     //1 change market, 2 change database, 3 change community, 4 remove listing, 5 update rates
		string reason;
		uint data1;
		uint data2;
		
	}
	modifier onlyShareholders {
		if (shares[msg.sender]<=0){ throw;}
		_;
	}
	
	modifier onlyValidProposals(uint proposalID) {
	
		if(proposalID<=0 || proposalID>=nextProposalNumber){ throw; }
		if(proposals[proposalID].yesVotes<(totalShares/2) || now > (proposals[proposalID].dateCreated + (3 days))){throw;}
		_;
	}
	
	uint256 public sellPrice;
	uint256 public buyPrice;	
	Proposal[] public proposals;
	uint public nextProposalNumber;
	
	
	event Transfer(address from, address to, uint256 value);
	event Action(string action);
	
/* Initializes contract with initial supply tokens to the creator of the contract */
function Community( address founder,address _eternalAddress) {
    shares[founder] = 5000;              // Give the founder half of the initial tokens
    shares_name = "Eternal Market Shares";           // Set the name for display purposes
   
    decimals = 2;                // Amount of decimals for display purposes
    totalShares = 10000;
    nextProposalNumber = 1;
    eternalAddress = _eternalAddress;
    roster.push(founder);
}

	function isShareholder(address _address) constant returns (bool){
		if(shares[_address]>0){ return true; }
		return false;
	}

function setPrices(uint256 newSellPrice, uint256 newBuyPrice) {
    sellPrice = newSellPrice;
    buyPrice = newBuyPrice;
}

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        if (shares[msg.sender] < _value) throw;           // Check if the sender has enough
        if (shares[_to] + _value < shares[_to]) throw; // Check for overflows
        shares[msg.sender] -= _value;                     // Subtract from the sender
        shares[_to] += _value;         					// Add the same to the recipient
        Transfer(msg.sender,_to,_value);                   
    }
    
    
    function buy() payable returns (uint amount){
    amount = msg.value / buyPrice;                     // calculates the amount
    if (shares[this] < amount) throw;               // checks if it has enough to sell
    shares[msg.sender] += amount;                   // adds the amount to buyer's balance
    shares[this] -= amount;                         // subtracts amount from seller's balance
    Transfer(this, msg.sender, amount);                // execute an event reflecting the change
    return amount;                                     // ends function and returns
}

function sell(uint amount) returns (uint revenue){
    if (shares[msg.sender] < amount ) throw;        // checks if the sender has enough to sell
    shares[this] += amount;                         // adds the amount to owner's balance
    shares[msg.sender] -= amount;                   // subtracts the amount from seller's balance
    revenue = amount * sellPrice;
    if (!msg.sender.send(revenue)) {                   // sends ether to the seller: it's important
        throw;                                         // to do this last to prevent recursion attacks
    } else {
        Transfer(msg.sender, this, amount);             // executes an event reflecting on the change
        profits+= amount*(sellPrice - buyPrice);
        return revenue;                                 // ends function and returns
    }
}

function collectProfits(address contract_address){
    	
    	Market m = Market(contract_address);
    	m.getProfits();
    	//IF transaction was successful, increment profits
    	//otherwise throw
    	
    }
    
    function payDividends(){
    uint length = roster.length;
    uint starting_profits = profits;
    for(uint i = 0;i<length;i++){
    	if(shares[roster[i]]>0){
    		roster[i].transfer(starting_profits*shares[roster[i]]/totalShares);
    	}
    }
    	profits = 0;
    }
    

function propose(uint action, string reason, uint data1, uint data2) onlyShareholders{
    if(action<1||action>5){throw;}
	
	proposals.length++;
	proposals[proposals.length-1]= Proposal(shares[msg.sender],now,action,reason,data1, data2);
}

function voteYes(uint id) onlyShareholders{
	
}

	function changeMarket(address new_add,uint proposalID) onlyValidProposals(proposalID) {
		if(proposals[proposalID].action!=1){throw;}
		Base b = Base(eternalAddress);
		b.changeMarketAddress(new_add);
	}
	function changeDatabase(address new_add,uint proposalID) onlyValidProposals(proposalID){
	if(proposals[proposalID].action!=2){throw;}
		Base b = Base(eternalAddress);
		b.changeDatabaseAddress(new_add);
	
	}
	function changeCommunity(address new_add,uint proposalID) onlyValidProposals(proposalID){
	if(proposals[proposalID].action!=3){throw;}
		Base b = Base(eternalAddress);
		b.changeCommunityAddress(new_add);
	
	}
	function removeListing(uint listingID,uint proposalID) onlyValidProposals(proposalID){
	if(proposals[proposalID].action!=4){throw;}
		Base b = Base(eternalAddress);
		address market_address = b.getMarket();
		Market m = Market(market_address);
		m.removeListing(listingID);
	
	}
	function updateRates(uint order, uint listing,uint proposalID) onlyValidProposals(proposalID){
	if(proposals[proposalID].action!=5){throw;}
		payDividends();
		Base b = Base(eternalAddress);
		address market_address = b.getMarket();
		Market m = Market(market_address);
		m.updateRates(order,listing);
	
	
	}

function() payable{}
    
}