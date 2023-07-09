import React, { useState } from "react";
import { request } from "request/Axios";
import { Input, Modal, Form,message , DatePicker} from "antd";
import moment from "moment/moment";
const EditHomework = ({
  editName,
  openModa2,
  setOpenModa2,
  setEditName,
  setrefesh,
  id
}) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [form] = Form.useForm();
  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };
  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        request({
          url: "/task",
          method: "put",
          data: {
            id: editName.id,
            title : values.title,
            given_date : selectedDate,
            group_id : id-0
          },
          headers: {
            Authorization: localStorage.getItem("auth_token"),
          },
        }).then((resdata) => {
          if (resdata.status === 200) {
            form.resetFields();
            setOpenModa2(false);
            setrefesh(true);
           message.success({ content: `Vazifa malumoti uzgartirildi`, duration: 2 });

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
        <h4>Vazifa malumotini o'zgartirish</h4>
        <Form form={form}>
              <Form.Item
                    label="Vazifa berilgan sana"
                    name="given_date"
                    rules={[
                      {
                          required: true,
                          message: "Iltimos vazifa berilgan sanani yozing",
                        },
                    ]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      onChange={handleDateChange}
                      value={selectedDate ? moment(selectedDate, 'YYYY-MM-DD') : null}
                      className="w-100" />
             </Form.Item>
                        <Form.Item
                                label="Vazifa"
                                name="title"
                                rules={[
                                  {
                                    required: true,
                                    message: "Iltimos vazifani yozing",
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

export default EditHomework;

