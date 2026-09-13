import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Eye, Edit } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { BaseURL, avatarUrl, mediaUrl } from "../../assets/helper/Urls";
import NoData from "../../components/NoData";
import FollowButton from "../../components/FollowButton";
import classes from "./Profile.module.css";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { access_token, user } = useSelector((state) => state.authReducer);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const headers = access_token
        ? { Authorization: `Bearer ${access_token}` }
        : {};
      const [profileRes, postsRes] = await Promise.all([
        axios.get(BaseURL(`users/${id}`), { headers }),
        axios.get(BaseURL(`blogs/my-blog/${id}`)),
      ]);
      setProfile(profileRes?.data);
      setPosts(postsRes?.data || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isOwnProfile = Number(user?.id) === Number(id);

  if (loading) return null;
  if (!profile) return <NoData text="User not found" />;

  return (
    <Container>
      <div className={classes.header}>
        <img
          className={classes.avatar}
          src={avatarUrl(profile.avatar, profile.name)}
          alt={profile.name}
        />
        <div className={classes.info}>
          <div className={classes.nameRow}>
            <h2>{profile.name}</h2>
            {isOwnProfile ? (
              <button
                className={classes.editBtn}
                onClick={() => navigate("/profile/edit")}
              >
                <Edit size={16} /> Edit Profile
              </button>
            ) : (
              <FollowButton
                userId={profile.id}
                initialFollowing={profile.is_following}
                onChange={fetchProfile}
              />
            )}
          </div>
          {profile.bio && <p className={classes.bio}>{profile.bio}</p>}
          <div className={classes.stats}>
            <span>
              <strong>{profile.posts_count}</strong> Posts
            </span>
            <Link to={`/profile/${profile.id}/followers`}>
              <strong>{profile.followers_count}</strong> Followers
            </Link>
            <Link to={`/profile/${profile.id}/following`}>
              <strong>{profile.following_count}</strong> Following
            </Link>
          </div>
        </div>
      </div>

      <h4 className={classes.postsHeading}>
        {isOwnProfile ? "Your Posts" : `Posts by ${profile.name}`}
      </h4>
      {posts.length === 0 ? (
        <NoData text="No posts yet" />
      ) : (
        <ResponsiveMasonry columnsCountBreakPoints={{ 650: 1, 800: 2, 900: 3 }}>
          <Masonry>
            {posts.map((item, i) => {
              const height = i % 2 === 0 ? 200 : 300;
              return (
                <div
                  key={item.id}
                  className={classes.card}
                  style={{ height: `${height}px` }}
                  onClick={() => navigate(`/posts/${item.id}`)}
                >
                  <img
                    src={mediaUrl(item?.image)}
                    alt={item?.title}
                    className={classes.cardImage}
                  />
                  <div className={classes.overlay}>
                    <h3>{item?.title}</h3>
                    <span className={classes.viewsBadge}>
                      <Eye size={14} /> {item?.views ?? 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </Container>
  );
};

export default Profile;
