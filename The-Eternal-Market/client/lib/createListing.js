createListing = function createListing(){
	//only allow a user to create a listing if they have a valid address loaded
	if(accounts.length>0){
	    //user has an account loaded
	    
	    var listing_rate = EV.listing_rate();
		document.getElementById("listing_info").innerHTML='Listing Title: <input type="text" id="listingTitle" value=""><br>Price (Ether): <input type="text" id="price" value=""><br>Listing Description:<br><textarea rows="6" cols="80" id="listingDescription" value="Your listing description goes here"></textarea><br>Public Key:<br><textarea rows="4" cols="50" id="sellerPublicKey" value="Paste your public key here"></textarea><br>Fee: <input type="text" readonly id="fee" value="">';
		var price_box = document.getElementById('price');
		var fee_box = document.getElementById('fee');
		var fee;
		

		price_box.onchange = function() {
   			fee = (listing_rate*Number(price_box.value))/100;
   			fee_box.value = fee;
   			
		}
		
		
		var b = document.createElement("BUTTON");
        var t = document.createTextNode("Create Listing");       
        b.appendChild(t);                                
        document.body.appendChild(b);                    
        b.onclick = function() { 
            var conf = confirm("Please confirm the information for your listing is correct! You cannot modify the listing once it has been submitted!");
            if(conf==true){
            var title = document.getElementById('listingTitle').value;
            var description = document.getElementById('listingDescription').value;
            var public_key = document.getElementById('sellerPublicKey').value;
            var price = document.getElementById('price').value; 
			web3.eth.defaultAccount = accounts[0];
            EV.addListing(title,description,public_key,price, {value:fee});
        }};
	
	}
	else{
	    //user does not have an account loaded, cannot create a listing
	    document.getElementById("listing_info").innerHTML='Please connect an ethereum address and reload the page to create a listing!<br><br><br>';
	}
	
	}
