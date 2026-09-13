"use client";
import axios from "axios";
import { Bookmark, Edit, Eye, Heart, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { BaseURL, mediaUrl, avatarUrl } from "../../assets/helper/Urls";
import styles from "./masonry.module.css";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Select from "react-dropdown-select";
import NoData from "../NoData";
import { Col, Row } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const useDebounce = (search, delay) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    const interval = setTimeout(() => {
      setValue(search);
    }, delay);
    return () => {
      clearInterval(interval);
    };
  }, [search]);
  return value;
};

const BLogsMasonrySection = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const { user } = useSelector((state) => state.authReducer);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [titleSearch, setTitleSearch] = useState("");
  const debounce = useDebounce(titleSearch, 500);
  const [submitLoading, setSubmitLoading] = useState(false);
  const fetchPosts = async (cat = selectedCategory) => {
    const filters = {
      ...(debounce?.trim() !== "" && { search: debounce }),
      ...(cat && cat !== "all" && { category: cat }),
    };
    const searchParams = new URLSearchParams(filters);
    const apiUrl = BaseURL(`blogs?${searchParams.toString()}`);
    console.log(apiUrl, "a");

    setSubmitLoading(true);
    try {
      const response = await axios.get(apiUrl);
      if (response) {
        setPosts(response?.data);
      }
    } catch (err) {
      console.log(err);
    }

    setSubmitLoading(false);
  };
  useEffect(() => {
    console.log("mai chkr");
    fetchPosts();
  }, [debounce]);
  return (
    <div className={styles.wrapper}>
      {/* Header Section */}
      <div className={styles.header}>
        <p className={styles.exploreLabel}>EXPLORE Blogs</p>
        <h2 className={styles.mainTitle}>
          Change your View Best Authors <br />
        </h2>
        <p className={styles.subText}>
          Discover valuable information on how to grow your business. Read our
          blog posts to learn how to grow your business.
        </p>
      </div>

      {/* Filter Section */}
      <div className={styles.header}>
        <Row>
          <div className={styles.postHeader}>
            <h4 style={{ color: "white" }}>Showing Posts For</h4>
          </div>
          <Col lg={6}>
            <div className={`${styles.inputField} w-100`}>
              <input
                type="text"
                className="w-100"
                placeholder="Search by title"
                value={titleSearch}
                onChange={(e) => setTitleSearch(e.target.value)}
              />
            </div>
          </Col>
          <Col lg={4}></Col>
          <Col lg={2}>
            <Select
              options={options}
              onChange={(values) => {
                setSelectedCategory(values[0].value);
                fetchPosts(values[0].value);
              }}
              placeholder="Select Category"
            />
          </Col>
        </Row>
      </div>

      {/* Blog Cards Grid */}
      {submitLoading ? (
        <ResponsiveMasonry columnsCountBreakPoints={{ 650: 1, 800: 2, 900: 3 }}>
          <Masonry>
            {Array(10)
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
      ) : posts?.length === 0 ? (
        <NoData text="No Post found" />
      ) : (
        <ResponsiveMasonry columnsCountBreakPoints={{ 650: 1, 800: 2, 900: 3 }}>
          <Masonry>
            {posts.map((item, i) => {
              const height = i % 2 === 0 ? 200 : 300;
              return (
                <div
                  key={i}
                  className={styles.card}
                  style={{ height: `${height}px` }}
                >
                  <img
                    src={mediaUrl(item?.image)}
                    alt={`Blog ${i}`}
                    className={styles.cardImage}
                  />
                  {user?.id === item?.user_id && (
                    <div
                      className={styles.bookmarkWrapper1}
                      onClick={() => navigate(`/edit-post/${item?.id}`)}
                    >
                      <Edit size={24} className="text-white cursor-pointer" />
                    </div>
                  )}
                  <div
                    className={styles.bookmarkWrapper}
                    onClick={() => navigate(`/posts/${item?.id}`)}
                  >
                    <Eye size={24} className="text-white cursor-pointer" />
                  </div>
                  <div className={styles.overlay}>
                    <h3 className={styles.overlayTitle}>{item?.title}</h3>
                    <div className={styles.statsInline}>
                      <span>
                        <Heart size={14} /> {item?.likes_count ?? 0}
                      </span>
                      <span>
                        <MessageCircle size={14} /> {item?.comments_count ?? 0}
                      </span>
                      <span>
                        <Eye size={14} /> {item?.views ?? 0}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/profile/${item?.user_id}`}
                    className={styles.authorWrapper}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={avatarUrl(item?.author_avatar, item?.author_name)}
                      alt="Author"
                      width={30}
                      height={30}
                      className={styles.authorImage || "Unknown"}
                    />
                    <span className={styles.authorName}>
                      {user?.id === item?.user_id
                        ? "You"
                        : item?.author_name || "Unknown"}
                    </span>
                  </Link>
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </div>
  );
};

export default BLogsMasonrySection;
const options = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "nutrition",
    label: "Nutrition",
  },
  {
    value: "fitness",
    label: "Fitness",
  },
  {
    value: "mental-health",
    label: "Mental Health",
  },
  {
    value: "wellness",
    label: "Wellness",
  },
  {
    value: "diseases",
    label: "Diseases",
  },
  {
    value: "medical-news",
    label: "Medical News",
  },
];
