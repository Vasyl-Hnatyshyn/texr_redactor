import {
    SET_ELEMENTS,
    SET_CURRENT_CARRET_DATA

} from './actionsType';


const initialState = {
  elements: [
        {
            text: 'My lovely',
            fontSize: '12px',
            color: 'red'
        },
        {
            text: 'little',
            fontSize: '25px',
            color: 'pink'
        },
    ],
    currentCarretData:{
      startIndex: 0,
        chartChar: 0}

};

 const reducer = (state = initialState, action) => {
    switch (action.type) {

        case SET_ELEMENTS:
            return { ...state, elements: action.payload, };

         case SET_CURRENT_CARRET_DATA:
            return { ...state, currentCarretData: action.payload, };

    }
    return state;
};

export default reducer;

