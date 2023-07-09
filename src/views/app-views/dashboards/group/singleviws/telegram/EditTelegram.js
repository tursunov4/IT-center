import React from "react";
import { request } from "request/Axios";
import { Input, Modal, Form,message } from "antd";

const EditTelegram = ({
  editName,
  openModa2,
  setOpenModa2,
  setEditName,
  setrefesh,
  assisent
}) => {

  const [form] = Form.useForm();

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        request({
          url: "/telegram-messages",
          method: "put",
          data: {
            id: editName.id,
            message : values.title ,
          },
          headers: {
            Authorization: localStorage.getItem("auth_token"),
          },
        }).then((resdata) => {
          if (resdata.status === 200) {
            form.resetFields();
            setOpenModa2(false);
            setrefesh(true);
           message.success({ content: `Habar uzgartirildi`, duration: 2 });

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

  form.setFieldsValue({ title: editName?.message });

  const modalCasel = () => {
    setOpenModa2(false);
    setEditName(null)
  };
  return (
    <div>
      <Modal
        title="Yangi guruh yaratish"
        centered
        open={openModa2}
        onOk={handleCreate}
        onCancel={modalCasel}
      >
        <h4>{editName?.title_uz} nomini o'zgartiring</h4>
        <Form form={form}>
        <Form.Item
                label="Habar"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Iltimos habarni yozing",
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

export default EditTelegram
