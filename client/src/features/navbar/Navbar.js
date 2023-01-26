import React, { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

//apply conditional rendering for sign in/up || sign out links in NavBar
const NavBar = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to='/'>
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
                  Edit User/Add Ski Pass
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
                <Nav.Link as={Link} to="/user/logout">
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
