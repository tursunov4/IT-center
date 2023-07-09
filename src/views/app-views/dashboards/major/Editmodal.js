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
          url: "/major",
          method: "put",
          data: {
            id: editName.id,
            title_en: "string",
            title_ru: "string",
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
           message.success({ content: `Yo'nalish nomi ${resdata.data.Body.title_uz} o'zgartirildi`, duration: 2 });

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

  form.setFieldsValue({ title_uz: editName?.title_uz });

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
            label="Guruh nomi"
            name="title_uz"
            rules={[
              {
                required: true,
                message: "Iltimos guruh nomini yozing",
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
