import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import useFetch from '../../hooks/useFetch';
import useMutation from '../../hooks/useMutation';

const CommentsSection = ({ postId, currentUser }) => {
    const { API_BASE } = useContext(UserContext);

    // 1. שליפת התגובות לפי הסינון הנכון בדאטאבייס (post_id)
    const {
        data: rawComments,
        loading,
        error,
        setData: setComments
    } = useFetch(postId ? `${API_BASE}/comments?post_id=${String(postId)}` : null);
    
    // סינון אובייקטים לפי c.post_id שחוזר מהדאטאבייס
    const comments = rawComments?.filter(c => String(c.post_id) === String(postId));

    const { mutate } = useMutation();
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        // 🌟 שליחת 3 השדות המדויקים שקיימים בטבלה שלכן ב-DB! ללא name וללא email!
        const commentData = {
            post_id: postId, 
            user_id: currentUser.id, 
            body: newComment
        };

        try {
            const savedComment = await mutate(`${API_BASE}/comments`, 'POST', commentData);
            // מוסיפים את התגובה החדשה שחזרה מהשרת למערך המקומי
            setComments(prev => [...(prev || []), savedComment]);
            setNewComment("");
        } catch (err) {
            alert("Failed to add comment");
        }
    };

    const handleUpdate = async (commentId) => {
        try {
            await mutate(`${API_BASE}/comments/${commentId}`, 'PATCH', { body: editText });
            setComments(prev => prev.map(c => c.id === commentId ? { ...c, body: editText } : c));
            setEditingId(null);
        } catch (err) {
            alert("Update failed");
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await mutate(`${API_BASE}/comments/${commentId}`, 'DELETE');
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (err) {
            alert("Delete failed");
        }
    };

    if (loading) return <p className="loadingText">Loading comments...</p>;
    if (error) return <p className="errorText">Error loading comments.</p>;

    return (
        <div className="commentsSection">
            <h5>Comments</h5>
            <div className="commentsList">
                {comments?.map(comment => {

                    // בדיקת בעלות מאובטחת לפי ה-user_id הדיגיטלי
                    const isOwner = String(comment.user_id) === String(currentUser.id);

                    return (
                        <div key={comment.id} className="commentCard">
                            <div className="commentHeader">
                                {/* מציגים את שם המשתמש הנוכחי אם הוא הבעלים, אחרת מציגים את מספר היוזר שכתב */}
                                <strong>{isOwner ? currentUser.username : `User #${comment.user_id}`}</strong>
                            </div>

                            {editingId === comment.id ? (
                                <div className="editCommentArea">
                                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
                                    <div className="editCommentActions">
                                        <button onClick={() => handleUpdate(comment.id)}>Save</button>
                                        <button onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="commentBody">{comment.body}</p>
                            )}

                            {isOwner && editingId !== comment.id && (
                                <div className="commentActions">
                                    <button onClick={() => { setEditingId(comment.id); setEditText(comment.body); }}>🖊️</button>
                                    <button onClick={() => handleDelete(comment.id)}>🗑️</button>
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>

            <div className="addCommentForm">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button onClick={handleAddComment}>Post</button>
            </div>
        </div>
    );
};

export default CommentsSection;




// import React, { useState, useContext } from 'react';
// import { UserContext } from '../../context/UserContext';
// import useFetch from '../../hooks/useFetch';
// import useMutation from '../../hooks/useMutation';

// const CommentsSection = ({ postId, currentUser }) => {
//     const { API_BASE } = useContext(UserContext);

//     // 1. שליפת התגובות לפי הסינון הנכון בדאטאבייס (post_id)
//     const {
//         data: rawComments,
//         loading,
//         error,
//         setData: setComments
//     } = useFetch(postId ? `${API_BASE}/comments?post_id=${String(postId)}` : null);
    
//     // 🌟 תיקון סינון אובייקטים: משתמשים ב-c.post_id שחוזר מהדאטאבייס האמיתי שלכן!
//     const comments = rawComments?.filter(c => String(c.post_id) === String(postId));

//     const { mutate } = useMutation();
//     const [newComment, setNewComment] = useState("");
//     const [editingId, setEditingId] = useState(null);
//     const [editText, setEditText] = useState("");

//     const handleAddComment = async () => {
//         if (!newComment.trim()) return;

//         // 🌟 תיקון יצירת תגובה: שולחים לשאילתת ה-POST שדה בשם post_id שהדאטאבייס מצפה לקבל!
//         const commentData = {
//             post_id: postId, 
//             user_id: currentUser.id, 
//             name: currentUser.username,
//             email: currentUser.email || 'no-email@talknet.com',
//             body: newComment
//         };

//         try {
//             const savedComment = await mutate(`${API_BASE}/comments`, 'POST', commentData);
//             // מוסיפים את התגובה החדשה שחזרה מהשרת למערך המקומי
//             setComments(prev => [...(prev || []), savedComment]);
//             setNewComment("");
//         } catch (err) {
//             alert("Failed to add comment");
//         }
//     };

//     const handleUpdate = async (commentId) => {
//         try {
//             await mutate(`${API_BASE}/comments/${commentId}`, 'PATCH', { body: editText });
//             setComments(prev => prev.map(c => c.id === commentId ? { ...c, body: editText } : c));
//             setEditingId(null);
//         } catch (err) {
//             alert("Update failed");
//         }
//     };

//     const handleDelete = async (commentId) => {
//         if (!window.confirm("Are you sure?")) return;
//         try {
//             await mutate(`${API_BASE}/comments/${commentId}`, 'DELETE');
//             setComments(prev => prev.filter(c => c.id !== commentId));
//         } catch (err) {
//             alert("Delete failed");
//         }
//     };

//     if (loading) return <p className="loadingText">Loading comments...</p>;
//     if (error) return <p className="errorText">Error loading comments.</p>;

//     return (
//         <div className="commentsSection">
//             <h5>Comments</h5>
//             <div className="commentsList">
//                 {comments?.map(comment => {

//                     // בדיקת בעלות מאובטחת לפי ה-user_id הדיגיטלי
//                     const isOwner = String(comment.user_id) === String(currentUser.id);

//                     return (
//                         <div key={comment.id} className="commentCard">
//                             <div className="commentHeader">
//                                 <strong>{comment.name}</strong>
//                                 <span className="commentEmail">({comment.email})</span>
//                             </div>

//                             {editingId === comment.id ? (
//                                 <div className="editCommentArea">
//                                     <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
//                                     <div className="editCommentActions">
//                                         <button onClick={() => handleUpdate(comment.id)}>Save</button>
//                                         <button onClick={() => setEditingId(null)}>Cancel</button>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <p className="commentBody">{comment.body}</p>
//                             )}

//                             {isOwner && editingId !== comment.id && (
//                                 <div className="commentActions">
//                                     <button onClick={() => { setEditingId(comment.id); setEditText(comment.body); }}>🖊️</button>
//                                     <button onClick={() => handleDelete(comment.id)}>🗑️</button>
//                                 </div>
//                             )}

//                         </div>
//                     );
//                 })}
//             </div>

//             <div className="addCommentForm">
//                 <input
//                     type="text"
//                     placeholder="Write a comment..."
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
//                 />
//                 <button onClick={handleAddComment}>Post</button>
//             </div>
//         </div>
//     );
// };

// export default CommentsSection;





// import React, { useState } from 'react';
// import useFetch from '../../hooks/useFetch';
// import useMutation from '../../hooks/useMutation';

// const CommentsSection = ({ postId, currentUser }) => {

//     const {
//         data: rawComments,
//         loading,
//         error,
//         setData: setComments
//     } = useFetch(postId ? `http://localhost:3000/comments?postId=${String(postId)}` : null);
    
//     const comments = rawComments?.filter(c => String(c.postId) === String(postId));

//     const { mutate } = useMutation();
//     const [newComment, setNewComment] = useState("");
//     const [editingId, setEditingId] = useState(null);
//     const [editText, setEditText] = useState("");

//     const handleAddComment = async () => {
//         if (!newComment.trim()) return;

//         const commentData = {
//             postId: postId,
//             name: currentUser.username,
//             email: currentUser.email,
//             body: newComment
//         };

//         try {
//             const savedComment = await mutate(`http://localhost:3000/comments`, 'POST', commentData);
//             setComments(prev => [...prev, savedComment]);
//             setNewComment("");
//         } catch (err) {
//             alert("Failed to add comment");
//         }
//     };

//     const handleUpdate = async (commentId) => {
//         try {
//             const updated = await mutate(`http://localhost:3000/comments/${commentId}`, 'PATCH', { body: editText });
//             setComments(prev => prev.map(c => c.id === commentId ? updated : c));
//             setEditingId(null);
//         } catch (err) {
//             alert("Update failed");
//         }
//     };

//     const handleDelete = async (commentId) => {
//         if (!window.confirm("Are you sure?")) return;
//         try {
//             await mutate(`http://localhost:3000/comments/${commentId}`, 'DELETE');
//             setComments(prev => prev.filter(c => c.id !== commentId));
//         } catch (err) {
//             alert("Delete failed");
//         }
//     };

//     if (loading)
//         return
//     <p className="loadingText">Loading comments...</p>;
//     if (error)
//         return
//     <p className="errorText">Error loading comments.</p>;

//     return (
//         <div className="commentsSection">
//             <h5>Comments</h5>
//             <div className="commentsList">
//                 {comments?.map(comment => {

//                     const isOwner = comment.email === currentUser.email;

//                     return (
//                         <div key={comment.id} className="commentCard">
//                             <div className="commentHeader">
//                                 <strong>{comment.name}</strong>
//                                 <span className="commentEmail">({comment.email})</span>
//                             </div>

//                             {editingId === comment.id ? (
//                                 <div className="editCommentArea">
//                                     <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
//                                     <div className="editCommentActions">
//                                         <button onClick={() => handleUpdate(comment.id)}>Save</button>
//                                         <button onClick={() => setEditingId(null)}>Cancel</button>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <p className="commentBody">{comment.body}</p>
//                             )}

//                             {isOwner && editingId !== comment.id && (
//                                 <div className="commentActions">
//                                     <button onClick={() => { setEditingId(comment.id); setEditText(comment.body); }}>🖊️</button>
//                                     <button onClick={() => handleDelete(comment.id)}>🗑️</button>
//                                 </div>
//                             )}

//                         </div>
//                     );
//                 })}
//             </div>

//             <div className="addCommentForm">
//                 <input
//                     type="text"
//                     placeholder="Write a comment..."
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
//                 />
//                 <button onClick={handleAddComment}>Post</button>
//             </div>
//         </div>
//     );
// };

// export default CommentsSection;