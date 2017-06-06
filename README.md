# The Eternal Market
Decentralized, anonymous online marketplace

[About](#about) - [Installation](#installing) - [Community](#community) - [Buying](#buying) - [Selling](#selling)


## About

The Eternal Market (TEM) is a distributed application (DAPP) that allows anyone with blockchain access to buy or sell goods and services anonymously. It requires no login, only a valid Ethereum address. Being a distributed application, TEM is not stored on any server, cannot be shut down or hacked. Funds for each order are locked in contracts between the buyer and seller, there is no central wallet to manage orders which is susceptible to attack. 

TEM has no owner with control over market operations. During the initial coin offering (ICO) shares of TEM will be sold off at a fixed price. After TEM is fully operational, shareholders will have total control over TEM through a fixed voting system. Shares are freely transferable and are redeemable at any time for ether at the market rate through the community contract. Shareholders are entitled to all the profits of market operations.

Once a listing is posted, there are only three ways it can be removed:
* If the ratio of failed/successful sales is too high (determined by the community)
* If owner of the listing voluntarily removes it
* If over 50% of the community votes to remove it (to remove scam/spam or egregious sales like nuclear weapons, etc)


TEM contains an upgradable set of smart contracts:

* A base contract - an unchanging contract which points to the current deployed market contract on the blockchain
* A market contract - an upgradeable contract that contains the logic of the market, can be updated freely
* A database contract - stores the listings and orders, to be infrequently updated on major revisions
* A community contract - manages shareholders stake's in the community. can be upgraded with extreme difficulty 
* Many purchase contracts - each contains the funds for an individual order between a buyer/seller


### Example Order:
Alice wants to purchase a widget from Bob, who has listed widgets on TEM. Alice connects her Etereum address to TEM and navigates to the listing page for Bob's widgets. Using Bob's public key on the page, Alice encrypts her shipping address and submits an order to Bob. The ether for the purchase is stored in a secure contract only Alice/Bob have access to. Bob will not receive his ether until Alice has confirmed that she has received the wiget.

When Bob receives the order he decrypts Alices address using his private key, and ships the widget to Alice. When Alice receives the widget, she confirms delivery and the funds are sent to Bob.

### Rejected Orders:
If Bob runs out of widgets to sell, he can remove his listing from TEM. If he runs out of widgets but already has orders that are placed, he can cancel the orders and the funds will be returned to the buyers.

Sellers have three days to confirm shipment of their items. If they have not shipped by the third day, the Buyer can cancel their order and receive a refund.

### Disputing an Order:
In the event that a Seller fails to provide their good or service after confirming shipment, the buyer can (after 3 weeks) choose to dispute the order. If an order is disputed, the seller will not recieve any funds from the purchase. Right now ether for disputed orders is recycled into the market. Later, an arbitration system could be added to partition the funds in other ways.

### Incapacitated Parties:
In the event that either Buyer becomes incapacitated and cannot release the funds, the contract which contains the order's fund has a "deadman's switch" to recover the funds. This can only be triggered after the contract has been stagnant for 12 weeks. Disputed orders cannot use the deadman's switch.

### Keeping the Market Running Smoothly:
The number of successful and disputed sales for each listing on TEM is tracked in the database. Listings which have a bad ratio of disputed/successful sales can be removed by any Ethereum user. Since the community self-curates the listings on TEM, any malicious sellers will quickly be weeded out.

Sellers have incentive to ship their products or deliver their services quickly. Because TEM cannot be shut down, Sellers have the potential to reap large profits from listings with a long track history of successful deliveries. The community will decide themselves what kinds of services and products will be allowed on the market by voting to remove individual items which are found morally objectionable.

### Staying Anonymous on TEM:

TBD

### The future of TEM:

* Secure messaging between users
* Image storage for listings via IPFS
* Improved front-end GUI
* ios/android apps
* fixed USD prices for listings
* built-in encryption for shipping information

## Installing

The Eternal Market is going through the final phase of testing and will be launched soon!

## Community
During the ICO (initial coin offering), shares in TEM are being sold at a fixed rate. View the community page to purchase shares. 

Shareholders earn the right to vote on proposals, and introduce new proposals. Each shareholder is entitled to their portion of the profits from transactions on TEM. Shares can be bought/sold/transferred at any time. Shareholders are responsible for voting on the following types of proposals:

* When to upgrade a smart contract to add new features
* Setting the listing and order fees on the market
* Removing listings to clear spam/scammers/objectionable listings



## Buying
Browse the current listings on the market. You can see the items for sale, read descriptions, and view some stats on each listing which serve to authenticate the seller.

When you are ready to create a purchase, you send payment to the listing and your ENCRYPTED mailing address. It is VERY IMPORTANT that you encrypt your mailing address with the sellers public key before you submit your transaction or else your address will be public and broadcast to the whole world!

How to use PGP to encrypt your shipping address ([link](http://www.bitcoinnotbombs.com/beginners-guide-to-pgp/))

## Selling

After you have connected your ethereum address (where payment for your orders will be sent),
specify the following:
1) Title
2) Description of listing
3) Price in Ether
4) Your Public Key (used to decrypt the buyers addresses that are sent to you)

Each listing has some additional statistics which are tracked automatically. This additional
information is used to show the reliability of the seller.

5) Date the Listing was Created
6) Number of Successful Deliveries 
6) Number of Disputed Sales
8) The Time and Date of the Last Successful Sale

A small listing fee is charged for every new listing created to discourage spam/scammers. 

You may remove any listing of yours at any time. 

You may change the price of a listing at any time. There is no charge to lower the cost of a listing, but if you increase the price of a listing you will need to pay the cost of listing fee on the difference between the old and new price. Eventually listings will be able to have a fixed USD price to compensate for the volatile USE/ETH market. 
___________________________________________________________________________




