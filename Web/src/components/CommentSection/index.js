import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BaseURL, avatarUrl } from "../../assets/helper/Urls";
import classes from "./CommentSection.module.css";

const CommentSection = ({ blogId }) => {
  const { access_token, isLogin, user } = useSelector(
    (state) => state.authReducer
  );
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    if (!blogId) return;
    setLoading(true);
    try {
      const apiUrl = BaseURL(`comments/blog/${blogId}`);
      const response = await axios.get(apiUrl);
      setComments(response?.data || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin) {
      toast.info("Please login to comment");
      return navigate("/login");
    }
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const apiUrl = BaseURL(`comments/blog/${blogId}`);
      await axios.post(
        apiUrl,
        { content },
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      setContent("");
      fetchComments();
    } catch (err) {
      toast.error("Couldn't post comment. Try again.");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      const apiUrl = BaseURL(`comments/${id}`);
      await axios.delete(apiUrl, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast.error("Couldn't delete comment. Try again.");
    }
  };

  return (
    <div className={classes.wrapper}>
      <h5>Comments ({comments.length})</h5>

      <form className={classes.form} onSubmit={handleSubmit}>
        <textarea
          placeholder={isLogin ? "Add a comment..." : "Login to comment"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {loading ? (
        <p className={classes.muted}>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className={classes.muted}>No comments yet. Be the first!</p>
      ) : (
        <div className={classes.list}>
          {comments.map((comment) => (
            <div key={comment.id} className={classes.comment}>
              <img
                src={avatarUrl(comment.author_avatar, comment.author_name)}
                alt={comment.author_name}
              />
              <div className={classes.body}>
                <div className={classes.meta}>
                  <Link to={`/profile/${comment.user_id}`}>
                    {comment.author_name}
                  </Link>
                  <span>{moment(comment.created_at).fromNow()}</span>
                </div>
                <p>{comment.content}</p>
              </div>
              {user?.id === comment.user_id && (
                <button
                  type="button"
                  className={classes.deleteBtn}
                  onClick={() => handleDelete(comment.id)}
                  aria-label="Delete comment"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
