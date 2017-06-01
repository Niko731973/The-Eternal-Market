# The Eternal Market
Decentralized, anonymous online marketplace

[About](#About) - [Installation](#Installing) - [Buying](#Buying) - [Selling](#Selling)


##About

The Eternal Market (TEM) is a distributed application that allows anyone with blockchain 
access to buy or sell goods and services anonymously. It requires no login, only a valid
Ethereum address. Being a distributed application, TEM is not stored on any server, cannot
be shut down or hacked. Funds for each order are locked in contracts between the buyer and
seller, there is no central wallet to manage orders which is susceptible to attack.

Once a listing is posted, there are only two ways it can be removed:
A) If the ratio of failed/successful sales is too high
B) If owner of the listing voluntarily removes it

TEM is an upgradable set of smart contracts consisting of:

A) A base contract - an unchanging contract which points to the current deployed market contract
B) A market contract - an upgradeable contract that contains the logic of the market
C) A database contract - stores the listings and orders
D) Many purchase contracts - contain the funds for each order between buyers and sellers on TEM

TEM has no owner with control over the listings or orders. Right now the owner has *extremely* limited 
control as an arbitrator over disputed contracts, and a few other housekeeping functions. Eventually this will be phased out and replaced with a share-based community voting mechanism.

Example Order:
Alice wants to purchase a widget from Bob, who has listed widgets on TEM. Alice connects her
Etereum address to TEM and navigates to the listing page for Bob's widgets. Using Bob's public
key on the page, Alice encrypts her shipping address and submits an order to Bob. The ether for
the purchase is stored in a separate secure contract. Bob will not receive his ether until Alice
has confirmed that she has received the wiget.

When Bob receives the order he decrypts Alices address using his private key, and ships the
widget to Alice. When Alice receives the widget, she confirms delivery and the funds are sent to Bob.

Rejected Orders:
If Bob runs out of widgets to sell, he can remove his listing from TEM. If he runs out of widgets but
already has orders that are placed, he can cancel the orders and the funds will be returned to the 
buyers.

Sellers have three days to confirm shipment of their items. If they have not shipped by the third day,
the Buyer can cancel their order and receive a refund.

Disputing an Order:
In the event that a Seller fails to provide their good or service after confirming shipment, the buyer
can (after 3 weeks) choose to dispute the order. If an order is disputed, the seller will not 
recieve any funds from the purchase. A neutral arbitrator can decide how to allocate the funds locked in
the order contract between the Buyer and Seller.

Incapacitated Parties:
In the event that either Buyer or Seller becomes incapacitated and cannot release the funds, the contract
which contains the order's fund has a "deadman's switch" to split the funds equally between the two parties. This can 
only be triggered after the contract has been stagnant for 12 weeks.

Keeping the Market Running Smoothly:
The number of successful and disputed sales for each listing on TEM is tracked in the database. Listings
which have a bad ratio of disputed/successful sales can be removed by any Ethereum user. As long as the 
Seller of a listing keeps selling successfully, the Seller is the only person who has the capability to 
remove a Listing from TEM. Since the community self-curates the listings on TEM, any malicious sellers will
quickly be weeded out.

Sellers have incentive to ship their products or deliver their services quickly. Because TEM cannot be shut down,
Sellers have the potential to reap large profits from listings with a long track history of successful deliveries.

Staying Anonymous on TEM:

TBD

The future of TEM:
TBD

##Installing
The Eternal Market requires Mistbrowser or the chrome Shapeshift plugin to interact (via web3) with the blockchain.

Installation Instructions
1) Download and unzip the repository for The Eternal Market ()
2) Use your favorite local webserver to host the files*
3) Navigate to home.html in your ethereum-connected browser and start buying/selling

*Fenix is simple and easy to use
1) Download and install from http://fenixwebserver.com/
2) Select "New Server" and point the server at your unzipped repository folder
3) Navigate to the address shown in the Fenix window (Usually http://127.0.0.1:80)

##Buying
Browse the current listings on the market. You can see the items for sale, 
read descriptions, and view some stats on each listing which serve
to authenticate the seller.

When you are ready to create a purchase, you send payment to the listing
and your ENCRYPTED mailing address. It is VERY IMPORTANT that you encrypt your
mailing address with the sellers public key before you submit your transaction or else
your address will be public and broadcast to the whole world!

How to use PGP to encrypt your shipping address

##Selling

After you have connected your ethereum address (where payment for your orders will be sent),
specify the following:
1) Title
2) Description of listing
3) Price in USD
4) Your Public Key (used to decrypt the buyers addresses that are sent to you)

Each listing has some additional statistics which are tracked automatically. This additional
information is used to show the reliability of the seller.

5) Date the Listing was Created
6) Number of Successful Deliveries 
6) Number of Disputed Sales
8) The Time and Date of the Last Successful Sale

A small percentage is taken out of the cost of each order placed to pay for development of TEM.

Right now there is no fee to create a listing on the exchange, but as TEM grows a listing fee
will be introduced to discourage spam and prevent scammers from listing.

You may remove any listing of yours at any time. 
___________________________________________________________________________





