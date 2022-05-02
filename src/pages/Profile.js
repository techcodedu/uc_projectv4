import React from "react";
import Navigation from "../components/navigation";
import { Container, Badge, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { auth } from "../firebase.config";
import { db } from "../firebase.config";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import img from "../assets/images/logo512.png";
import { PinMapFill } from "react-bootstrap-icons";
import { Phone } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function Profile() {
  const navigate = useNavigate;
  const [fname, setFirstName] = useState("");
  const [lname, setLastName] = useState("");
  const [uemail, setUserEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [photo, setPhoto] = useState("");
  const [business, setBname] = useState("");

  const [user, loading, error] = useAuthState(auth);

  const fetchUserProfile = async () => {
    try {
      const q = query(
        collection(db, "Users"),
        where("userId", "==", user?.uid)
      );
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      //cashier data
      setFirstName(data.userFirstname);
      setLastName(data.userLastname);
      setUserEmail(data.userEmail);
      setPhoneNumber(data.userPhoneNumber);
      setPhoto(data.userProfile);
      setBname(data.userBusinessName);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserProfile();
  }, [user, loading]);

  return (
    <>
      <Navigation />

      <Container>
        <div className="main-container">
          <Badge className="mt-3">Your Profile</Badge>
          <div className="wrapper">
            <div className="photo">
              <img src={photo === "" ? img : photo} />
            </div>
            <div className="name">
              <div className="inner">
                <h2>{fname + lname}</h2>
                <h6>Cashier</h6>

                <h4>{business}</h4>
                <div className="fill">
                  <PinMapFill />
                  <h6>Location</h6>
                </div>
                <h4>{phone}</h4>
                <div className="fill">
                  <Phone />
                  <h6>Phone Number</h6>
                </div>
                <h4>{uemail}</h4>
                <div className="fill">
                  <Phone />
                  <h6>Email</h6>
                </div>
              </div>
              <Link to={`/update/${user?.uid}`}>
                <Button type="primary">Edit</Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>

      <Footer />
    </>
  );
}

export default Profile;
