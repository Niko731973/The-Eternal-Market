   
    //only show the sell page if we have a connected account
    if(accounts.length>0){
        
        //view placed orders
        var orders = EV.nextOrderID();
        var my_orders = [];
        for(i=1;i<orders; i++) {
        	var temp = DB.getOrder(i);

        	//only show orders involving the buyer which are "created, shipped, or disputed"
        	var buyer = temp[0];
        	if(buyer == accounts[0] && temp[5]!= 2){
        	var date_created = new Date(temp[6]*1000).toISOString().slice(0, 10);
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
                { title: "Order ID"}
            ],
         "columnDefs": [
                 {
                    //creates a link to the specific listing
                    "render": function ( data, type, row ) {
                        if(row[4]==0){
                        var answer = 'Order Placed';
                        //if 3 days have passed also append the following '<button onclick=abortOrder('+row[5]+') type="button">Cancel Order?</button>';
                        return 'Order Placed' ;
                    	}
                    	if(row[4]==1){
                    	//if days have passed also append a button for disputing
                    	return 'Order has Shipped! <button onclick=confirmDelivery('+row[5]+') type="button">Confirm Delivery</button>';
                    	}
                    	//if more than x days have passed don't display it
                    	return 'Disputed';
                    
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

}
