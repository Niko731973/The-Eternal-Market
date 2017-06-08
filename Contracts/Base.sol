pragma solidity ^0.4.2;

contract Base{

	/* Addresses of the smart contracts which make up the market */	
    address public market;    
	address public community;
	address public database;
	
	/* The entity in charge of instantiating the first contracts for TEM */
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