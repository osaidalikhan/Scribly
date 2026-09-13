import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BaseURL } from "../../assets/helper/Urls";
import classes from "./FollowButton.module.css";

const FollowButton = ({ userId, initialFollowing, onChange }) => {
  const { access_token, isLogin, user } = useSelector(
    (state) => state.authReducer
  );
  const navigate = useNavigate();
  const [following, setFollowing] = useState(!!initialFollowing);
  const [loading, setLoading] = useState(false);

  // Don't offer a follow button for your own profile.
  if (isLogin && Number(user?.id) === Number(userId)) return null;

  const handleToggle = async () => {
    if (!isLogin) {
      toast.info("Please login to follow authors");
      return navigate("/login");
    }
    if (loading) return;

    const nextFollowing = !following;
    setLoading(true);
    try {
      const apiUrl = BaseURL(`users/${userId}/follow`);
      const headers = { Authorization: `Bearer ${access_token}` };
      if (nextFollowing) {
        await axios.post(apiUrl, {}, { headers });
      } else {
        await axios.delete(apiUrl, { headers });
      }
      setFollowing(nextFollowing);
      onChange?.(nextFollowing);
    } catch (err) {
      toast.error("Couldn't update follow status. Try again.");
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      className={`${classes.followBtn} ${following ? classes.following : ""}`}
      onClick={handleToggle}
      disabled={loading}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
