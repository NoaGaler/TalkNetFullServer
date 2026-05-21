import { useReducer, useEffect } from 'react';
import useFetch from './useFetch';
import useMutation from './useMutation';
import resourceReducer from './resourceReducer';

const initialState = {
    items: [],
    searchTerm: "",
    searchCriteria: "title",
    sortBy: "id"
};

const useResourceManager = (baseUrl, fetchUrl) => {
    const [state, dispatch] = useReducer(resourceReducer, initialState);

    const { data, loading, error } = useFetch(fetchUrl);

    const { mutate, loading: actionLoading } = useMutation();

    useEffect(() => {
        if (data) dispatch({ type: 'SET_DATA', payload: data });
    }, [data]);

    const processedItems = [...state.items]
        //search
        .filter(item => {
            if (!state.searchTerm) return true;
            const value = item[state.searchCriteria]?.toString().toLowerCase();
            return value?.includes(state.searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            const valA = a[state.sortBy];
            const valB = b[state.sortBy];
            if (typeof valA === 'number') return valA - valB;
            return String(valA).localeCompare(String(valB));
        });


    const addItem = async (newItem) => {
        try {
            const itemToSend = {
                ...newItem
            };

            const savedItem = await mutate(baseUrl, 'POST', itemToSend);
            dispatch({ type: 'ADD_ITEM', payload: savedItem });
        } catch (err) {
            console.error("Add failed:", err);
        }
    };

    // 🌟 פונקציית העדכון המשודרגת שפותרת את קפיאת המסך והשגיאה ב-Console!
    const updateItem = async (id, updates) => {
        try {
            // 1. שולחים את העדכון וממתינים שיסתיים בהצלחה ב-DB
            await mutate(`${baseUrl}/${id}`, 'PATCH', updates);
            
            // 2. מוצאים את הפריט המקורי הקיים בתוך ה-State של המערכת
            const existingItem = state.items.find(item => item.id === id);
            
            if (existingItem) {
                // 3. בונים אובייקט שלם ומעודכן המשלב את הנתונים הישנים והחדשים
                const itemToUpdateInState = {
                    ...existingItem,
                    ...updates,
                    id: id // מוודאים שה-id נשאר תקין ומוגדר
                };

                // 4. שולחים לרידוסר אובייקט מושלם כדי שהשינוי ישתקף במסך מיידית!
                dispatch({ type: 'UPDATE_ITEM', payload: itemToUpdateInState });
            }
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const removeItem = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await mutate(`${baseUrl}/${id}`, 'DELETE');
                dispatch({ type: 'DELETE_ITEM', payload: id });
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    };

    return {
        items: processedItems,
        loading,
        error,
        actionLoading,
        addItem,
        updateItem,
        removeItem,
        setSearch: (t) => dispatch({ type: 'SET_SEARCH_TERM', payload: t }),
        setCriteria: (c) => dispatch({ type: 'SET_SEARCH_CRITERIA', payload: c }),
        setSort: (s) => dispatch({ type: 'SET_SORT_BY', payload: s }),
        searchTerm: state.searchTerm,
        searchCriteria: state.searchCriteria,
        sortBy: state.sortBy
    };
};

export default useResourceManager;




// import { useReducer, useEffect } from 'react';
// import useFetch from './useFetch';
// import useMutation from './useMutation';
// import resourceReducer from './resourceReducer';

// const initialState = {
//     items: [],
//     searchTerm: "",
//     searchCriteria: "title",
//     sortBy: "id"
// };

// const useResourceManager = (baseUrl, fetchUrl) => {
//     const [state, dispatch] = useReducer(resourceReducer, initialState);

//     const { data, loading, error } = useFetch(fetchUrl);

//     const { mutate, loading: actionLoading } = useMutation();

//     useEffect(() => {
//         if (data) dispatch({ type: 'SET_DATA', payload: data });
//     }, [data]);

//     const processedItems = [...state.items]
//         //search
//         .filter(item => {
//             if (!state.searchTerm) return true;
//             const value = item[state.searchCriteria]?.toString().toLowerCase();
//             return value?.includes(state.searchTerm.toLowerCase());
//         })
//         .sort((a, b) => {
//             const valA = a[state.sortBy];
//             const valB = b[state.sortBy];
//             if (typeof valA === 'number') return valA - valB;
//             return String(valA).localeCompare(String(valB));
//         });


//     const addItem = async (newItem) => {
//         try {
//             const itemToSend = {
//                 ...newItem
//             };

//             const savedItem = await mutate(baseUrl, 'POST', itemToSend);
//             dispatch({ type: 'ADD_ITEM', payload: savedItem });
//         } catch (err) {
//             console.error("Add failed:", err);
//         }
//     };

//     const updateItem = async (id, updates) => {
//         try {
//             const updatedItem = await mutate(`${baseUrl}/${id}`, 'PATCH', updates);
//             dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
//         } catch (err) {
//             console.error("Update failed:", err);
//         }
//     };

//     const removeItem = async (id) => {
//         if (window.confirm("Are you sure?")) {
//             try {
//                 await mutate(`${baseUrl}/${id}`, 'DELETE');
//                 dispatch({ type: 'DELETE_ITEM', payload: id });
//             } catch (err) {
//                 console.error("Delete failed:", err);
//             }
//         }
//     };

//     return {
//         items: processedItems,
//         loading,
//         error,
//         actionLoading,
//         addItem,
//         updateItem,
//         removeItem,
//         setSearch: (t) => dispatch({ type: 'SET_SEARCH_TERM', payload: t }),
//         setCriteria: (c) => dispatch({ type: 'SET_SEARCH_CRITERIA', payload: c }),
//         setSort: (s) => dispatch({ type: 'SET_SORT_BY', payload: s }),
//         searchTerm: state.searchTerm,
//         searchCriteria: state.searchCriteria,
//         sortBy: state.sortBy
//     };
// };

// export default useResourceManager;