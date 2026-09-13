import React from "react";
import classes from "./PostCard.module.css";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import { mediaUrl } from "../../assets/helper/Urls";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  return (
    <div className={classes.postBox}>
      <Row>
        <Col lg={7}>
          <div className={classes.postContent}>
            <h3>{post?.title}</h3>
            <p>{parse(`${post?.description}`)}</p>
            <div className={classes.readBtn}>
              <button onClick={() => navigate(`/posts/${post?.id}`)}>
                Read More
              </button>
            </div>
          </div>
        </Col>
        <Col lg={5}>
          <div className={classes.postImg}>
            <img src={mediaUrl(post?.image)} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PostCard;
