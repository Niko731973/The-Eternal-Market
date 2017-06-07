//initializes databses
loadSellerOrders = function(){
OrdersDB._collection.remove({});

	var num_orders = EM.nextOrderID();
      
        for(i=1;i<num_orders; i++) {
			var r = DB.getOrder(i);
			//only load orders sold by the seller. only load orders which are not completed, disputed, or aborted
        if(r[1]==web3.eth.accounts[0] && Number(r[5])<=1){
			var temp = {buyer : r[0] ,seller : r[1] ,shippingAddress : r[2] ,contractAddress : r[3] ,listingID : Number(r[4]) ,orderStatus : Number(r[5]) ,timeListed : r[6]*1000, title : ListingsDB.findOne({listingID : Number(r[4])}).title, price : Number(web3.fromWei(web3.eth.getBalance(r[3]), "ether")), orderID : i };
			OrdersDB._collection.insert(temp);
}}
}

loadActiveListings = function(){
ListingsDB._collection.remove({});

var num_listings = Number(EM.nextListingID());

//seller,title,listingDescription,publicKey,price,timeListed,salesSuccessful,salesDisputed,lastsuccessfulSale,enabled
    
    	for(i=1;i<num_listings; i++) {
    	     var r = DB.getListing(i);
    	     if(r[9]==true){
	     	 var successRate = Math.round(Number(r[6])*100/(Number(r[6])+Number(r[7])))+'%';
	     	 var date_last_sucess;
    	     if(r[6]==0){ date_last_sucess = 'NaN';} else { date_last_sucess = new Date(r[8]*1000).toISOString().slice(0, 10);}
    	     var time_created= new Date(r[5]*1000).toISOString().slice(0,10);
             var temp = {seller : r[0] , title : r[1] , listingDescription : r[2] , publicKey : r[3],price : Number(r[4]), timeListed : time_created,salesSuccessful : Number(r[6]),salesDisputed : Number(r[7]),lastsuccessfulSale : date_last_sucess,enabled : r[9],successRate : successRate, listingID : i};

    	     ListingsDB._collection.insert(temp);
    	   }
    	}

	
}

loadBuyerOrders = function(){
OrdersDB._collection.remove({});

	var num_orders = EM.nextOrderID();
      
        for(i=1;i<num_orders; i++) {
			var r = DB.getOrder(i);
			//only load pending orders the buyer was involved in
			if( r[0] == web3.eth.accounts[0] && Number(r[5])<=1){
			var temp = {buyer : r[0] ,seller : r[1] ,shippingAddress : r[2] ,contractAddress : r[3] ,listingID : Number(r[4]) ,orderStatus : Number(r[5]) ,timeListed : r[6]*1000, title : ListingsDB.findOne({listingID : Number(r[4])}).title, price : Number(web3.fromWei(web3.eth.getBalance(r[3]), "ether")), orderID : i  };
			OrdersDB._collection.insert(temp);
}
}
}

loadProposals = function(){
ProposalsDB._collection.remove({});

	var num_proposals = Number(CM.getProposalsLength());
	for(i=0;i<num_proposals;i++){
		var r = CM.getProposal(i);
		//only pull proposals which are not executed, and not expired
		if(!r[5]&& (true)){
		var temp = {action : r[0] , timeListed : r[1]*1000 , reason : r[2] , newAdd : r[3] , listing_id : r[4] , executed : r[5], id: i};
		ProposalsDB._collection.insert(temp);
		}
	}

}

