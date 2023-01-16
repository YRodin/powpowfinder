import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";

//apply conditional rendering for sign in/up || sign out links in NavigationBar
const NavigationBar = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="home">Powder Finder</Navbar.Brand>
          <Nav>
            <Nav.Item>
              {!isLoggedIn && <Nav.Link href="#signIn">Sign In/Up</Nav.Link>}
            </Nav.Item>
            <Nav.Item>
              {isLoggedIn && (
                <Nav.Link href="#editUser">Edit User/Add Ski Pass</Nav.Link>
              )}
            </Nav.Item>
            <Nav.Item>
              {isLoggedIn && <Nav.Link href="#editUser">Delete User</Nav.Link>}
            </Nav.Item>
            <Nav.Item>
              {isLoggedIn && <Nav.Link href="#signOut">Sign Out</Nav.Link>}
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};
export default NavigationBar;
