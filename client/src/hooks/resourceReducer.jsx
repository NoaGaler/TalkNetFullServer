const resourceReducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return {
                ...state,
                items: action.payload
            };
        case 'ADD_ITEM':
            return {
                ...state,
                items: [...state.items, action.payload]
            };
        case 'UPDATE_ITEM': return {
            ...state,
            items: state.items.map(item => item.id === action.payload.id ? action.payload : item)
        };
        case 'DELETE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };
        case 'SET_SEARCH_TERM':
            return {
                ...state,
                searchTerm: action.payload
            };
        case 'SET_SEARCH_CRITERIA':
            return {
                ...state,
                searchCriteria: action.payload
            };
        case 'SET_SORT_BY':
            return {
                ...state,
                sortBy: action.payload
            };
        default: return state;
    }
};
export default resourceReducer;




