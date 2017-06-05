Router.configure({
    layoutTemplate: 'defaultLayout'
});

Template.buy.helpers({
    listings_table: function () {
        return ListingsDB.find().fetch();
    },
    buyTableSettings: function () {
        return buyTableSettings;
}});


Template.sell.helpers({
    listings_table: function () {
        return ListingsDB.find().fetch();
    },
    
    orders_table: function (){
    	return OrdersDB.find().fetch();
    },
    sellListingSettings: function () {
        return sellListingSettings;
},
    sellOrderSettings: function () {
        return sellOrderSettings;
}
});

Template.purchases.helpers({
	orders_table: function (){
		return OrdersDB.find().fetch();
		},
    purchasesTableSettings: function () {
        return purchasesTableSettings;
}
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/home', function () {
  this.render('home');
	
});

Router.route('/buy',{ 

loadingTemplage: 'loading',

waitOn: function () {loadActiveListings();},

  action: function(){ this.render('buy'); },
  data : function () {return ListingsDB.find().fetch();}
});

Router.route('/sell', { 

loadingTemplage: 'loading',

waitOn: function () {loadSellerOrders();},

  action: function(){ this.render('sell'); },
  data : function () {return OrdersDB.find().fetch();}
});

Router.route('/purchases', { 

loadingTemplage: 'loading',

waitOn: function () {loadBuyerOrders();},

  action: function(){ this.render('purchases'); },
  data : function () {return OrdersDB.find().fetch();}
});

Router.route('/faq', function () {
  this.render('faq');
});

Router.route('/createListing', function () {
  
  this.render('createListing');

});


Router.route('/listing', {

    template: 'listing',
    showOrderButton : function () {
  		var id = this.params.query.id;
    	var N = ListingsDB.findOne({listingID : Number(id)}).fetch();
    	return (web3.eth.accounts[0]!= N.seller) ;
    	
    },
    showRemoveListingButton : function () {
  		var id = this.params.query.id;
    	var N = ListingsDB.findOne({listingID : Number(id)}).fetch();
    	return (web3.eth.accounts[0]== N.seller) || ( is_bad_seller(id) );
    
    },
    showFlagListingButton : function () {
 		var id = this.params.query.id;
    	var N = ListingsDB.findOne({listingID : Number(id)}).fetch();
    	return (web3.eth.accounts[0]!= N.seller);
    
    },
data : function () {
  var id = this.params.query.id;
  return ListingsDB.findOne({listingID : Number(id)});

}});
