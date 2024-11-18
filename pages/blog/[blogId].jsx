import styles from '../../styles/showBlog.module.css';

// libraries for like,share,... icon
import { FaHeart, FaBookmark, FaEllipsisV } from 'react-icons/fa';
import { HeartIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/outline';


// can use this after like = {red heart}

// <button
// style={{ border: 'none', background: 'none', cursor: 'pointer' }}
// >
// <FaHeart size={24} color="red" />
// </button>


// can use this after save = {saved}

// <button
// style={{ border: 'white', background: 'black', cursor: 'pointer' }}
// >
// <FaBookmark size={24} />
// </button>


const showBlog = () => {

    const userName = 'userName';
    const name = 'name';
    const blogTitle = 'First Blog';
    const blogContent = 'Hello, my name is user\nDA-IICT\nHello, my name is user\nDA-IICT\nHello, my name is user\nDA-IICT\nHello, my name is user\nDA-IICT\nHello, my name is user\nDA-IICT\n';
    const likeCount = 0;

    const handleLike = () => {

    };

    const handleShare = () => {
    };

    const handleSave = () => {

    };

    const handleCommentSend = () => {

    };

    const handleDotBtn = () => {

    };

    const comments = [
        { user: "user1", comment: "comment1" },
        { user: "user2", comment: "comment2" },
        { user: "user3", comment: "comment3" },
        { user: "user4", comment: "comment4" },
        { user: "user5", comment: "comment5" },
    ];

    return (
        <div className={styles.blogContainer}>

            {/* scrollable section */}
            <div className={styles.leftSection}>
                <div className={styles.blogSection}>
                    <h1 className={styles.blogTitle}>
                        {blogTitle}
                    </h1>
                    <p className={styles.blogContent}>
                        {blogContent}
                    </p>
                </div>
            </div>


            {/* Static Section */}
            <div className={styles.rightSection}>
                <div className={styles.aboutBlog}>
                    <div className={styles.authorName}>
                        <h2>Author</h2>
                    </div>
                    <div className={styles.authorInfo}>
                        <div className={styles.authorAvatar}>
                            👤
                        </div>
                        <div className={styles.authorDetails}>
                            <p>@{userName}</p>
                            <p>{name}</p>
                        </div>
                        <div className={styles.btnSection}>
                            <button className={styles.followBtn}>
                                Follow
                            </button>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className={styles.commentsSection}>
                        <div className={styles.barSection}>
                            {comments.map((item, index) => (
                                <div key={index} className={styles.commentInfo}>
                                    <div className={styles.cntAvatar}>
                                        👤
                                    </div>
                                    <div className={styles.comment}>
                                        <p className={styles.uName}>
                                            @{item.user}
                                        </p>
                                        <p className={styles.uComment}>
                                            {item.comment}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comment Input */}
                        <div className={styles.commentInput}>
                            <input type="text" placeholder="Comment..." />
                            <button className={styles.sendBtn}
                                onClick={handleCommentSend}
                            >
                                send
                            </button>
                        </div>
                    </div>

                    {/* Blog Footer like share save other option */}
                    <div className={styles.likeSave}>
                        {/* Like icon */}
                        <button
                            // className="p-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-600"
                            aria-label="Like"
                            onClick={handleLike}
                        >
                            <HeartIcon className="h-9 w-9 text-white" />
                        </button>

                        {/* count a blogLike */}
                        <p>{likeCount} likes</p>

                        {/* Share icon */}
                        <button
                            // className="p-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-600"
                            aria-label="Share"
                            onClick={handleShare}
                        >
                            <ShareIcon className="h-8 w-8 text-white" />
                        </button>

                        {/* Save icon */}
                        <button
                            // className="p-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-600"
                            aria-label="Bookmark"
                            onClick={handleSave}
                        >
                            <BookmarkIcon className="h-8 w-8 text-white" />
                        </button>
                    </div>

                    {/* Dot icon */}
                    <button
                        style={{
                            border: 'white',
                            cursor: 'pointer',
                            fontSize: '28px',
                            marginTop: '15px',
                        }}
                        onClick={handleDotBtn}
                    >
                        <FaEllipsisV />
                    </button>

                </div>

            </div>
        </div>
    );
}

export default showBlog;
