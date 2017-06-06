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


Template.orderStatusButtons.helpers({
	unconfirmed 	 : function() { return this.orderStatus==0; },
	seller 			 : function() { return web3.eth.accounts[0]==this.seller; },
	notShippedInTime : function() { return Date.now()>(this.timeCreated+(1000 * 60 * 60 * 24 * 3)); },
	shipped 		 : function() { return this.orderStatus==1; },
	notArrivedInTime : function() { return Date.now()>(this.timeCreated+(1000 * 60 * 60 * 24 * 7 * 12));  },
	delivered		 : function() { return this.orderStatus==2; },
	disputed 		 : function() { return this.orderStatus==3;}
});

Template.listing.helpers({

	showOrderButton : function () {
    	return (web3.eth.accounts[0]!= this.seller); },
    showRemoveListingButton : function () {
    	return (web3.eth.accounts[0]== this.seller) || ( is_bad_seller(this.listingID) ); },
    showFlagListingButton : function () {
    	return (web3.eth.accounts[0]!= this.seller);}
});

Template.date.helpers({
	convert : function() {return new Date(this.timeListed).toISOString().slice(0,10);}
});

Template.sell.helpers({
    listings_table: function () {
        return ListingsDB.find().fetch(); },
    orders_table: function (){
    	return OrdersDB.find().fetch(); },
    sellListingSettings: function () {
        return sellListingSettings; },
    sellOrderSettings: function () {
        return sellOrderSettings;},
    seller : function () { return web3.eth.accounts.length>0; },
    shareholder : function () { return true;   } 
});

Template.purchases.helpers({
	orders_table: function (){
		return OrdersDB.find().fetch();},
    purchasesTableSettings: function () {
        return purchasesTableSettings;}
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/home', function () {
  this.render('home');
});

Router.route('/community', function () {
  this.render('community');
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
  	action: function() { this.render('purchases'); },
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
	data : function () {
  		var id = this.params.query.id;
  		return ListingsDB.findOne({listingID : Number(id)});}
});
