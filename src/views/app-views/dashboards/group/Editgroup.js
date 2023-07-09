import React from 'react'
import { useState, useEffect } from "react";
import { request } from "request/Axios";
import useForm from 'rc-field-form/lib/useForm';
import {Card,Table,Select,Input,Button,Typography,Tooltip, Modal,Form,Spin,Col,Row,Upload,TimePicker,DatePicker, Checkbox,  Avatar , message} from "antd";
import {  EyeOutlined,  DeleteOutlined,  SearchOutlined,  PlusCircleOutlined,  EditOutlined, LoadingOutlined,UploadOutlined,  DownOutlined} from "@ant-design/icons";
import { API_BASE_URL } from "configs/AppConfig";
import moment from "moment/moment";
const format = "HH:mm";
const { Option } = Select;
function Editgroup({ editName,openModa2,setOpenModa2,setEditName,  setrefesh,}) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const { Text } = Typography;
    const [seldataGet, setSelDataGet] = useState([]);
    const [major, setMajor] = useState([]);
    const [assistants, setAssistants] = useState([]);
    const [room, setRoom] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [openModal, setOpenModal] = useState(false);
    const [checkboxValues, setCheckboxValues] = useState({
      du: false,
      se: false,
      chor: false,
      pa: false,
      ju: false,
      shan: false,
      yak: false,
    });
    const getMajor = async () => {
        setLoading(true);
        request({
          url:
            "/major/list?" +
            new URLSearchParams({
              limit: 10000,
              page: 1,
            }),
        }).then((resdata) => {
          console.log(resdata);
          if (resdata.status === 200 && resdata.data.body.count > 0) {
            setMajor(resdata.data.body.majors);
            setLoading(false);
          } else {
            setMajor([]);
          }
        });
      };
      const getRoom = async () => {
        setLoading(true);
        request({
          url:
            "/room/list?" +
            new URLSearchParams({
              limit: 10000,
              page: 1,
            }),
        }).then((resdata) => {
          console.log(resdata);
          if (resdata.status === 200 && resdata.data.body.count > 0) {
            setRoom(resdata.data.body.rooms);
            setLoading(false);
          } else {
            setRoom([]);
          }
        });
      };
    
      const getAsissant = () => {
        request({
          url:
            "/assistant/list?" +
            new URLSearchParams({
              limit: 10000,
              page: 1,
            }),
        }).then((resdata) => {
          console.log(resdata);
          if (resdata.status === 200 && resdata.data.body.count > 0) {
            setAssistants(resdata.data.body.assistants);
            setLoading(false);
          } else {
            setRoom([]);
          }
        });
      };

      useEffect(() => {
    
        getMajor();
        getRoom();
        getAsissant();
      }, []);
    const handleCreate = () => {
        form
          .validateFields()
          .then((values) => {   
            console.log(selectedTime);    
            form.resetFields();
            request({
              url: "/group",
              method: "put",
              data: {
                id:editName.id,
                assistant_id: values.assistant_id,
                group_number: values.group_number,
                lesson_days: {
                  ...checkboxValues,
                },
                lesson_time: selectedTime,
                major_id: values.major_id,
                open_date: selectedDate,
                photo: values.photo !== undefined ? values.photo[0].response.body.photo_url : "",
                room_id: values.room_id,
                teacher_name: values.teacher_name,
                title: values.title,    
              },
              headers: {
                Authorization: localStorage.getItem("auth_token"),
              },
            }).then((resdata) => {
                if (resdata.status === 200) {
                    form.resetFields();
                    setOpenModa2(false);
                    setrefesh(true);
                   message.success({ content: `Guruh malumoti  o'zgartirildi`, duration: 2 });
        
                    setTimeout(() => {
                      setrefesh(false);
                    }, 1000);
                    setEditName(null);
                  }
            });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      };
      const handleTimeChange = (time, timeString) => {
        setSelectedTime(timeString);
      };
    
      const handleDateChange = (date, dateString) => {
        setSelectedDate(dateString);
      };
      form.setFieldsValue({ group_number: editName?.group_number ,
        teacher_name :editName?.teacher_name ,
        title:editName?.title,
        room_id:editName?.room.id,
        major_id:editName?.major.id,
        du:editName?.lesson_days.du,
        se:editName?.lesson_days.se,
        assistant_id:editName?.assistant.id

    });
    
      const modalCasel = () => {
        setOpenModa2(false);
        setEditName(null)
      };
      const handleCheckboxChange = (name) => (e) => {
        const { checked } = e.target;
        setCheckboxValues((prevValues) => ({
          ...prevValues,
          [name]: checked,
        }));
      };
      const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }
    
        return e?.fileList;
      };
  return (
    <div>
        <Modal
           title="Guruh malumotlarini o'zgartirish"
           centered
           open={openModa2}
           onOk={handleCreate}
           onCancel={modalCasel}
          >
              <Form form={form}  layout="vertical">
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Guruh raqami"
                    name="group_number"
                    rules={[
                      {
                        required: true,
                        message: "Iltimos  Guruh raqamini yozing",
                      },
                    ]}
                  >
                    <Input size="small" className="w-100" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Dars vaqti"
                    name="lesson_time"
                    rules={[
                      {
                        required: true,
                        message: "Iltimos dars vaqtini yozing",
                      },
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      showNow={false}
                      value={selectedTime ? moment(selectedTime, 'HH:mm') : null}
                      onChange={handleTimeChange}
                      suffixIcon={<DownOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="O'qituvchi ismi"
                    name="teacher_name"
                    rules={[
                      {
                        required: true,
                        message: "Iltimos O'qituvchi ismi yozing",
                      },
                    ]}
                  >
                    <Input size="small" className="w-100" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Guruh nomi"
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: "Iltimos Guruh  nomini yozing",
                      },
                    ]}
                  >
                    <Input size="small" className="w-100" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Guruh ochilgan sana"
                    name="open_date"
                    rules={[
                      {
                        required: true,
                        message: "Iltimos Guruh ochilgan sanani yozing",
                      },
                    ]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      onChange={handleDateChange}
                      value={selectedDate ? moment(selectedDate, 'YYYY-MM-DD') : null}
                      className="w-100" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12}>
                  <Form.Item name="room_id" label="Xonani tanlang">
                    <Select className="w-100" placeholder="xonalar">
                      {room.map((elm) => (
                        <Option key={elm.id} value={elm.id}>
                          {elm.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item name="major_id" label="Yo'nalishni tanlang">
                    <Select className="w-100" placeholder="Yo'nalishlar">
                      {major.map((elm) => (
                        <Option key={elm.id} value={elm.id}>
                          {elm.title_uz}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item name="assistant_id" label="Yordamchi o'qituvchini tanlang">
                    <Select className="w-100" placeholder="Assistant">
                      {assistants.map((elm) => (
                        <Option key={elm.id} value={elm.id}>
                          {elm.first_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
             
                <Col xs={24} sm={24} md={12}>
                  <Form.Item initialValue={checkboxValues}>
                    <Checkbox  name="du" onChange={handleCheckboxChange("du")}>
                      du
                    </Checkbox>
                    <Checkbox name="se" onChange={handleCheckboxChange("se")}>
                      se
                    </Checkbox>
                    <Checkbox
                      name="chor"
                      onChange={handleCheckboxChange("chor")}
                    >
                      chor
                    </Checkbox>
                    <Checkbox name="pa" onChange={handleCheckboxChange("pa")}>
                      pay
                    </Checkbox>
                    <Checkbox name="ju" onChange={handleCheckboxChange("ju")}>
                      ju
                    </Checkbox>
                    <Checkbox
                      name="shan"
                      onChange={handleCheckboxChange("shan")}
                    >
                      shan
                    </Checkbox>
                    <Checkbox name="yak" onChange={handleCheckboxChange("yak")}>
                      yak
                    </Checkbox>
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
    </div>
  )
}

export default Editgroup