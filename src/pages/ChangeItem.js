import React, { useEffect, useState } from "react";
import Navigation from "../components/navigation";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collectionGroup,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase.config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function ChangeItem() {
  const initialState = {
    itemName: "",
    itemCost: "",
    itemQuantity: "",
  };

  const [data, setData] = useState(initialState);
  const { itemName, itemCost, itemQuantity } = data;
  const { id } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [isSubmit, setIsSubmit] = useState(false);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  //fetch details data from Item Groups
  useEffect(() => {
    id && fetchItemDetails();
  }, [id]);

  //query snapshot from Item collection
  const fetchItemDetails = async () => {
    const item = query(
      collectionGroup(db, "Items"),
      where("itemBarcode", "==", id)
    );
    const querySnapshot = await getDocs(item);
    querySnapshot.forEach((doc) => {
      setData({ ...doc.data() });
    });
  };

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
  const handleItemSave = async (e) => {
    e.preventDefault();
    if (id) {
      try {
        const sfDocRef = doc(db, "Items", id);
        await runTransaction(db, async (transaction) => {
          const sfDoc = await transaction.get(sfDocRef);
          if (!sfDoc.exists()) {
            throw "Document does not exist!";
          }

          const newPopulation = sfDoc.data().population + 1;
          transaction.update(sfDocRef, { ...data });
        });
        console.log("Transaction successfully committed!");
      } catch (e) {
        console.log("Transaction failed: ", e);
      }
    }

    navigate("/items");

    // try {
    //   const sfDocRef = doc(db, "Users", user?.uid, "Items", id);
    //   await runTransaction(db, async (transaction) => {
    //     const sfDoc = await transaction.get(sfDocRef);
    //     if (!sfDoc.exists()) {
    //       throw "Document does not exist!";
    //     }

    //     const newPopulation = sfDoc.data().population + 1;
    //     transaction.update(sfDocRef, { ...data });
    //   });
    //   console.log("Transaction successfully committed!");
    // } catch (e) {
    //   console.log("Transaction failed: ", e);
    // }
    // try {
    //   const ref = doc(db, "Items", id);
    //   // Set the "capital" field of the city 'DC'
    //   return ref
    //     .updateDoc({
    //       ...data,
    //     })
    //     .then(() => {
    //       console.log("Document successfully updated!");
    //     })
    //     .catch((error) => {
    //       // The document probably doesn't exist.
    //       console.error("Error updating document: ", error);
    //     });
    // } catch (error) {}
    // try {
    //   const ref = doc(db, "Items", id);
    //   await updateDoc(ref, {
    //     ...data,
    //   }).then(() => {
    //     console.log("Document successfully updated!");
    //   });
    // } catch (error) {
    //   console.log("error");
    // }
  };
  // if (id) {
  //   try {
  //     await updateDoc(doc(db, "Items", id), {
  //       ...data,
  //       timestamp: serverTimestamp(),
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  //   try {
  //     const formDataCopy = {
  //       ...data,
  //       timestamp: serverTimestamp(),
  //     };

  //     console.log(data);
  //     const docRef = doc(db, "Items", id);
  //     await updateDoc(docRef, formDataCopy);
  //     setLoading(false);
  //     navigate("/items");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <>
      <Navigation />
      <Container>
        <h2>Edit Profile</h2>
        <Form onSubmit={handleItemSave}>
          <Form.Group className="mb-3">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              onChange={handleInputChange}
              name="itemName"
              value={itemName}
              autoFocus
            />

            <Form.Label>Item Cost</Form.Label>
            <Form.Control
              type="text"
              name="itemCost"
              onChange={handleInputChange}
              value={itemCost}
            />
            <Form.Label>Item Quantity</Form.Label>
            <Form.Control
              type="number"
              name="itemQuantity"
              onChange={handleInputChange}
              value={itemQuantity}
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

export default ChangeItem;
