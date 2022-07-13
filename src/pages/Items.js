import React, { useState, useEffect } from "react";
import Navigation from "../components/navigation";
import { Container, Badge, Button, Modal, Row, Col } from "react-bootstrap";
import { auth, db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { collectionGroup, doc, getDoc, onSnapshot } from "firebase/firestore";
import BootstrapTable from "react-bootstrap-table-next";
import pagination from "react-bootstrap-table2-paginator";
import { Link } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { getDocs, query, collection } from "firebase/firestore";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

function Items() {
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [currentUser] = useAuthState(auth);
  const navigate = useNavigate();

  const fetchItem = async () => {
    if (currentUser != null) {
      const myQuery = query(collection(db, "Users", currentUser?.uid, "Items"));
      const querySnapshot = await getDocs(myQuery);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push({ ...doc.data(), id: doc.id });
      });
      setItems(transactionArray);
      console.log(transactionArray);
    } else {
      console.log("No items!");
    }
  };

  async function getTransactions() {
    const myQuery = query(
      collection(db, "Users", currentUser?.uid, "Transaction")
    );
    const querySnapshot = await getDocs(myQuery);
    let transactionArray = [];
    querySnapshot.forEach((doc) => {
      transactionArray.push({ ...doc.data(), id: doc.id });
    });
    setTransactions(transactionArray);
  }
  function computeTransactions(transactionArray, itemID) {
    let count = 0;
    transactionArray.map((transaction) => {
      transaction.transactionItems.map((itemPurchased) => {
        if (itemPurchased["itemPurchasedID"] == itemID) {
          count = count + 1;
        }
      });
    });
    return count;
  }

  useEffect(() => {
    if (loading) return;
    fetchItem();
    getTransactions();
  }, [currentUser, loading]);
  //for table
  const columns = [
    {
      dataField: "id",
      text: "#",
    },
    {
      dataField: "itemName",
      text: "Item",
    },
    {
      dataField: "itemPrice",
      text: "Price",
    },
    {
      dataField: "itemCost",
      text: "Cost",
    },
    {
      dataField: "itemQuantity",
      text: "Stocks",
    },
    {
      dataField: "reorderPoint",
      text: "Re-order Point",
      formatter: (rowContent, row) => {
        return <p>{computeTransactions(transactions, row.id)}</p>;
      },
    },
    {
      dataField: "itemCategory",
      text: "Category",
    },
    {
      dataField: "link",
      text: "Action",
      formatter: (rowContent, row) => {
        return (
          <div>
            <Link to={`/item/${row.id}`}>
              <Button color="dark" className="mr-2">
                Change
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  const pgnate = pagination({
    page: 1,
    sizePerPage: 5,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    alwaysShowAllBtns: true,
    onPageChange: function (page, sizePerPage) {
      console.log("page", page);
    },
  });

  //modal function
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const rowEvents = {
    onClick: (e, row) => {
      setModalInfo(row);
      toggle();
    },
  };

  const toggle = () => {
    setShowModal(handleShow);
  };

  const ModalContent = () => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            <Badge pill bg="info">
              Barcode:
            </Badge>{" "}
            {modalInfo.itemBarcode}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={7}>
                <img
                  src={modalInfo.itemImageURL}
                  className="img-fluid"
                  width="240px"
                  height="240px"
                />
              </Col>
              <Col xs={5}>
                <h4 style={{ fontWeight: "bold" }}>{modalInfo.itemName}</h4>
                <p>
                  <span style={{ marginRight: "5px" }}>
                    <strong>Stock:</strong>
                  </span>
                  {modalInfo.itemQuantity}
                </p>
                <p>
                  <span style={{ marginRight: "5px" }}>
                    <strong>Price:</strong>
                  </span>
                  <span>₱</span>
                  {modalInfo.itemPrice}
                </p>
                <p>
                  <span style={{ marginRight: "5px" }}>
                    <strong>Cost:</strong>
                  </span>
                  <span>₱</span>
                  {modalInfo.itemCost}
                </p>
                <p>
                  <span style={{ marginRight: "5px" }}>
                    <strong>Category:</strong>
                  </span>
                  <Badge pill bg="warning" text="dark">
                    {modalInfo.itemCategory}
                  </Badge>
                </p>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const rowStyle = (row, rowIndex) => {
    let quantity = row["itemQuantity"];
    let itemID = row["id"];
    if (quantity < computeTransactions(transactions, itemID)) {
      return { background: "#E57373" };
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <h4>
          <Badge className="mt-3">Inventory Items</Badge>
        </h4>

        <BootstrapTable
          keyField="id"
          data={items}
          columns={columns}
          striped
          hover
          condensed
          rowStyle={rowStyle}
          pagination={pgnate}
          rowEvents={rowEvents}
        />

        {show && <ModalContent />}
      </Container>
    </>
  );
}

export default Items;
