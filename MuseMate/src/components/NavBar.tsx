import React from "react";
import {
  SignInButton,
  SignOutButton,
  SignedOut,
  SignedIn,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/App.css";

const Navbar = () => {
  const { isSignedIn, signOut } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          MuseMate
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/notebook">
                Notebook
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About Us
              </Link>
            </li>
          </ul>
        </div>
        <div className="right-side-buttons">
          {isSignedIn ? (
            <SignedIn>
              <SignOutButton />
              <UserButton />
            </SignedIn>
          ) : (
            <SignedOut>
              <SignInButton />
            </SignedOut>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
