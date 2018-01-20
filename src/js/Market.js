/*
import {TruffleContract} from 'TruffleContract'
var Market = {
  web3Provider: null,
  contracts: {},

  init: function() {
      
    return Market.initWeb3();
  },

  initWeb3: function() {
    

    return Market.fetchBase();
  },

  fetchBase: function() {
      
   $.getJSON('Base.json', function(data) {
  // Get the necessary contract artifact file and instantiate it with truffle-contract
  var BaseArtifact = data;
  Market.contracts.Base = TruffleContract(BaseArtifact);

  // Set the provider for our contract
  Market.contracts.Base.setProvider(App.web3Provider);
  console.log(Market.contracts.Base);
  // Use our contract to retrieve and mark the adopted pets
       alert("hi");
  return;
});

    return Market.fetchMarket();
  },
    
  fetchMarket : function(){
      $.getJSON('Market.json', function(data) {
  // Get the necessary contract artifact file and instantiate it with truffle-contract
  var MarketArtifact = data;
  Market.contracts.Market = TruffleContract(MarketArtifact);

  // Set the provider for our contract
  Market.contracts.Market.setProvider(App.web3Provider);
  console.log(Market.contracts.Market);
  // Use our contract to retrieve and mark the adopted pets
       alert("hi");
  return;
});
      
  },

  bindEvents: function() {
    //$(document).on('click', '.btn-adopt', App.handleAdopt);
      
  },

  markAdopted: function(adopters, account) {
   
      var adoptionInstance;

      Market.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        return adoptionInstance.getAdopters.call();
          
      }).then(function(adopters) {
        for (i = 0; i < adopters.length; i++) {
            if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
                $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
            }
        }
      }).catch(function(err) {
        console.log(err.message);
      });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

  Market.contracts.Adoption.deployed().then(function(instance) {
    adoptionInstance = instance;

    // Execute adopt as a transaction by sending account
    return adoptionInstance.adopt(petId, {from: account});
      
  }).then(function(result) {
    return Market.markAdopted();
  }).catch(function(err) {
    console.log(err.message);
  });
});
  }

};

$(function() {
  $(window).load(function() {
    Market.init();
    alert("hi");
  });
});
*/