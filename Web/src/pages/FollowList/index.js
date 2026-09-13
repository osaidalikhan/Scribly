import axios from "axios";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { BaseURL, avatarUrl } from "../../assets/helper/Urls";
import NoData from "../../components/NoData";
import classes from "./FollowList.module.css";

// Renders either the followers or the following list for a user, based on
// which route matched (/profile/:id/followers vs /profile/:id/following).
const FollowList = ({ mode }) => {
  const { id } = useParams();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try {
      const apiUrl = BaseURL(`users/${id}/${mode}`);
      const response = await axios.get(apiUrl);
      setList(response?.data || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mode]);

  if (loading) return null;

  return (
    <Container>
      <h3 className={classes.heading}>
        {mode === "followers" ? "Followers" : "Following"}
      </h3>
      {list.length === 0 ? (
        <NoData text={`No ${mode} yet`} />
      ) : (
        <div className={classes.list}>
          {list.map((person) => (
            <Link
              key={person.id}
              to={`/profile/${person.id}`}
              className={classes.row}
            >
              <img src={avatarUrl(person.avatar, person.name)} alt="" />
              <div>
                <h6>{person.name}</h6>
                {person.bio && <p>{person.bio}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
};

export default FollowList;
