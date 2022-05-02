import React from "react";
import { Navbar, Container, NavDropdown, Nav } from "react-bootstrap";
import { auth } from "../firebase.config";
import { useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();
  const Signout = () => {
    auth.signOut();
    navigate("/");
  };
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand
            href="/dashboard
          "
          >
            App Back Office
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="justify-content-end">
              <Nav.Link href="/items">Inventory</Nav.Link>
              <NavDropdown title="Settings" id="basic-nav-dropdown">
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={Signout}>Sign Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;
