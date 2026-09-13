import axios from "axios";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BaseURL, mediaUrl } from "../../assets/helper/Urls";
import NoData from "../../components/NoData";
import styles from "./masonry.module.css";

const Feed = () => {
  const navigate = useNavigate();
  const { access_token } = useSelector((state) => state.authReducer);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const apiUrl = BaseURL("users/feed");
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setPosts(response?.data || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.exploreLabel}>Your Feed</p>
        <h2 className={styles.mainTitle}>Posts from people you follow</h2>
        <p className={styles.subText}>
          Follow authors from their profile to see their latest posts here.
        </p>
      </div>

      {loading ? (
        <ResponsiveMasonry columnsCountBreakPoints={{ 650: 1, 800: 2, 900: 3 }}>
          <Masonry>
            {Array(6)
              .fill(0)
              .map((item, i) => {
                const height = i % 2 === 0 ? 200 : 300;
                return (
                  <div
                    key={i}
                    className={styles.card}
                    style={{ height: `${height}px` }}
                  >
                    <div className={styles.cardImageSkeleton}></div>
                  </div>
                );
              })}
          </Masonry>
        </ResponsiveMasonry>
      ) : posts.length === 0 ? (
        <NoData text="No posts yet — follow some authors to fill your feed" />
      ) : (
        <ResponsiveMasonry columnsCountBreakPoints={{ 650: 1, 800: 2, 900: 3 }}>
          <Masonry>
            {posts.map((item, i) => {
              const height = i % 2 === 0 ? 200 : 300;
              return (
                <div
                  key={item.id}
                  className={styles.card}
                  style={{ height: `${height}px` }}
                  onClick={() => navigate(`/posts/${item.id}`)}
                >
                  <img
                    src={mediaUrl(item?.image)}
                    alt={item?.title}
                    className={styles.cardImage}
                  />
                  <div className={styles.overlay}>
                    <h3 className={styles.overlayTitle}>{item?.title}</h3>
                  </div>
                  <div className={styles.authorWrapper}>
                    <span className={styles.authorName}>
                      <Eye size={14} style={{ marginRight: 4 }} />
                      {item?.author_name} · {item?.views ?? 0} views
                    </span>
                  </div>
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </div>
  );
};

export default Feed;
