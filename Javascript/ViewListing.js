    //query string specifies what listing to load
    var listing_id = GetQueryStringByParameter("id");
    var r = DB.getListing(listing_id);
    
    //only display the page if the listing is active
    if(r[9]== true){

        var date_created = new Date(r[5]*1000).toISOString().slice(0, 10);
	    var date_last_sucess;
	    if(r[8]==0){ date_last_sucess = 'NaN';} else { date_last_sucess = new Date(r[9]*1000).toISOString().slice(0, 10);}
	    var sucessRate = Math.round(r[6]/(r[7]+r[6]))+'%';
        document.getElementById("_title").innerHTML = r[1] ;
        document.getElementById("_description").innerHTML = r[2];
        document.getElementById("listing_info").innerHTML = 'Price: $'+r[4]+'<br>'+ 'Successful Sales: '+r[6]+', Success Rate: '+sucessRate+', Last Successful Sale: '+date_last_sucess+'<br><br>Seller Public Key<br><textarea rows="4" cols="50" readonly>'+r[3]+'</textarea><br><br>';
        
        //creates a button to place an order (if the user is not the seller of the listing)
        //or creates a button to remove the listing (if the user is the seller of the listing)
        //if the listing is a bad actor (dispute ratio too high), provides a button so anyone can remove the listing
        var b = document.createElement("BUTTON");
        if(accounts[0]==r[0]){
            //user is the seller, create a "remove listing" button

            var t = document.createTextNode("Remove Listing");       
            b.appendChild(t);                                
            document.body.appendChild(b);                    
            b.onclick = function() { 
                var conf = confirm("Are you sure you would like to remove this listing?");
                if(conf==true){
                removeListing(listing_id);
                }
            };

        }
        else{
            //user is not the seller, create a "place order" button
            var t2 = document.createTextNode("Place Order");       
            b.appendChild(t2);                                
            document.body.appendChild(b);                    
            document.getElementById("place").innerHTML='To create an order, use the public key above to encrypt your shipping address. Paste the encrypted address in the box below, then click on the "Place Order" button.<br><textarea id="delivery" rows="4" cols="50" value="Paste your encrypted mailing address here"></textarea>';
            
            
            
            b.onclick = function() {
                var conf = confirm("Please confirm that you have encrypted your shipping address");
                if(conf==true){
                    var price = r[4];
                    var delivery_address = document.getElementById("delivery").value;
                    new_order(listing_id,price,delivery_address);
                    document.getElementById("button_result").innerHtml = 'Once your transaction is confirmed, it will take a few minutes to propagate through the blockchain!<br>Once your transaction has been confirmed by the blockchain, you can check the status of your order under the "My Orders" menu.';
                }
            };
            
            //if the user is not the seller, but the listing has a high dispute ratio, the listing can be removed
            if(is_bad_seller(listing_id)){
                var b2 = document.createElement("BUTTON");
                var t3 = document.createTextNode("Remove Listing");       
                b2.appendChild(t3);                                
                document.body.appendChild(b2);                    
                b2.onclick = function() { 
                    var conf = confirm("Thanks for helping keep the market working smoothly! Click OK to confirm removal of this bad listing.");
                    if(conf==true){
                    removeListing(listing_id);
                    }
                };
            }
        }
    }