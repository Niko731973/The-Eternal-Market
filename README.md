# The Eternal Market
decentralized & anonymous online marketplace

[About](#about) - [Installation](#installing) - [Buying](#buying) - [Selling](#selling) - [Disclaimers](#disclaimers)


## About

The Eternal Market (TEM) is a distributed application (DAPP) that allows anyone with ethereum blockchain access to buy or sell goods and services anonymously. TEM requires no login, only a valid Ethereum address. As a distributed application TEM is not stored on any server, and cannot be shut down. Listing prices are USD stabalized using the MakerDAO price oracle. TEM allows users located in oppressive regimes to trade banned goods and services freely. A teacher in an Afghani girl's school could use TEM to purchase books to through a mail-order service, or a company in the UK could sell VPN software to citizens of China to circumvent their censorship. 

Once a listing is posted, there are only two ways it can be removed:
* If the ratio of failed/successful sales is too high
* If owner of the listing voluntarily removes it

TEM is upgradable, with the app hosted on the interplanetary file system:

* A base contract - an unchanging contract which points to the current deployed market contract on the blockchain, and the IPFS location of the most recent version of the app
* A market contract - an upgradeable contract that contains the logic of the market


### Example Order:
Alice wants to purchase a widget from Bob for $25, who has listed widgets on TEM. Alice orders a widget on Bob's listing page using $25 worth of ETH. She then uses Bob's public key to encrypt her shipping address. She messages Bob this shipping information using Bob's preferred means of contact. Bob will not receive his ether until Alice has confirmed that she has received the widget.

When Bob receives the order he decrypts Alices address using his private key, and ships the widget to Alice. When Alice receives the widget, she confirms delivery and the ETH she paid for the widget are transfered to Bob's wallet.

Bob may post special instructions in his listing for buyers to follow. He may feel it is safest for buyers to pass their shipping information along via a TOR chat service, or in an encrypted email. Read each listing carefully to make sure your order is processed correctly!


### Rejected Orders:
If Bob runs out of widgets to sell, he can remove his listing from TEM. If he runs out of widgets but already has orders that are placed, he can cancel the orders and the DAI from those orders will be refunded to the buyers.

Sellers have three days to confirm shipment of their items. If they have not shipped by the third day, the Buyer can cancel their order and receive a full refund.

### Disputing an Order:
In the event that a Seller fails to provide their good or service after confirming shipment, the buyer can (after 3 weeks) choose to dispute the order. If an order is disputed, the seller will not receive any funds from the purchase. Right now ether for disputed orders is recycled back into the market itself. Later, an arbitration system may be added to partition the funds in other ways.

Buyers should never confirm receipt of an order unless you have actually received it! Do not release funds early under any circumstances! Doing so undermines the rating and feedback system built into TEM.


### Incapacitated Parties:
In the event that the Buyer of a listing becomes incapacitated and cannot release the funds of a confirmed order, the contract which contains the order's fund has a "deadman's switch" to recover the funds and pay the Seller. This can only be triggered after shipped orders are stagnant for 12 weeks. Disputed orders cannot use the deadman's switch. If a buyer has not received their order by the 12th week, the buyer should dispute the order and prevent the seller from fraudulently obtaining funds.

### Keeping the Market Running Smoothly:
The number of successful and disputed sales for each listing on TEM is tracked in the database. Listings which have a bad ratio of disputed/successful sales can be removed by any Ethereum user. Since the community self-curates the listings on TEM, any malicious sellers will quickly be weeded out.

Sellers have incentive to ship their products or deliver their services quickly. Because TEM cannot be shut down, Sellers have the potential to reap large profits from listings with a long track history of successful deliveries. Potential buyers can view each listings history, with feedback from previous buyers, the statistics of successful and disputed transactions.

### Price Stabilization
ETH (and many other cryptocurrencies) are notoriously volatile. TEM uses MakerDAO's decentralized medianizer pricefeed oracle to constantly adjust the listing prices to mitigate exchange rate volatility. A new price is set whenever:

A) The Source price differs to the most recently submitted price by more than the defined amount (currently 1%)
B) Last price update was more than 6 hours ago.

See https://developer.makerdao.com/feeds/ for more information on how the oracle functions. 

### Staying Anonymous on TEM:

Coming Soon...

### The future of TEM:

* Secure messaging between users
* Image storage for listings via swarm/IPFS
* Improved front-end GUI
* ios/android apps

## Installing

The Eternal Market is going through the final phase of testing and will be launched soon!

## Buying
Browse the current listings on the market. You can see the items for sale, read descriptions, see buyer feedback, and view some stats on each listing which serve to authenticate the seller.

When you are ready to create a purchase, connect your ethereum address to TEM, and place your order. You must message the seller your shipping information, along with your order ID so they can complete your order. It is VERY IMPORTANT that you encrypt your mailing address with the sellers public key before you submit your transaction!

How to use PGP to encrypt your shipping address ([link](http://www.bitcoinnotbombs.com/beginners-guide-to-pgp/))


## Selling
All sellers should register their public pgp key with the market before creating a listing.

After you have connected your ethereum address (where payment for your orders will be sent),
specify the following:
1) Title
2) Description of listing
3) Price in USD

Each listing has some additional statistics which are tracked automatically. This additional
information is used to show the reliability of the seller.

5) Date the Listing was Created
6) Number of Successful Deliveries 
7) Number of Disputed Sales
8) Buyer Feedback from previous sales

A small listing fee may be charged for every new listing created to discourage spam/scammers. 

You may remove any listing of yours at any time. 

You may change the price of a listing at any time. There is no charge to chance the price of a listing.
___________________________________________________________________________


## Disclaimers

BY USING THIS CODE YOU ALSO AGREE:

a. Creating an instance of this DAPP may be a civil or criminal offense in certain jurisdictions. The purchase or sale of some materials listed on the market may be a civil or criminal offense in certain jurisdictions. Seek appropriate legal advice before buying or selling on, or launching, TEM.

b. Your use of the Software does not create a legally binding contract in any jurisdiction.

c. The performance of this software is neither warranted nor guaranteed.


## Ethereum

Ethereum is a  decentralized platform that runs smart contracts: applications that run exactly as programmed without any possibility of downtime, censorship, fraud or third party interference.

These apps run on a custom built blockchain, an enormously powerful shared global infrastructure that can move value around and represent the ownership of property. This enables developers to create markets, store registries of debts or promises, move funds in accordance with instructions given long in the past (like a will or a futures contract) and many other things that have not been invented yet, all without a middle man or counterparty risk.
