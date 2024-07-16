import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const DeleteConfirmationModal = ({ show, onHide, onDelete }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Reset</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to reset all filters?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Reset
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
