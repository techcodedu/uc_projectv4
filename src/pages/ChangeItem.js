import React, { useEffect, useState } from "react";
import Navigation from "../components/navigation";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function EditProfile() {
  //   const initialState = {
  //     userFirstname: "",
  //     userLastname: "",
  //     userPhoneNumber: "",
  //   };

  //   const [data, setData] = useState(initialState);
  //   const { userFirstname, userLastname, userPhoneNumber } = data;
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSubmit, setIsSubmit] = useState(false);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const [details, setDetails] = useState([]);

  const fetchItem = async () => {
    const q = query(
      collectionGroup(db, "Items"),
      where("itemBarcode", "==", id)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setDetails(data);
  };

  console.log(details);

  useEffect(() => {
    fetchItem();
  }, []);

  //fetch user data from profile
  //   useEffect(() => {
  //     id && fetchUserProfile();
  //   }, [id]);

  //   //query snapshot from Users collection
  //   const fetchUserProfile = async () => {
  //     const docRef = doc(db, "Users", id);
  //     const snapshot = await getDoc(docRef);
  //     if (snapshot.exists()) {
  //       setData({ ...snapshot.data() });
  //     }
  //   };

  //profile image upload useffect
  useEffect(() => {
    const uploadFile = () => {
      const storage = getStorage();
      var storagePath = "cashier/" + file.name;
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
            // setData((prev) => ({ ...prev, userProfile: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleInputChange = (e) => {
    // setData({ ...data, [e.target.name]: e.target.value });
  };

  //for save changes
  const handleProfile = async (e) => {
    // e.preventDefault();
    // if (id) {
    //   try {
    //     await updateDoc(doc(db, "Users", id), {
    //       ...data,
    //       timestamp: serverTimestamp(),
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // navigate("/profile");
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
              autoFocus
            />

            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="userLastname"
              onChange={handleInputChange}
            />
            <Form.Label>New Phone Number</Form.Label>
            <Form.Control
              type="number"
              name="userPhoneNumber"
              onChange={handleInputChange}
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
        <div>
          {details.map((val, id) => {
            return (
              <p key={id} className="pt-2 ">
                {val.itemName}
              </p>
            );
          })}
        </div>
      </Container>
    </>
  );
}

export default EditProfile;
