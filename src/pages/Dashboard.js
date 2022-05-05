import Navigation from "../components/navigation";
import { Container, Badge, Row, Col, Table, Button } from "react-bootstrap";
import Footer from "../components/footer";
import { auth, db } from "../firebase.config";
import { getDocs, query, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  BarChartFill,
  ArchiveFill,
  FileEarmarkRuledFill,
  PenFill,
  PeaceFill,
} from "react-bootstrap-icons";
import React, { useState, useEffect } from "react";
function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [currentUser, loading] = useAuthState(auth);

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
      console.log(transactionArray);
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
                      <p key={purchases.id}>{purchases["itemPurchasedName"]}</p>
                    ))}
                  </td>
                  <td>{computeTotal(data["transactionItems"])}</td>
                  <td>
                    <Button>Refund</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
        <Footer />
      </div>
    </>
  );
}

export default Dashboard;
