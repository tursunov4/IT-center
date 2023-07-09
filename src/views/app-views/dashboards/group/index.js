import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Typography,
  Tooltip,
  Modal,
  Form,
  Spin,
  Col,
  Row,
  Upload,
  TimePicker,
  DatePicker,
  Checkbox,
  Avatar,
  message,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  LoadingOutlined,
  UploadOutlined,
  DownOutlined,
} from "@ant-design/icons";
import ProductListData from "assets/data/product-list.data.json";
import moment from "moment/moment";
import { API_BASE_URL } from "configs/AppConfig";
import AvatarStatus from "components/shared-components/AvatarStatus";
import { Link, useNavigate } from "react-router-dom";
import Flex from "components/shared-components/Flex";
import { request } from "request/Axios";
import Editgroup from "./Editgroup";
const format = "HH:mm";
const asisten = localStorage.getItem('asisten')
const { Option } = Select;
const Group = () => {
  const [editName, setEditName] = useState(null);
  const [groupData, setGroupData] = useState([]);
  const navigate = useNavigate();
  const [list, setList] = useState(ProductListData);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { Text } = Typography;
  const [seldataGet, setSelDataGet] = useState([]);
  const [major, setMajor] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [room, setRoom] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModa2, setOpenModa2] = useState(false);
  const [refesh, setrefesh] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState({
    du: false,
    se: false,
    chor: false,
    pa: false,
    ju: false,
    shan: false,
    yak: false,
  });

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 50,
      }}
      spin
    />
  );
  const getData = async () => {
    setLoading(true);
    request({
      url:
        "/group/list?" +
        new URLSearchParams({
          limit: 10000,
          page: 1,
          newest_first: true
        }),
      headers: {
          Authorization: localStorage.getItem("auth_token"),
        },
    }).then((resdata) => {
      if (resdata.status === 200 && resdata.data.body.count > 0) {
        setGroupData(resdata.data.body.groups);
        setLoading(false);
      } else {
        setGroupData([]);
      }
    });
  };

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
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };

  const searchData = () => {
    request({
      url:
        "/group/list?" +
        new URLSearchParams({
          search: search,
          newest_first: true,
          limit: 10000,
          page: 1,
        }),
      headers: {
          Authorization: localStorage.getItem("auth_token"),
        },
    }).then((resdata) => {
      if (resdata.status === 200 && resdata.data.body.count > 0) {
        setGroupData(resdata.data.body.groups);
        setLoading(false);
      } else {
        setGroupData([]);
      }
    });
  };
  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(selectedTime);

        form.resetFields();
        request({
          url: "/group",
          method: "post",
          data: {
            assistant_id: values.assistant_id,
            group_number: values.group_number,
            lesson_days: {
              ...checkboxValues,
            },
            lesson_time: selectedTime,
            major_id: values.major_id,
            open_date: selectedDate,
            photo:
              values.photo !== undefined
                ? values.photo[0].response.body.photo_url
                : "",
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
            setOpenModal(false);
            setrefesh(true);
            message.success({ content: `Guruh qo'shildi`, duration: 2 });

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

  const deleteUser = (id) => {
    request({
      url: `/group/${id}`,
      method: "delete",
      // data: {id},
      headers: {
        Authorization: localStorage.getItem("auth_token"),
      },
    }).then((resdata) => {
      if (resdata.status === 200) {
        setrefesh(true);
        message.success({ content: `Deleted group ${id}`, duration: 2 });

        setTimeout(() => {
          setrefesh(false);
        }, 1000);
      }
      console.log(resdata.status);
    });
  };

  const showModal = () => {
    setOpenModal(true);
  };

  const hideModal = () => {
    setOpenModal(false);
  };
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCheckboxChange = (name) => (e) => {
    const { checked } = e.target;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [name]: checked,
    }));
  };
  const editData = (item) => {
    setEditName(item);

    setOpenModa2(true);
  };
  useEffect(() => {
    getMajor();
    getRoom();
    getAsissant();
  }, []);
  useEffect(() => {
    getData();
  }, [refesh]);
  useEffect(() => {
    searchData();
  }, [search]);

  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Guruh rasmi",
      dataIndex: "photo",
      render: (_, record) => (
        <div className="d-flex">
          {record.photo !== "" ? (
            <AvatarStatus size={60} type="square" src={record.photo} />
          ) : (
            <Avatar
              shape="square"
              style={{ backgroundColor: "#f56a00" }}
              size={60}
            >
              {record.title.slice(0, 1)}
            </Avatar>
          )}
        </div>
      ),
    },
    {
      title: "Guruh nomi",
      dataIndex: "title",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.title}</Text>
        </div>
      ),
    },
    {
      title: "Assosiy ustoz",
      dataIndex: "teacher_name",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.teacher_name}</Text>
        </div>
      ),
    },
    {
      title: "Yordamichi ustoz",
      dataIndex: "assistant",
      render: (_, record) => (
        <div className="d-flex">
          <Text>
            {record.assistant.first_name} {record.assistant.last_name}
          </Text>
        </div>
      ),
    },
    {
      title: "Guruh raqami",
      dataIndex: "group_number",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.group_number}</Text>
        </div>
      ),
    },

    {
      title: "Yo'nalishi",
      dataIndex: "major",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.major.title_uz}</Text>
        </div>
      ),
    },
    {
      title: "O'quvchilar soni",
      dataIndex: "student_count",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.student_count}</Text>
        </div>
      ),
    },

    {
      title: "Xona",
      dataIndex: "room",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.room.title}</Text>
        </div>
      ),
    },
    {
      title: "Yo'nalishi",
      dataIndex: "major",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.major.title_uz}</Text>
        </div>
      ),
    },

    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right d-flex justify-content-end">
          {
            asisten ? '':
          <Tooltip title="Edit">
            <Button
              to={`/app/dashboard/klent/view/${elm.id}`}
              type="primary"
              className="mr-2"
              onClick={() => editData(elm)}
              size="small"
              icon={<EditOutlined />}
            />
          </Tooltip>
          }
          {
            asisten ? '':
            <Tooltip title="Delete">
            <Button
              danger
              className="mr-2"
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteUser(elm.id);
              }}
              size="small"
            />
          </Tooltip>
          }
         


          <Tooltip title="View">
            <Link size="small" to={`/app/dashboard/group/view/${elm.id}`}>
              <Button icon={<EyeOutlined />} />
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];
  if (!loading) {
    return (
      <Card>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
        >
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </Flex>
          <div>
            {
              asisten ? '' :
            <Button
              type="primary"
              onClick={showModal}
              icon={<PlusCircleOutlined />}
              block
            >
              Add product
            </Button>
            }
          </div>
        </Flex>
        <div className="table-responsive">
          <Table columns={tableColumns} dataSource={groupData} rowKey="id" />
          <Modal
            title="Yangi guruh yaratish"
            centered
            width={600}
            open={openModal}
            onOk={handleCreate}
            onCancel={() => setOpenModal(false)}
          >
            <Form form={form} initialValues={editName} layout="vertical">
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
                      value={
                        selectedTime ? moment(selectedTime, "HH:mm") : null
                      }
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
                      value={
                        selectedDate ? moment(selectedDate, "YYYY-MM-DD") : null
                      }
                      className="w-100"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item name="room_id" label="Xonani tanlang">
                    <Select className="w-100" placeholder="Xonalar">
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
                  <Form.Item
                    name="assistant_id"
                    label="Yordamchi o'qituvchini tanlang"
                  >
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
                    <Checkbox name="du" onChange={handleCheckboxChange("du")}>
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
          <Editgroup
            editName={editName}
            openModa2={openModa2}
            setOpenModa2={setOpenModa2}
            setEditName={setEditName}
            setrefesh={setrefesh}
          />
        </div>
      </Card>
    );
  } else {
    return (
      <Spin
        indicator={antIcon}
        style={{ textAlign: "center", width: "100%", marginTop: "150px" }}
      />
    );
  }
};

export default Group;

   
