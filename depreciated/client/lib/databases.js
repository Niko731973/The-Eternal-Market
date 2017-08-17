//initializes databses
loadSellerOrders = function(){
OrdersDB._collection.remove({});

	var num_orders = EM.nextFreeOrderID();
   
      
        for(i=1;i<num_orders; i++) {
			var orderAddress = EM.orders(i);
			var order = order_contract.at(orderAddress)
				//only load orders sold by the seller. only load orders which are not completed, disputed, or aborted
        console.log(order);
        if(order.seller()==web3.eth.accounts[0] && Number(order.state())<2){
			var temp = {buyer : order.buyer() ,seller : order.seller() ,shippingAddress : order.shippingAddress() ,contractAddress : orderAddress ,listingID : Number(order.listingID()) ,orderStatus : Number(order.state()) ,timeListed : order.timeTracker()*1000, title : ListingsDB.findOne({listingID : Number(order.listingID())}).title, price : Number(web3.fromWei(web3.eth.getBalance(orderAddress), "ether")), feedback: order.feedback(), orderID : i };
			OrdersDB._collection.insert(temp);
}}
}

loadAllListings = function(){
ListingsDB._collection.remove({});

var num_listings = Number(EM.nextFreeListingID());
    	for(i=1;i<num_listings; i++) {
    	     var r = EM.listings(i);
    	     
    	     var stats = EM.getStats(i); //(successes, disputes, abortions)
	     	 var successRate = Math.round(Number(stats[0])*100/(Number(stats[0])+Number(stats[1])))+'%';
	     	 var time_created= new Date(r[5]*1000).toISOString().slice(0,10);
             var temp = {seller : r[0] , title : r[1] , listingDescription : r[2] , publicKey : r[3],price : Number(r[4]), timeListed : time_created, enabled : r[6], salesSuccessful : Number(stats[0]),salesDisputed : Number(stats[1]),abortedOrders : Number(stats[2]), enabled : r[9],successRate : successRate, listingID : i};

    	     ListingsDB._collection.insert(temp);
    	   
    	}

	
}

loadBuyerOrders = function(){
OrdersDB._collection.remove({});

	var num_orders = EM.nextFreeOrderID();
   
      
        for(i=1;i<num_orders; i++) {
			var orderAddress = EM.orders(i);
			var order = order_contract.at(orderAddress)
				//only load orders purchased by the current addresss. only load orders which are not completed, disputed, or aborted
        
        if(order.buyer()==web3.eth.accounts[0] && Number(order.state())<2){
			var temp = {buyer : order.buyer() ,seller : order.seller() ,shippingAddress : order.shippingAddress() ,contractAddress : orderAddress ,listingID : Number(order.listingID()) ,orderStatus : Number(order.state()) ,timeListed : order.timeTracker()*1000, title : ListingsDB.findOne({listingID : Number(order.listingID())}).title, price : Number(web3.fromWei(web3.eth.getBalance(orderAddress), "ether")), feedback: order.feedback(), orderID : i };
			OrdersDB._collection.insert(temp);
}}
}

loadProposals = function(){
ProposalsDB._collection.remove({});

	var num_proposals = Number(CM.nextFreeProposalID());
	for(i=1;i<num_proposals;i++){
		var r = CM.proposals(i);
		//only pull proposals which are not executed, and not expired
		if(!r[5]&& (true)){
		var temp = {action : r[0] , timeListed : r[1]*1000 , reason : r[2] , newAdd : r[3] , listing_id : r[4] , executed : r[5], id: i};
		ProposalsDB._collection.insert(temp);
		}
	}

}

//returns a collection with feedback from a listing given the listing ID
feedbackScraper = function(ListingID){
FeedbackDB._collection.remove({});
var num_orders = EM.nextFreeOrderID();
   
      
        for(i=1;i<num_orders; i++) {
			var orderAddress = EM.orders(i);
			var order = order_contract.at(orderAddress)
				//only load orders with feedback that match the listing ID by the current addresss. only load orders which are not completed, disputed, or aborted
        
        if(order.listingID()==ListingID && order.feedback() !=""){
			var temp = {orderStatus : Number(order.state()) ,timeListed : order.timeTracker()*1000, feedback: order.feedback()};
			FeedbackDB._collection.insert(temp);
}}

}