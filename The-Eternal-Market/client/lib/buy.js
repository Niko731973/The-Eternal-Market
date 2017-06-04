//display current listings
buyTableSettings= { 
fields: [ 
	{ key : 'timeListed', label : 'Listed'},
	{ key : 'price', label : 'Price'},
	{ key : 'title', label : 'Title', tmpl: Template.ListingLink},
	{ key : 'salesSuccessful', label : 'Successful Sales'},
	{ key : 'successRate', label : 'Success Rate'},
	{ key : 'lastsuccessfulSale', label : 'Last Successful Sale'}
]}