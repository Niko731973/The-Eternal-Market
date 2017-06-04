//display current listings

sellListingSettings= { 
fields: [ 
	{ key : 'timeListed', label : 'Listed'},
	{ key : 'price', label : 'Price'},
	{ key : 'title', label : 'Title', tmpl: Template.ListingLink},
	{ key : 'salesSuccessful', label : 'Successful Sales'},
	{ key : 'salesDisputed', label : 'Disputed Sales'},
	{ key : 'successRate', label : 'Success Rate'},
	{ key : 'lastsuccessfulSale', label : 'Last Successful Sale'}
]}

sellOrderSettings= { 
fields: [ 
	{ key : 'timeListed' , label: 'Date Created' },
    { label: 'Ether' },
    { label: 'Title'},
    { key : 'shippingAddress' , label: 'Delivery Info' },
    { key : 'orderStatus' , label: 'Status' }
	]}
