
    //only show the sell page if we have a connected account
    if(accounts.length>0){
        //adds a "new listing" button to the page
        document.getElementById("new_listing_button").innerHTML = '<button onclick="location.href=\'new_listing.html\'" type="button">Create New Listing</button>';

        //view pending orders
        var orders = EV.nextOrderID();
        var my_orders = [];
        for(i=1;i<orders; i++) {
        	var temp = DB.getOrder(i);

        	//only show orders involving the seller
        	var seller = temp[1];
        	if(seller == accounts[0]){
        	var date_created = new Date(temp[6]*1000).toISOString();
        	var order_add = temp[4];
        	var listing = DB.getListing(Number(order_add));
        	var title = listing[1]; 
        	var deliver = temp[2];
        	var contractadd = temp[3];
        	var orderStatus = temp[5];
        	var money = web3.fromWei(web3.eth.getBalance(contractadd), "ether"); 
        	my_orders.push([date_created,money,title,deliver,orderStatus,i,temp[6]*1000]);
        }

	    }
    
        //builds the table of current orders
        $(document).ready(function() {
        $('#orders').DataTable( {
            destroy: true,
            data: my_orders,
            columns: [
                { title: "Date Created" },
                { title: "Ether" },
                { title: "Listing Title" },
                { title: "Delivery Info" },
                { title: "Status" },
                { title: "Order ID"},
                { title: "Date Placed"}
            ],
         "columnDefs": [
                 {
                    //creates a link to the specific listing
                    "render": function ( data, type, row ) {
                        if(row[4]==0){
                        
                        return '<button onclick=confirmShipment('+row[5]+') type="button">'+getOrderState(data)+'</button> or <button onclick=abortOrder('+row[5]+') type="button">Cancel Order</button>';
                    	}
                    	return getOrderState(row[4]);
                    
                    },
                    "targets": 4
                },{
                    //hides the listing ID from our table
                    "targets": [ 5,6 ],
                    "visible": false,
                    "searchable": false
                }
        ]
        });});

        //display current listings
        var num_listings = EV.nextListingID();
    	var arr = [];
    	for(i=1;i<num_listings; i++) {
    	     var r = DB.getListing(i);
    	     
    	     //only show listings the seller created, and which are active
    	     if(r[0] == accounts[0] && r[9]===true){
    	     var date_formatted = new Date(r[5]*1000).toISOString().slice(0, 10);
    	     arr.push([r[1],r[4],r[6],r[7],date_formatted,i]);
    	}}
	
    	//builds our table of current listings
        $(document).ready(function() {
        $('#listings').DataTable( {
            destroy: true,
            data: arr,
            columns: [
                { title: "Title" },
                { title: "Price" },
                { title: "Successful Sales" },
                { title: "Disputed Sales" },
                { title: "Date Created" },
                { title: "Listing ID"}
            ],
         "columnDefs": [
                 {
                    //creates a link to the specific listing
                    "render": function ( data, type, row ) {
                        return '<a href="listing.html?id=' + row[3] + '">'+ data + '</a>';
                    },
                    "targets": 0
                },{
                    //hides the listing ID from our table
                    "targets": [ 5 ],
                    "visible": false,
                    "searchable": false
                },{
                //builds a link for the title column that points to our specific listing
                "render": function ( data, type, row ) {
                    return '$'+row[1];
                },
                "targets": 1
            }
        ]
        });});
    }
    
    
    

//returns the state of an order as a string, given the int value of the state of the purchase contract
function getOrderState(state){
	
	if(state == 0){ return  "Confirm Shipment";}
	if(state == 1){ return  "Awaiting Delivery Confirmation";}
    if(state == 2){ return  "Delivered Successfully";}
    if(state == 3){ return  "Disputed";}
	return -1;
}

    