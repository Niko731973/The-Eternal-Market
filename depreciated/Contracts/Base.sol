pragma solidity ^0.4.2;
import "Market.sol";


contract Base{

		
    /* This creates an array with all balances */
    mapping (address => uint256) public shares;
    uint256 public totalShares;
    string public shares_name;
	string public symbol;
	uint8 public decimals;
    address public currentVersion; //points to the most recent version of the marketplace contract
	uint256 public sellPrice;
	uint256 public buyPrice;	
	Proposal[] public proposals;
	uint public proposalNumber;
	
	//enum for possible actions
	
	struct Proposal {
		uint yesVotes;
		uint dateCreated;
		uint action;
		uint data;
	}
	modifier onlyShareholders {
		if (shares[msg.sender]<=0){ throw;}
		_;
	}
	
	modifier onlySuccessfulProposal {
		bool good = false;
		
		for(i=0;i<nextProposalNumber;i++){
			if(msg.sender==proposals[i]){
				if(!good){ throw };
				break;
			}
		}
		_;
	}
	
	event Transfer(address from, address to, uint256 value);
	event Action(string action);
	
/* Initializes contract with initial supply tokens to the creator of the contract */
function Base(uint256 initialSupply, string tokenName, uint8 decimalUnits, string tokenSymbol) {
    balanceOf[msg.sender] = initialSupply/2;              // Give the creator all initial tokens
    name = tokenName;                                   // Set the name for display purposes
    symbol = tokenSymbol;                               // Set the symbol for display purposes
    decimals = decimalUnits;                            // Amount of decimals for display purposes
    totalShares = initialSupply;
    proposalNumber = 0;
    
}

function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyOwner {
    sellPrice = newSellPrice;
    buyPrice = newBuyPrice;
}

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value) throw;           // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) throw; // Check for overflows
        balanceOf[msg.sender] -= _value;                     // Subtract from the sender
        balanceOf[_to] += _value;         					// Add the same to the recipient
        Transfer(msg.sender,_to,_value);                   
    }
    
    
    function buy() payable returns (uint amount){
    amount = msg.value / buyPrice;                     // calculates the amount
    if (balanceOf[this] < amount) throw;               // checks if it has enough to sell
    balanceOf[msg.sender] += amount;                   // adds the amount to buyer's balance
    balanceOf[this] -= amount;                         // subtracts amount from seller's balance
    Transfer(this, msg.sender, amount);                // execute an event reflecting the change
    return amount;                                     // ends function and returns
}

function sell(uint amount) returns (uint revenue){
    if (balanceOf[msg.sender] < amount ) throw;        // checks if the sender has enough to sell
    balanceOf[this] += amount;                         // adds the amount to owner's balance
    balanceOf[msg.sender] -= amount;                   // subtracts the amount from seller's balance
    revenue = amount * sellPrice;
    if (!msg.sender.send(revenue)) {                   // sends ether to the seller: it's important
        throw;                                         // to do this last to prevent recursion attacks
    } else {
        Transfer(msg.sender, this, amount);             // executes an event reflecting on the change
        return revenue;                                 // ends function and returns
    }
}

function propose(uint action) onlyShareholders{

}

function voteYes(uint id){

}


		
	
    function changeMarketAddress(address new_address) onlyShareholders{
    currentVersion = new_address;
    }
    
    
    function harvestProfits(address contract_address){
    	
    	Market m = Market(contract_address);
    	m.transferFunds();
    	
    }
    
    function payDividends() onlyShareholders{
    
    }
    

}