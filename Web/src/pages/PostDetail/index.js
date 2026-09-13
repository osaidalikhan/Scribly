import axios from "axios";
import parse from "html-react-parser";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BaseURL, mediaUrl, avatarUrl } from "../../assets/helper/Urls";
import LikeButton from "../../components/LikeButton";
import CommentSection from "../../components/CommentSection";
import classes from "./PostDetail.module.css";
import { toast } from "react-toastify";

const PostDetail = () => {
  const { access_token, user } = useSelector((state) => state.authReducer);
  const [postData, setPostData] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchPosts = async () => {
    const apiUrl = BaseURL(`blogs/${id}`);
    const response = await axios.get(apiUrl);
    if (response) {
      setPostData(response?.data?.blog);
      setRelatedPosts(response?.data?.relatedBlogs);
    }
  };
  const handleDelete = async () => {
    const apiUrl = BaseURL(`blogs/delete/${id}`);
    const response = await axios.delete(apiUrl, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    toast.success("Post deleted successfully");
    navigate("/");
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  const isOwner = user?.id === postData?.user_id;

  return (
    <>
      <Container>
        <div className={classes.postContainer}>
          <Row>
            <Col lg={8}>
              <div className={classes.postContent}>
                <div className={classes.postImg}>
                  <img src={mediaUrl(postData?.image)} alt="" />
                </div>
                <div className={classes.content}>
                  <div className={classes.header}>
                    <Link
                      className={classes.posted}
                      to={`/profile/${postData?.user_id}`}
                    >
                      <img
                        src={avatarUrl(
                          postData?.author_avatar,
                          postData?.author_name
                        )}
                        alt=""
                      />
                      <div className={classes.name}>
                        <h6>{postData?.author_name}</h6>
                        <p>
                          Posted{" "}
                          {postData?.created_at
                            ? moment(postData?.created_at).fromNow()
                            : "Few seconds ago"}
                        </p>
                      </div>
                    </Link>
                    {isOwner && (
                      <div className={classes.updateBtns}>
                        <Link
                          className={classes.editBtn}
                          to={"/edit-post/" + postData?.id}
                        >
                          <BiEditAlt />
                        </Link>
                        <div
                          className={`${classes.editBtn} ${classes.deletBtn}`}
                          onClick={handleDelete}
                        >
                          <AiFillDelete />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={classes.postDescription}>
                    <h2>{postData?.title}</h2>
                    <div className={classes.statsRow}>
                      <LikeButton blogId={postData?.id} />
                      <span className={classes.viewsBadge}>
                        <Eye size={16} />
                        {postData?.views ?? 0} views
                      </span>
                    </div>
                    <div className={classes.description}>
                      {parse(`${postData?.description}`)}
                    </div>{" "}
                  </div>
                  <CommentSection blogId={postData?.id} />
                </div>
              </div>
            </Col>
            <Col lg={4}>
              <div className={classes.relatedPosts}>
                <h5>Related Posts</h5>
                {relatedPosts?.map(
                  (post) =>
                    post?.id !== postData?.id && (
                      <div className={classes.post} key={post?.id}>
                        <img src={mediaUrl(post?.image)} alt="" />
                        <h6>{post?.title}</h6>
                        <div className={classes.related_description}>
                          {parse(`${post?.description}`)}
                        </div>
                        <div
                          className={classes.readBtn}
                          onClick={() => navigate(`/posts/${post?.id}`)}
                        >
                          <button>Read More</button>
                        </div>
                      </div>
                    )
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default PostDetail;
