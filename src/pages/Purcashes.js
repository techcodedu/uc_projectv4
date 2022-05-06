import { async } from "@firebase/util";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Badge, Container, Row } from "react-bootstrap";
import Navigation from "../components/navigation";
import { db } from "../firebase.config";

function Purcashes() {
  const [purchased, setPurchase] = useState(null);
  const [cashier, setCashier] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchPurchasesItems = async () => {
      const q = query(
        collectionGroup(db, "Transaction"),
        where("transactionItems"["itemPurchasedIsRefunded"], "==", "false")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setPurchase(doc.data());
      });
    };
    fetchPurchasesItems();
  }, []);
  console.log(purchased);
  return (
    <>
      <Navigation />
      <Container>
        <Row>
          <h4>
            <Badge className="mt-3">Purchased Items</Badge>
          </h4>
        </Row>
      </Container>
    </>
  );
}

export default Purcashes;
