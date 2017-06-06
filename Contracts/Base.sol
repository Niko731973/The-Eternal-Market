pragma solidity ^0.4.2;

contract Base{

		
    address public market;    //points to the most recent version of the marketplace contract
	address public community;
	address public database;
	address wizard;
	bool firstTimeSetup;
	
	function Base(){
	    firstTimeSetup = true;
	    wizard = msg.sender;
	}
	
    function changeMarketAddress(address _market) {
    if(msg.sender!=community){throw;}
    market = _market;
    }
    
    function changeDatabaseAddress(address _database) {
    if(msg.sender!=community){throw;}
    database = _database;
    }
    
    function changeCommunityAddress(address _community) {
    if(msg.sender!=community){throw;}
    	community = _community;
    }
    
    function setUp(address _m, address _d, address _c){
    	if(!firstTimeSetup){throw;}
    	if(msg.sender!=wizard){throw;}
    	firstTimeSetup = false;
    	
    	market = _m;
    	database = _d;
    	community = _c;
    }
    
    
}