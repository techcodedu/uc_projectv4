import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { db, auth } from "../firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function RefundModal(props) {
  const transaction = props.params;
  const transactionItems = props.params.transactionItems;
  const [btnColor, setBtnColor] = useState("red");

  const updatedPurchases = async (e, transactionID, transactionItems) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "Users", props?.uid, "Transaction", transactionID);
      await updateDoc(docRef, { transactionItems: transactionItems }).then(
        function () {
          console.log("Success");
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        ess
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>{props.uid}</p>
        <p>{transactionItems?.length}</p>
        <p>{transaction.transactionID}</p>
        <p>{transaction.transactionCashier}</p>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Cost</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {transactionItems?.map((purchases, index) => (
              <tr key={purchases.id}>
                <td>{index}</td>
                <td>{purchases["itemPurchasedName"]}</td>
                <td>{purchases["itemPurchasedCost"]}</td>
                <td>{purchases["itemPurchasedPrice"]}</td>
                <td>
                  {purchases["itemPurchasedIsRefunded"] ? (
                    <p>Refunded</p>
                  ) : (
                    <Button
                      onClick={() => {
                        purchases["itemPurchasedIsRefunded"] = true;
                        btnColor === "red"
                          ? setBtnColor("green")
                          : setBtnColor("red");
                      }}
                      style={{ color: btnColor }}
                    >
                      Refund
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button
          onClick={(e) => {
            updatedPurchases(e, transaction.transactionID, transactionItems);
          }}
        >
          Save Purchases
        </Button>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
export default RefundModal;
