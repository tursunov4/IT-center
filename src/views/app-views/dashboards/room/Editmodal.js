import React from "react";
import { request } from "request/Axios";
import { Input, Modal, Form,message } from "antd";

const Editmodal = ({
  editName,
  openModa2,
  setOpenModa2,
  setEditName,
  setrefesh,
}) => {

  const [form] = Form.useForm();

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        request({
          url: "/room",
          method: "put",
          data: {
            id: editName.id,
            ...values,
          },
          headers: {
            Authorization: localStorage.getItem("auth_token"),
          },
        }).then((resdata) => {
          if (resdata.status === 200) {
            form.resetFields();
            setOpenModa2(false);
            setrefesh(true);
           message.success({ content: `Xona nomi ${resdata.data.Body.title_uz} o'zgartirildi`, duration: 2 });

            setTimeout(() => {
              setrefesh(false);
            }, 1000);
            setEditName(null);
          }
          console.log();
        });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  form.setFieldsValue({ title: editName?.title });

  const modalCasel = () => {
    setOpenModa2(false);
    setEditName(null)
  };
  return (
    <div>
      <Modal
        title=" Xona nomini o'zgartirish"
        centered
        open={openModa2}
        onOk={handleCreate}
        onCancel={modalCasel}
      >
     
        <Form form={form}>
          <Form.Item
            label="Xona nomi"
            name="title"
            rules={[
              {
                required: true,
                message: "Iltimos xona nomini yozing",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Editmodal;
