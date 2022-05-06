import Navigation from "../components/navigation";
import {
  Container,
  Badge,
  Row,
  Col,
  Table,
  Button,
  Modal,
} from "react-bootstrap";
import Footer from "../components/footer";
import { auth, db } from "../firebase.config";
import { ref } from "firebase/storage";

import { getDocs, query, collection, doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  BarChartFill,
  ArchiveFill,
  FileEarmarkRuledFill,
  PenFill,
  PeaceFill,
} from "react-bootstrap-icons";
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [currentUser, loading] = useAuthState(auth);

  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);

  const [loader, setLoading] = useState(false);

  // const initialState = [{
  //   transactionCashier: "",
  //   transactionItems: [
  //     {
  //       itemProductCost: "",
  //       itemPurchasedName: "",
  //     },
  //   ],
  //   transactionID: "",
  // }];

  const [data, setData] = useState([]);
  // const {
  //   transactionCashier,
  //   transactionItems[{itemProductCost},{itemPurchasedName}],
  //   transactionID,
  // } = data;

  const navigate = useNavigate();

  //Read user transactions
  //param uid of the current user
  const getTransactions = async () => {
    if (currentUser != null) {
      const myQuery = query(
        collection(db, "Users", currentUser?.uid, "Transaction")
      );
      const querySnapshot = await getDocs(myQuery);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push({ ...doc.data(), id: doc.id });
      });
      setTransactions(transactionArray);
    } else {
      console.log("No user!");
    }
  };

  //count item sold
  //param array(transactions)
  //return type int
  const getItemSold = (transaction) => {
    let count = 0;
    if (transaction.length > 0) {
      transaction.map((data) => {
        count = count + data["transactionItems"].length;
      });
    }
    return count;
  };
  //modal function
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  //compute total sales
  //param array(transactions)
  //return type int
  const getTotalSales = (transaction) => {
    let total = 0;
    if (transaction.length > 0) {
      transaction.map((data) => {
        const itemArray = data["transactionItems"];
        itemArray.map((purchases) => {
          if (purchases["itemPurchasedIsRefunded"] == false) {
            total = total + purchases["itemPurchasedPrice"];
          }
        });
      });
    }
    return total;
  };

  //compute refunded items
  //param array(transactions)
  //return type int
  const getRefundedItems = (transaction) => {
    let refundedCount = 0;
    if (transaction.length > 0) {
      transaction.map((data) => {
        const itemArray = data["transactionItems"];
        itemArray.map((purchases) => {
          if (purchases["itemPurchasedIsRefunded"] == true) {
            refundedCount = refundedCount + purchases["itemPurchasedPrice"];
          }
        });
      });
    }
    return refundedCount;
  };

  //compute cost of goods
  //param array(transactions)
  //return type int
  const getCostOfGoods = (transaction) => {
    let goods = 0;
    if (transaction.length > 0) {
      transaction.map((data) => {
        const itemArray = data["transactionItems"];
        itemArray.map((purchases) => {
          goods = goods + purchases["itemPurchasedCost"];
        });
      });
      return goods;
    }
  };

  const computeTotal = (array) => {
    let total = 0;
    array.map((purchases) => {
      if (!purchases["itemPurchasedIsRefunded"]) {
        total = total + purchases["itemPurchasedPrice"];
      }
    });
    return total;
  };
  useEffect(() => {
    if (loading) return;
    getTransactions();
  }, [currentUser, loading]);

  useEffect(() => {
    data && updateItemRefund();
  }, [data]);
  const updateItemRefund = async (purchase) => {
    if (purchase != null) {
      try {
        const ref = doc(db, "Users", currentUser?.uid, "Transaction", purchase);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          setData({ ...docSnap.data() });
          setShowModal(handleShow);
        } else {
          console.log("NO Data ");
        }
      } catch (error) {
        console.log(error);
      }
    }

    // try {
    //   await (updateDoc(
    //     db,
    //     "Users",
    //     currentUser?.uid,
    //     "Transaction",
    //     purchase
    //   ),
    //   {
    //     transactionItems: [{ itemPurchasedIsRefunded: true }],
    //   },
    //   {
    //     merge: true,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const ModalContent = () => {
    return (
      <Modal show={show} onHide={handleClose}>
        ()
        <Modal.Header>
          {data.map((p)=>)}
          <Modal.Title>
            <Badge pill bg="info">
              Barcode:
            </Badge>{" "}
            {/* {modalInfo.itemBarcode} */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={7}>
                {/* <img
                  src={modalInfo.itemImageURL}
                  className="img-fluid"
                  width="240px"
                /> */}
              </Col>
              <Col xs={5}>
                {/* <h4 style={{ fontWeight: "bold" }}>{modalInfo.itemName}</h4> */}
                <p>
                  <span style={{ marginRight: "5px" }}>
                    <strong>Stock:</strong>
                  </span>
                  {}
                </p>
                <p>
                  <span style={{ marginRight: "5px" }}>
                    <strong>Price:</strong>
                  </span>
                  <span>₱</span>
                  {}
                </p>
                <p>
                  <span style={{ marginRight: "5px" }}>
                    <strong>Cost:</strong>
                  </span>
                  <span>₱</span>
                  {/* {modalInfo.itemCost} */}
                </p>
                <p>
                  <span style={{ marginRight: "5px" }}>
                    <strong>Category:</strong>
                  </span>
                  <Badge pill bg="warning" text="dark">
                    {/* {modalInfo.itemCategory} */}
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
  return (
    <>
      <Navigation />
      <div className="main-wrapper">
        <Container>
          <Row className="mt-3 gap-3 ">
            <h6>
              <Badge className="mt-3">Statistics</Badge>
            </h6>
            <Col className="stats">
              <BarChartFill />
              <h6>Total Sales</h6>
              <p>{getTotalSales(transactions)}</p>
            </Col>
            <Col className="stats">
              <ArchiveFill />
              <h6>Transactions</h6>
              <p>{transactions.length}</p>
            </Col>
            <Col className="stats">
              <FileEarmarkRuledFill />
              <h6>Total Items</h6>
              <p>{getItemSold(transactions)}</p>
            </Col>
            <Col className="stats">
              <PenFill />
              <h6>Cost of Goods</h6>
              <p>{getCostOfGoods(transactions)}</p>
            </Col>
            <Col className="stats">
              <PeaceFill />
              <h6>Total Refunds</h6>
              <p>{getRefundedItems(transactions)}</p>
            </Col>
            <Col className="stats">
              <PeaceFill />
              <h6>Profit</h6>
              <p>
                {getTotalSales(transactions) - getCostOfGoods(transactions)}
              </p>
            </Col>
          </Row>
          <Row className="mt-3">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Cahier Name</th>
                  <th>Purchases</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((data) => (
                  <tr key={data.id}>
                    <td>{data["transactionTimestamp"]}</td>
                    <td>{data["transactionCashier"]}</td>

                    <td>
                      {data["transactionItems"].map((purchases) => (
                        <p key={purchases.id}>
                          {purchases["itemPurchasedName"]}
                        </p>
                      ))}
                    </td>
                    <td>{computeTotal(data["transactionItems"])}</td>
                    <td>
                      <Button
                        onClick={() => {
                          const purchaseid = data["transactionID"];
                          updateItemRefund(purchaseid);
                        }}
                      >
                        Refund
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </Container>
        <Footer />
        {show && <ModalContent />}
      </div>
    </>
  );
}

export default Dashboard;
