import axios from "axios";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BaseURL } from "../../assets/helper/Urls";
import classes from "./LikeButton.module.css";

const LikeButton = ({ blogId }) => {
  const { access_token, isLogin } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    if (!blogId) return;
    try {
      const apiUrl = BaseURL(`likes/${blogId}`);
      const headers = access_token
        ? { Authorization: `Bearer ${access_token}` }
        : {};
      const response = await axios.get(apiUrl, { headers });
      setLiked(response?.data?.liked || false);
      setLikesCount(response?.data?.likesCount || 0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  const handleToggle = async () => {
    if (!isLogin) {
      toast.info("Please login to like posts");
      return navigate("/login");
    }
    if (loading) return;

    // Optimistic update so the button feels instant.
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((count) => count + (nextLiked ? 1 : -1));
    setLoading(true);
    try {
      const apiUrl = BaseURL(`likes/${blogId}/toggle`);
      const response = await axios.post(
        apiUrl,
        {},
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      setLiked(response?.data?.liked);
      setLikesCount(response?.data?.likesCount);
    } catch (err) {
      // roll back on failure
      setLiked(!nextLiked);
      setLikesCount((count) => count - (nextLiked ? 1 : -1));
      toast.error("Couldn't update like. Try again.");
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      className={`${classes.likeBtn} ${liked ? classes.liked : ""}`}
      onClick={handleToggle}
    >
      <Heart size={18} fill={liked ? "currentColor" : "none"} />
      <span>{likesCount}</span>
    </button>
  );
};

export default LikeButton;
