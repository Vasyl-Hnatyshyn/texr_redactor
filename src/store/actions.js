import {
    SET_ELEMENTS,
    SET_CURRENT_CARRET_DATA
} from './actionsType';

export const setElements = (elements) => {
    return {
        type: SET_ELEMENTS,
        payload: elements,
    };
};

export const setCurrentCarretData = (carretData) => {
    return {
        type: SET_CURRENT_CARRET_DATA,
        payload: carretData,
    };
};