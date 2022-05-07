import React, { useEffect, useState } from "react";
import Navigation from "../components/navigation";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, FormGroup } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase.config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function ChangeItem() {
  const { id } = useParams();
  const [currentUser, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const [details, setDetails] = useState({
    itemImageURL: "",
    itemName: "",
    itemCategory: "",
    itemCost: "",
    itemPrice: "",
    itemQuantity: "",
  });

  //profile image upload useffect
  useEffect(() => {
    const uploadFile = () => {
      const storage = getStorage();
      var storagePath = "items/" + file.name;
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
            setDetails((prev) => ({ ...prev, itemImageURL: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  //Read user documents and collection
  //param uid of the current user
  async function fetchItem(currentUser) {
    const ref = doc(db, "Users", currentUser?.uid, "Items", id);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      setDetails(docSnap.data());
      console.log(docSnap.data());
    } else {
      setDetails({});
    }
    return () => {
      setDetails({});
    };
  }

  const onChange = (e) => {
    setDetails((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const ref = doc(db, "Users", currentUser?.uid, "Items", id);
      await updateDoc(ref, details).then(function() {
        console.log("Success");
        navigate("/items");
      });
    } catch (error) {
      setError("Failed to Login", error);
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchItem(currentUser);
  }, [currentUser, loading]);

  return (
    <>
      <Navigation />
      <Container>
        <h2>Edit Items</h2>
        <Form onSubmit={onSubmit}>
          <img src={details.itemImageURL} width="200" height="200" />
          <Form.Group id="itemName" className="mb-3">
            <Form.Label>Item name</Form.Label>
            <Form.Control
              type="text"
              onChange={onChange}
              name="itemName"
              id="itemName"
              defaultValue={details.itemName}
            />
          </Form.Group>
          <Form.Group className="mb-3" id="itemCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="itemCategory"
              id="itemCategory"
              onChange={onChange}
              defaultValue={details.itemCategory}
            />
          </Form.Group>

          <Form.Group className="mb-3" id="itemQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="itemQuantity"
              id="itemQuantity"
              onChange={onChange}
              defaultValue={details.itemQuantity}
            />
          </Form.Group>

          <Form.Group className="mb-3" id="itemCost">
            <Form.Label>Cost</Form.Label>
            <Form.Control
              type="number"
              name="itemCost"
              id="itemCost"
              onChange={onChange}
              defaultValue={details["itemCost"]}
            />
          </Form.Group>

          <Form.Group className="mb-3" id="itemPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="itemPrice"
              id="itemPrice"
              onChange={onChange}
              defaultValue={details.itemPrice}
            />
          </Form.Group>

          <Form.Group>
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

export default ChangeItem;
