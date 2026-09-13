import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseURL } from "../../assets/helper/Urls";
import classes from "./Landing.module.css";
import Header from "../../components/Header";
import PostCard from "../../components/PostCard";
import { Container } from "react-bootstrap";
const Landing = () => {
  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    const apiUrl = BaseURL(`blogs`);
    const response = await axios.get(apiUrl);
    let array = [...response?.data];
    array = array.slice(0, 4);
    setPosts(array);
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <>
      <div className={classes.Landing}>
        <Container>
          <div className={classes.postSection}>
            {posts?.map((item) => (
              <PostCard key={item.id} post={item} />
            ))}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Landing;
