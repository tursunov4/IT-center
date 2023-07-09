import { request } from "request/Axios";
import {
  Input,
  Modal,
  Form,
  message,
  Row,
  Col,
  InputNumber,
  Radio,
  Button,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { API_BASE_URL } from "configs/AppConfig";

const EditStudent = ({
  editName,
  openModa2,
  setOpenModa2,
  setEditName,
  setrefesh,
  id
 
}) => {


  const [form2] = Form.useForm();


  const handleCreate = () => {
  
    form2
      .validateFields()
      .then((values) => {
       console.log(values.photo);
        request({
          url: "/student",
          method: "put",
          data: {
            age: values.age,
            first_name: values.first_name,
            gender: values.gender,
            last_name: values.last_name,
            group_id : +id,
            phone_number: values.phone_number,
            photo:Array.isArray(values.photo) ? values.photo[0].response.body.photo_url : editName.photo,
            t_username: values.t_username,
            id: editName.id,
            started_bot: true,
            telegram_id: 0,
          
          },
          headers: {
            Authorization: localStorage.getItem("auth_token"),
          },
        }).then((resdata) => {
          if (resdata.status === 200) {
            setOpenModa2(false);
            setrefesh(true);

            message.success({
              content: " Ma'lumot  o'zgartirildi",
              duration: 2,
            });

            form2.resetFields();
            setTimeout(() => {
                setrefesh(false);
              }, 1000);
              setEditName(null);
          }
        });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
        // setOpenModal(false);
        // message.error({
        //   content: "Aloqa yo'q yoki siz hech qanday malmot jo'natmadingiz",
        //   duration: 2,
        // });
        // form.resetFields();
      });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };

  form2.setFieldsValue({
    age: editName?.age,
    first_name: editName?.first_name,
    gender: editName?.gender,
    last_name: editName?.last_name,
    phone_number: editName?.phone_number,
    photo: editName?.photo,
    t_username: editName?.t_username,
    

  });

  const modalCasel = () => {
    setOpenModa2(false);
   
  setEditName(null)
     
  };
  return (
    <>
      <Modal
        title="O'quvchi  malumotlarnini tahrirlash"
        centered
        open={openModa2}
        onOk={handleCreate}
        width={600}
        onCancel={modalCasel}
      >
        <h4>{editName?.last_name} nomini o'zgartiring</h4>
        <Form form={form2}  layout="vertical">
        <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Isim"
                    name="first_name"
                    rules={[
                      {
                        required: true,
                        message: "Iltimos isim nomini yozing",
                      },
                    ]}
                  >
                    <Input size="small" className="w-100" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Familiya"
                    name="last_name"
                    rules={[
                      {
                        required: true,
                        message: "Iltimos familiya nomini yozing",
                      },
                    ]}
                  >
                    <Input size="small" className="w-100" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Yosh"
                    name="age"
                    rules={[
                      {
                        required: true,
                        message: "Iltimos yosh kiriting",
                      },
                    ]}
                  >
                    <InputNumber size="small" lassName="w-100" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Telefon raqam"
                    name="phone_number"
                    rules={[
                      {
                        required: true,
                        message: "Iltimos Telefon raqam nomini yozing",
                      },
                    ]}
                  >
                    <Input
                      defaultValue="998"
                      maxLength={12}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      size="small"
                      className="w-100"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Telegram username"
                    name="t_username"
                    rules={[
                      {
                        required: true,
                        message: "Iltimos username nomini yozing",
                      },
                    ]}
                  >
                    <Input size="small" className="w-100" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    name="gender"
                    label="Jinsni belgilang"
                    rules={[
                      {
                        required: true,
                        message: "Iltimos username nomini yozing",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value="erkak">Erkak</Radio>
                      <Radio value="ayol">Ayol</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>

                <Form.Item
                  name="photo"
                  label="Upload"
                  valuePropName=""
                  getValueFromEvent={normFile}
                  extra="Format .png .jpg,  Max 5 MB "
                >
                  <Upload
                    name="file"
                    maxCount={1}
                    action={`${API_BASE_URL}/media/photo`}
                    listType="picture"
                  >
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form.Item>
              </Row>
        </Form>
      </Modal>
    </>
  );
};

export default EditStudent;
