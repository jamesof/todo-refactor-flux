// ET_PB_Dispatcher
//
// A singleton that operates as the central hub for application updates.

import { Dispatcher } from 'flux';

class ETDispatcher extends Dispatcher {
  previousPayload = {}

  dispatch = payload => {
    if (this._isDispatching) {
      console.log('Dispatched', payload, 'in the middle of', this.previousPayload);
    }
    
    this.previousPayload = payload;
    super.dispatch(payload);
  }
}

export default new ETDispatcher();