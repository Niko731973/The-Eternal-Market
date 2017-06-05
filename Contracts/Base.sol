pragma solidity ^0.4.2;

contract Base{

		
    address public market;    //points to the most recent version of the marketplace contract
	address public community;
	address public database;
	bool firstTimeSetup;
	
	function Base(){
	    firstTimeSetup = true;
	}
	
	function getMarket() constant returns (address){
		return market;
	}
	
	function getCommunity() constant returns (address){
		return community;
		}
	
	function getDatabase() constant returns (address){
		return database;
		}
	
    function changeMarketAddress(address _market) {
    market = _market;
    }
    
    function changeCommunityAddress(address _community) {
    community = _community;
    }
    
    function changeDatabaseAddress(address _database) {
    database = _database;
    }
    
    function setUp(address _m, address _d, address _c){
    	if(!firstTimeSetup){throw;}
    	firstTimeSetup = false;
    	
    	market = _m;
    	database = _d;
    	community = _c;
    }
    
    
    

}