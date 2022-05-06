import React, { useEffect, useState } from "react";
import Navigation from "../components/navigation";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function EditProfile() {
  const initialState = {
    userFirstname: "",
    userLastname: "",
    userPhoneNumber: "",
  };

  const [data, setData] = useState(initialState);
  const { userFirstname, userLastname, userPhoneNumber } = data;
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSubmit, setIsSubmit] = useState(false);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  //fetch user data from profile
  useEffect(() => {
    id && fetchUserProfile();
  }, [id]);

  //query snapshot from Users collection
  const fetchUserProfile = async () => {
    const docRef = doc(db, "Users", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };

  //profile image upload useffect
  useEffect(() => {
    const uploadFile = () => {
      const storage = getStorage();
      var storagePath = "storeimages/" + file.name;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is Pause");
              break;
            case "running":
              console.log("Upload is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, userProfile: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleInputChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //for save changes
  const handleProfile = async (e) => {
    e.preventDefault();
    if (id) {
      try {
        await updateDoc(doc(db, "Users", id), {
          ...data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    }

    navigate("/profile");
  };
  return (
    <>
      <Navigation />
      <Container>
        <h2>Edit Profile</h2>
        <Form onSubmit={handleProfile}>
          <Form.Group className="mb-3">
            <Form.Label>Cashiers Name</Form.Label>
            <Form.Control
              type="text"
              name="userFirstname"
              onChange={handleInputChange}
              value={userFirstname}
              autoFocus
            />

            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="userLastname"
              onChange={handleInputChange}
              value={userLastname}
            />
            <Form.Label>New Phone Number</Form.Label>
            <Form.Control
              type="number"
              name="userPhoneNumber"
              onChange={handleInputChange}
              value={userPhoneNumber}
            />
            <Form.Label>Upload Your Profile Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={progress !== null && progress < 100}
          >
            Save Changes
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default EditProfile;
