import Navigation from "../components/navigation";
import BootstrapTable from "react-bootstrap-table-next";
import pagination from "react-bootstrap-table2-paginator";
import { Container, Badge, Row, Col } from "react-bootstrap";
import Footer from "../components/footer";
import { auth, db } from "../firebase.config";
import {
  getDocs,
  getDoc,
  query,
  collection,
  where,
  orderBy,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";
import "antd/dist/antd.css";
import {
  BarChartFill,
  ArchiveFill,
  FileEarmarkRuledFill,
  PenFill,
  PeaceFill,
  Valentine,
} from "react-bootstrap-icons";
import React, { useState, useEffect } from "react";
import RefundModal from "../modals/RefundModal";
import { DatePicker, Space } from "antd";
function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [currentUser, loading] = useAuthState(auth);

  const [modalInfo, setModalInfo] = useState({});
  const [modalShow, setModalShow] = React.useState(false);
  const dateFormat = "YYYY/MM/DD";
  const { RangePicker } = DatePicker;
  const customFormat = (value) => `Date: ${value.format(dateFormat)}`;

  function onChange(value) {
    console.log(startOfDay(value[0]));
    console.log(endOfDay(value[1]));
    getTransactions(startOfDay(value[0]), endOfDay(value[1]));
  }
  function onOk(value) {
    console.log("onOk: ", value);
  }
  //set the  time of the moment into (0-0-1)
  function startOfDay(moment) {
    var date = moment.toDate();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(1);
    return date.getTime();
  }
  //set the time of the moment into (23-59-59)
  function endOfDay(moment) {
    var date = moment.toDate();
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    return date.getTime();
  }
  function formatTimestamp(timestamp) {
    let current_datetime = new Date(timestamp);
    let formatted_date =
      current_datetime.getHours() +
      "-" +
      current_datetime.getMinutes() +
      "-" +
      current_datetime.getSeconds();
    return formatted_date;
  }
  //Read user transactions
  //param uid of the current user
  const getTransactions = async (startDate, endDate) => {
    if (currentUser != null) {
      const myQuery = query(
        collection(db, "Users", currentUser?.uid, "Transaction"),
        where("transactionTimestamp", ">", startDate),
        where("transactionTimestamp", "<", endDate),
        orderBy("transactionTimestamp", "desc")
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
  //for table
  const columns = [
    {
      dataField: "transactionTimestamp",
      text: "Time",
      formatter: (rowContent, row) => {
        return <p>{formatTimestamp(row["transactionTimestamp"])}</p>;
      },
    },
    {
      dataField: "transactionCashier",
      text: "Cashier name",
    },
    {
      dataField: "transactionItems",
      text: "Purchases",
      formatter: (rowContent, row) => {
        return <p>{row["transactionItems"].length}</p>;
      },
    },
    {
      dataField: "Total",
      text: "Total",
      formatter: (rowContent, row) => {
        return <p>{computeTotal(row["transactionItems"])}</p>;
      },
    },
  ];

  const rowEvents = {
    onClick: (e, row) => {
      setModalInfo(row);
      setModalShow(true);
      console.log(row);
    },
  };

  const pgnate = pagination({
    page: 1,
    sizePerPage: 10,
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
  useEffect(() => {
    if (loading) return;
    getTransactions(moment.valueOf(), moment.valueOf());
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
          <Container className="m-3">
            <RangePicker
              defaultValue={[
                moment("2022/05/07", dateFormat),
                moment("2022/05/07", dateFormat),
              ]}
              format={customFormat}
              onOk={onOk}
              onChange={onChange}
            />
          </Container>
          <BootstrapTable
            keyField="id"
            data={transactions}
            columns={columns}
            striped
            hover
            condensed
            pagination={pgnate}
            rowEvents={rowEvents}
          />
        </Container>
        <Footer />
      </div>

      <RefundModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        params={modalInfo}
        uid={currentUser?.uid}
      />
    </>
  );
}

export default Dashboard;
