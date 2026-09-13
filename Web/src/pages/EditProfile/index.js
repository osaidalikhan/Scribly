import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BaseURL, avatarUrl } from "../../assets/helper/Urls";
import { saveLoginUserData } from "../../store/reducers/authSlice";
import classes from "./EditProfile.module.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access_token, user } = useSelector((state) => state.authReducer);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(BaseURL(`users/${user?.id}`), {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setName(response?.data?.name || "");
      setBio(response?.data?.bio || "");
    } catch (err) {
      console.log(err);
    }
    setFetching(false);
  };

  useEffect(() => {
    if (user?.id) fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error("Name is required");
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("bio", bio || "");
    if (avatarFile) formData.append("avatar", avatarFile);

    setLoading(true);
    try {
      const response = await axios.patch(
        BaseURL("users/me/profile"),
        formData,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      // Keep the redux-persisted user in sync with the new name/avatar.
      dispatch(
        saveLoginUserData({
          user: { ...user, name: response?.data?.name, avatar: response?.data?.avatar },
          token: access_token,
        })
      );
      toast.success("Profile updated");
      navigate(`/profile/${user?.id}`);
    } catch (err) {
      toast.error("Couldn't update profile. Try again.");
    }
    setLoading(false);
  };

  if (fetching) return null;

  return (
    <Container>
      <div className={classes.wrapper}>
        <h3>Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className={classes.avatarField}>
            <img
              src={
                avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : avatarUrl(user?.avatar, user?.name)
              }
              alt="avatar preview"
            />
            <label htmlFor="avatar">Change photo</label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
          </div>

          <div className={classes.inputField}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={classes.inputField}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              rows={4}
              maxLength={500}
              placeholder="Tell people a bit about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button className={classes.submitBtn} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </Container>
  );
};

export default EditProfile;
