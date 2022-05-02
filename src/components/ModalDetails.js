import React from "react";
import { Modal, Header, Button } from "semantic-ui-react";

function ModalDetails({ open, setOpen }) {
  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)}>
      <Modal.Header>Item Details</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Header>test</Header>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ModalDetails;
