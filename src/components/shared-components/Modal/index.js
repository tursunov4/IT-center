import { Modal,  } from "antd";

const ModalCon = ({ children }) => {

    const showModal = () => {
        setOpenModal(true);
      };
    
      const hideModal = () => {
        setOpenModal(false);
      };
  return (
    <Modal title="Create a new collection" okText="Ok">
      {children}
    </Modal>
  );
};

export default ModalCon;
