//initializes databses
loadDatabases = function(){

OrdersDB = new Mongo.Collection("OrdersDB");
ListingsDB = new Mongo.Collection("ListingsDB"); 
thisListing = {};
var num_listings = Number(EV.nextListingID());

//seller,title,listingDescription,publicKey,price,timeListed,salesSuccessful,salesDisputed,lastsuccessfulSale,enabled
    
    	for(i=1;i<num_listings; i++) {
    	     var r = DB.getListing(i);
	     var successRate = Math.round(r[6]/(r[6]+r[7]))+'%';
	     var date_last_sucess;
    	     if(r[6]==0){ date_last_sucess = 'NaN';} else { date_last_sucess = new Date(r[8]*1000).toISOString().slice(0, 10);}
    	     var time_created= new Date(r[5]*1000).toISOString().slice(0,10);
             var temp = {seller : r[0] , title : r[1] , listingDescription : r[2] , publicKey : r[3],price : Number(r[4]), timeListed : time_created,salesSuccessful : Number(r[6]),salesDisputed : Number(r[7]),lastsuccessfulSale : date_last_sucess,enabled : r[9],successRate : successRate, listingID : i};

    	     ListingsDB._collection.insert(temp);
    	   
    	}

	
	var num_orders = EV.nextOrderID();
      
        for(i=1;i<num_orders; i++) {
        	var temp = DB.getOrder(i);
			var r = DB.getOrder(i);
			var timeListed = new Date(r[6]*1000).toISOString();
			var temp = {buyer : r[0] ,seller : r[1] ,shippingAddress : r[2] ,contractAddress : r[3] ,listingID : Number(r[4]) ,orderStatus : Number(r[5]) ,timeListed : timeListed};
			OrdersDB._collection.insert(temp);
}
	LISTING_ID = 0;
}