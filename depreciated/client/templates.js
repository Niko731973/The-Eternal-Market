
Template.buy.helpers({
    listings_table: function () {
        return ListingsDB.find().fetch();
    },
    buyTableSettings: function () {
        return buyTableSettings;
}});

Template.proposalApprovalProgress.helpers({
percentage : function(){var results = getVotingResults(this.id);
if(results>=.5){ return "100%"};
return Math.round(results*10000)/100+"%";}

});

Template.proposalButtons.helpers({
canVote : function(){ 
return !CM.hasVotedOn(web3.eth.accounts[0]);
},
canBeExecuted : function(){
var results = getVotingResults(this.id);
return results>=.5;}

});

Template.community.helpers({
	proposals_table: function () { return ProposalsDB.find().fetch(); },
	proposalTableSettings: function (){ return proposalTableSettings; },
	isShareholder : function() { return CM.isShareholder(web3.eth.accounts[0]); },
	shares : function() {return CM.sharesOwned(web3.eth.accounts[0]); },
	inICO : function() { return CM.ICO_enabled();},
	shareBuyPrice : function(){ 
	if(CM.ICO_enabled()){ return web3.fromWei(CM.offeringPrice(),"ether");}
	else { return web3.fromWei(CM.sharePrice(),"ether")*101/100;  }}	,
	shareSellPrice : function(){ if(CM.ICO_enabled()){
	return "NaN";
	}else{return web3.fromWei(CM.sharePrice());} }
	

});


Template.orderStatusButtons.helpers({
	unconfirmed 	 : function() { return this.orderStatus==0; },
	seller 			 : function() { return web3.eth.accounts[0]==this.seller; },
	notShippedInTime : function() { return Date.now()>(this.timeCreated+(1000 * 60 * 60 * 24 * 3)); },
	shipped 		 : function() { return this.orderStatus==1; },
	notArrivedInTime : function() { return Date.now()>(this.timeCreated+(1000 * 60 * 60 * 24 * 7 * 12));  },
	delivered		 : function() { return this.orderStatus == 2; },
	disputed 		 : function() { return this.orderStatus == 3;},
	aborted 		 : function() { return this.orderStatus == 4;}
});

Template.listing.helpers({

	userIsSeller : function () {
    	return (web3.eth.accounts[0]== this.seller); },
    showRemoveListingButton : function () {
    	return (web3.eth.accounts[0]== this.seller) || ( is_bad_seller(this.listingID) ); },
    convertPrice : function() { return web3.fromWei(this.price,"ether");  },
    userIsShareholder : function() {return CM.isShareholder(web3.eth.accounts[0]);},
    feedback : function () { return FeedbackDB.find().fetch();}
});

Template.date.helpers({
	convert : function() {return new Date(this.timeListed).toISOString().slice(0,10);}
});

Template.weiToEther.helpers({
	convert : function() {return web3.fromWei(this.price,"ether");}
});

Template.sell.helpers({
    listings_table: function () {
        return ListingsDB.find({seller : web3.eth.accounts[0]}).fetch(); },
    orders_table: function (){
    	return OrdersDB.find({seller : web3.eth.accounts[0]}).fetch(); },
    sellListingSettings: function () {
        return sellListingSettings; },
    sellOrderSettings: function () {
        return sellOrderSettings;}
});

Template.purchases.helpers({
	orders_table: function (){
		return OrdersDB.find({buyer : web3.eth.accounts[0]}).fetch();},
    purchasesTableSettings: function () {
        return purchasesTableSettings;}
});
