import catApi from '../api/catApi';

export function loadCats() {  
  return function(dispatch) {
    return MarketApi.GetActiveListings().then(listings => {
      dispatch(loadCatsSuccess(cats));
    }).catch(error => {
      throw(error);
    });
  };
}