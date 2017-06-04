Router.configure({
    layoutTemplate: 'defaultLayout'
});

Template.buy.helpers({
    listings_table: function () {
        return ListingsDB;
    },
    buyTableSettings: function () {
        return buyTableSettings;
}});


Template.sell.helpers({
    listings_table: function () {
        return ListingsDB;
    },
    
    orders_table: function (){
    	return OrdersDB;
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
		return OrdersDB;
		}
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
