import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import classes from "./Header.module.css";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logo } from "../../assets/helper/imagePath";
import { avatarUrl } from "../../assets/helper/Urls";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/reducers/authSlice.js";
<style>
  {`
        .bg-body-tertiary{
            background-color:var(--primary-color) !important;
            }
        `}
</style>;
function Header() {
  const { isLogin, user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function logout() {
    dispatch(logoutUser());
    navigate("/");
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary navbarContainer">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <h7 className={classes.logo}>BLOGS MANIA</h7>
          {/* <img src={logo} className={classes.logo} alt="" /> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="d-flex justify-content-between"
        >
          <Nav className="me-auto">
            <Nav.Link as={NavLink} className={classes.headingTags} to="/">
              Posts
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              className={classes.headingTags}
              to="/create-post"
            >
              Create Post
            </Nav.Link>
            {isLogin && (
              <>
                <Nav.Link
                  as={NavLink}
                  className={classes.headingTags}
                  to="/posts"
                >
                  My Posts
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  className={classes.headingTags}
                  to="/feed"
                >
                  Feed
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="align-items-center">
            {!isLogin ? (
              <>
                <Nav.Link
                  as={NavLink}
                  className={classes.headingTags}
                  to="/login"
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  className={classes.headingTags}
                  to="/register"
                >
                  Register
                </Nav.Link>
              </>
            ) : (
              <NavDropdown
                align="end"
                className={classes.profileDropdown}
                title={
                  <img
                    className={classes.avatar}
                    src={avatarUrl(user?.avatar, user?.name)}
                    alt={user?.name}
                  />
                }
              >
                <NavDropdown.Item
                  as={Link}
                  to={`/profile/${user?.id}`}
                >
                  View Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile/edit">
                  Edit Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
