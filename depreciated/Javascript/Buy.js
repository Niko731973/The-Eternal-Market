
	var num_listings = EV.nextListingID();
	
	//pulls all of the listings which are active from the smart contract
	var arr = [];
	for(i=1;i<num_listings; i++) {
		//console.log(DB.getListing(i));
	     var r = DB.getListing(i);
	     var price = r[4];
	     var title = r[1];
	     var salesSuccessful = r[6];
	     var salesDisputed = r[7];
	     //checks to make sure the listing is active
	     if(r[9]==true){
    	     var date_created = new Date(r[5]*1000).toISOString().slice(0, 10);
    	     var date_last_sucess;
    	     if(r[8]==0){ date_last_sucess = 'NaN';} else { date_last_sucess = new Date(r[9]*1000).toISOString().slice(0, 10);}
    	     var sucessRate = Math.round(salesSuccessful/(salesSuccessful+salesDisputed))+'%';
    	     
    	     //date created, price, title, success rate, date of last success, listing ID
    	     arr.push([date_created,price,title,salesSuccessful,sucessRate,date_last_sucess,i]);
		 }
	}
	 
    $(document).ready(function() {
    $('#example').DataTable( {
        destroy: true,
        data: arr,
        columns: [
            { title: "Date Created" },
            { title: "Price" },
            { title: "Listing Title" },
            { title: "Successful Orders" },
            { title: "Success Rate" },
            { title: "Last Successful Sale" },
            { title: "Listing ID"}
        ],
     "columnDefs": [
             {
                //builds a link for the title column that points to our specific listing
                "render": function ( data, type, row ) {
                    return '<a href="listing.html?id=' + row[6] + '">'+ data + '</a>';
                },
                "targets": 2
            },{
                //hides the listing ID# from our table
                "targets": [ 6 ],
                "visible": false,
                "searchable": false
            },{
                //builds a link for the title column that points to our specific listing
                "render": function ( data, type, row ) {
                    return '$'+row[1];
                },
                "targets": 1
            }
    ]});});


