import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../user/UserSlice"


//apply conditional rendering for sign in/up || sign out links in NavBar
const NavBar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to='/user'>
            Powder Finder : GO DEEp OR GO HOMe!
          </Navbar.Brand>

          <Nav>
            <Nav.Item>
              {!isLoggedIn && (
                <Nav.Link as={Link} to="/user/signup">
                  Sign Up
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Item>
              {!isLoggedIn && (
                <Nav.Link as={Link} to="/user/login">
                  Sign In
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Item>
              {isLoggedIn && (
                <Nav.Link as={Link} to="/user/edit">
                  User Settings
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Item>
              {isLoggedIn && (
                <Nav.Link as={Link} to="/user/delete">
                  Delete User
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Item>
              {isLoggedIn && (
                <Nav.Link onClick={dispatch(signOut)} as={Link} to="/user">
                  Sign Out
                </Nav.Link>
              )}
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};
export default NavBar;
