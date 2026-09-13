import React, { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Container, Spinner, Form, Button } from "react-bootstrap";
import UserContext from "../../context/UserContext";
import { BaseURL, mediaUrl } from "../../assets/helper/Urls";
import { useSelector } from "react-redux";
import styles from "./CreatePost.module.css";
import { useEffect } from "react";

const categories = [
  "nutrition",
  "fitness",
  "mental-health",
  "wellness",
  "diseases",
  "medical-ews",
];

const CreatePost = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const { access_token } = useSelector((state) => state.authReducer);
  const [value, setValue] = useState();
  const [title, setTitle] = useState();
  const [file, setFile] = useState();
  const [category, setCategory] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    const params = {
      title,
      description: value,
      image: file,
      category,
      ...(id && { id: id }),
    };

    // Validate required fields
    for (let key in params) {
      if (!params[key]) {
        return toast.error(`Please provide the ${key}`);
      }
    }

    const formData = new FormData();
    Object.entries(params).forEach(([key, val]) => {
      formData.append(key, val);
    });

    const isUpdate = id;
    const apiUrl = isUpdate ? BaseURL(`blogs/${id}`) : BaseURL("blogs/create");

    const request = isUpdate
      ? axios.patch(apiUrl, formData, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
      : axios.post(apiUrl, formData, {
          headers: { Authorization: `Bearer ${access_token}` },
        });

    try {
      setLoading("post");
      await toast.promise(request, {
        pending: isUpdate ? "Updating post..." : "Publishing post...",
        success: isUpdate ? "Post updated!" : "Post published!",
        error: "Something went wrong. Try again later.",
      });
      navigate("/");
    } catch (err) {
      console.error("Post error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleGetData = async () => {
    try {
      setLoading("get");
      const response = await axios.get(BaseURL(`blogs/${id}`));
      if (response) {
        setTitle(response?.data?.blog?.title);
        setValue(response?.data?.blog?.description);
        setFile(response?.data?.blog?.image);
        setCategory(response?.data?.blog?.category);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      handleGetData();
    }
  }, [id]);

  return (
    <Container>
      {loading == "get" ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.leftPanel}>
            <input
              className={styles.titleInput}
              type="text"
              placeholder="Enter your blog title..."
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <div className={styles.editorContainer}>
              <ReactQuill
                className={styles.editor}
                theme="snow"
                placeholder="Enter your blog content..."
                value={value}
                onChange={setValue}
              />
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.card}>
              <h4>Upload Image</h4>
              <label htmlFor="file" className={styles.fileBox}>
                {file ? "Change Image" : "Click to upload image"}
              </label>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file && (
                <div className={styles.imagePreview}>
                  <img
                    src={
                      typeof file === "object"
                        ? URL.createObjectURL(file)
                        : mediaUrl(file)
                    }
                    alt="preview"
                  />
                </div>
              )}
            </div>

            <div className={styles.card}>
              <h4>Select Category</h4>
              <select
                className={styles.selectBox}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Choose category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={handleClick} className={styles.publishButton}>
              {id ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default CreatePost;
