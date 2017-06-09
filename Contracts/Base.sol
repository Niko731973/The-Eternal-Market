pragma solidity ^0.4.2;

contract Base{

    address public market;          // Current location of the market contract
	address public community;       // Current location of the community contract
	address wizard;                 // Instantiator of TEM
	bool firstTimeSetup;            // Used to setup TEM
	
	function Base(){
	    firstTimeSetup = true;
	    wizard = msg.sender;
	}
	
    function changeMarketAddress(address _market) {
    if(msg.sender!=community){throw;}
    market = _market;
    }
    
    function changeCommunityAddress(address _community) {
    if(msg.sender!=community){throw;}
    	community = _community;
    }
    
    function setUp(address _m, address _c){
    	if(!firstTimeSetup){throw;}
    	if(msg.sender!=wizard){throw;}
    	firstTimeSetup = false;
    	
    	market = _m;
    	community = _c;
    }
    
    
}