import Navigation from "../components/navigation";
import { Container, Badge, Row, Col } from "react-bootstrap";
import Footer from "../components/footer";

import {
  BarChartFill,
  ArchiveFill,
  FileEarmarkRuledFill,
  PenFill,
  PeaceFill,
} from "react-bootstrap-icons";

function Dashboard() {
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
              <p>0.000</p>
            </Col>
            <Col className="stats">
              <ArchiveFill />
              <h6>Transactions</h6>
              <p>0.000</p>
            </Col>
            <Col className="stats">
              <FileEarmarkRuledFill />
              <h6>Total Items</h6>
              <p>0.000</p>
            </Col>
            <Col className="stats">
              <PenFill />
              <h6>Cost of Goods</h6>
              <p>0.000</p>
            </Col>
            <Col className="stats">
              <PeaceFill />
              <h6>Profit</h6>
              <p>0.000</p>
            </Col>
          </Row>
          <Row>
            <h6>
              <Badge className="mt-3">Cashier Transactions</Badge>
            </h6>
            <Col>
              <div>Time</div>
              <p>8:00 A.M</p>
            </Col>
            <Col>
              <div>Cashier Name</div>
              <p>Juan Dela Cruz</p>
            </Col>
            <Col>
              <div>Item Purchased</div>
              <p>Piataos x1</p>
              <p>Nova x3</p>
            </Col>
            <Col>
              <div>Total</div>
              <p>200</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>Time</div>
              <p>8:00 A.M</p>
            </Col>
            <Col>
              <div>Cashier Name</div>
              <p>Juan Dela Cruz</p>
            </Col>
            <Col>
              <div>Item Purchased</div>
              <p>Piataos x1</p>
              <p>Nova x3</p>
            </Col>
            <Col>
              <div>Total</div>
              <p>200</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>Time</div>
              <p>8:00 A.M</p>
            </Col>
            <Col>
              <div>Cashier Name</div>
              <p>Juan Dela Cruz</p>
            </Col>
            <Col>
              <div>Item Purchased</div>
              <p>Piataos x1</p>
              <p>Nova x3</p>
            </Col>
            <Col>
              <div>Total</div>
              <p>200</p>
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>
    </>
  );
}

export default Dashboard;
