Router.configure({
    layoutTemplate: 'defaultLayout'
});

Template.buy.helpers({
    listings_table: function () {
        return ListingsDB.find({enabled : true}).fetch();
    },
    buyTableSettings: function () {
        return buyTableSettings;
}});


Template.sell.helpers({
    listings_table: function () {
        return ListingsDB.find({seller: accounts[0]}).fetch();
    },
    
    orders_table: function (){
    	return OrdersDB.find({seller:accounts[0]}).fetch();
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
		return OrdersDB.find({buyer:accounts[0]}).fetch();
		},
    purchaseTableSettings: function () {
        return purchaseTableSettings;
}
});

Template.listing.helpers({
	removeListing: function (id){
		return removeListing(id);
		},
	newOrder: function (id,delivery){
		return newOrder(id,$('textarea').get(1).value);  
		
		},
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/home', function () {
  this.render('home');
	
});

Router.route('/buy', function () {
  this.render('buy');
	
});

Router.route('/sell', function () {
  this.render('sell');

});

Router.route('/purchases', function () {
  this.render('purchases');

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
  return ListingsDB.findOne({listingID : Number(id)});

}});
