/* Sell react table settings */
sellListingSettings= { 
fields: [ 
	{ key : 'timeListed', label : 'Listed'},
	{ key : 'price', label : 'Ether'},
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

/* Buy react table settings */

buyTableSettings= { 
fields: [ 
	{ key : 'timeListed', label : 'Listed'},
	{ key : 'price', label : 'Ether'},
	{ key : 'title', label : 'Title', tmpl: Template.ListingLink},
	{ key : 'salesSuccessful', label : 'Successful Sales'},
	{ key : 'successRate', label : 'Success Rate'},
	{ key : 'lastsuccessfulSale', label : 'Last Successful Sale'}
]}

/* Purchases react table settings */

purchasesTableSettings= { 
fields: [ 
	{ key : 'timeListed' , label: 'Date Created' },
    { label: 'Ether' },
    { label: 'Title'},
    { key : 'shippingAddress' , label: 'Delivery Info' },
    { key : 'orderStatus' , label: 'Status' }
	]}
