import React, { useState } from 'react';
import CommentsSection from './CommentsSection';

const PostItem = ({ post, onEdit, onDelete, currentUser }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showComments, setShowComments] = useState(false);

    // 🌟 התאמה ל-DB: בודקים את post.user_id במקום post.userId
    const isOwner = String(post.user_id) === String(currentUser?.id);

    return (
        <div className={`postRow ${isExpanded ? 'expanded' : ''} ${isOwner ? 'ownPost' : ''}`}>

            <div className="postSummary" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="postHeaderContent">
                    <span className="postId">#{post.id}</span>
                    <span className="postTitle">
                        {post.title} 
                    </span>
                </div>
                <button className="expandBtn">
                    {isOwner && <small className="ownerBadge" >👤</small>}
                    {isExpanded ? '⌃' : '⌄'}
                </button>
            </div>

            {isExpanded && (
                <div className="postDetails">
                    <hr />
                    <p className="postBody">{post.body}</p>

                    <div className="postActions">
                        {isOwner && (
                            <>
                                <button className="actionBtn editBtn" onClick={() => onEdit(post)}>Edit Post</button>
                                <button className="actionBtn deleteBtn" onClick={() => onDelete(post.id)}>Delete Post</button>
                            </>
                        )}
                        
                        <button className="actionBtn commentsBtn" onClick={() => setShowComments(!showComments)}>
                            {showComments ? 'Hide Comments' : 'Show Comments'}
                        </button>
                    </div>

                    {showComments && (
                        <CommentsSection postId={post.id} currentUser={currentUser}  />
                    )}
                </div>
            )}
        </div>
    );
};

export default PostItem;






// import React, { useState } from 'react';
// import CommentsSection from './CommentsSection';

// const PostItem = ({ post, onEdit, onDelete, currentUser }) => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [showComments, setShowComments] = useState(false);

//     const isOwner = String(post.userId) === String(currentUser?.id);

//     return (
//         <div className={`postRow ${isExpanded ? 'expanded' : ''} ${isOwner ? 'ownPost' : ''}`}>

//             <div className="postSummary" onClick={() => setIsExpanded(!isExpanded)}>
//                 <div className="postHeaderContent">
//                     <span className="postId">#{post.id}</span>
//                     <span className="postTitle">
//                         {post.title} 
//                     </span>
//                 </div>
//                 <button className="expandBtn">
//                     {isOwner && <small className="ownerBadge" >👤</small>}
//                     {isExpanded ? '\u2303' : '\u2304'}
//                 </button>
//             </div>

//             {isExpanded && (
//                 <div className="postDetails">
//                     <hr />
//                     <p className="postBody">{post.body}</p>

//                     <div className="postActions">
//                         {isOwner && (
//                             <>
//                                 <button className="actionBtn editBtn" onClick={() => onEdit(post)}>Edit Post</button>
//                                 <button className="actionBtn deleteBtn" onClick={() => onDelete(post.id)}>Delete Post</button>
//                             </>
//                         )}
                        
//                         <button className="actionBtn commentsBtn" onClick={() => setShowComments(!showComments)}>
//                             {showComments ? 'Hide Comments' : 'Show Comments'}
//                         </button>
//                     </div>

//                     {showComments && (
//                         <CommentsSection postId={post.id} currentUser={currentUser}  />
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PostItem;





