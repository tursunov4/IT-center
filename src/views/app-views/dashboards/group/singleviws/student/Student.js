import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  Typography,
  Tooltip,
  Modal,
  Form,
  message,
  Empty,
  Spin,
  Row,
  Col,
  InputNumber,
  Select,
  Radio,
  Upload,
  Tag,
  Avatar,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { API_BASE_URL } from "configs/AppConfig";
import { request } from "request/Axios";
import Flex from "components/shared-components/Flex";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EditStudent from "./EditStudent";
const asisten = localStorage.getItem('asisten')

const Student = ({id}) => {
  
  const [dataGrop, setDataGroup] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModa2, setOpenModa2] = useState(false);
  const [refesh, setrefesh] = useState(false);
  const [search, setSearch] = useState("");
  const [editName, setEditName] = useState(null);

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const { Text } = Typography;
  const { Option } = Select;

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 50,
      }}
      spin
    />
  );

  //form post

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        request({
          url: "/student",
          method: "post",
          data: {
            age: values.age,
            first_name: values.first_name,
            gender: values.gender,
            last_name: values.last_name,
            group_id: +id,
            phone_number: values.phone_number,
            photo:
              values.photo !== undefined
                ? values.photo[0].response.body.photo_url
                : "",
            t_username: values.t_username,
            started_bot: true,
            telegram_id: 0,
          },
          headers: {
            Authorization: localStorage.getItem("auth_token"),
          },
        }).then((resdata) => {
          if (resdata.status === 200) {
            setOpenModal(false);
            setrefesh(true);
            message.success({
              content: "Yangi yo'nalsih qo'shildi",
              duration: 2,
            });

            form.resetFields();
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
  const searchData = () => {
    
    request({
      url:
        "/student/list?" +
        new URLSearchParams({
          search: search,
          limit: 10000,
          page: 1,
        }),
    }).then((resdata) => {
      if (resdata.status === 200 && resdata.data.body.count > 0) {
        setDataGroup(resdata.data.body.students);
        setLoading(false);
      } else {
        setDataGroup([]);     
      }
    });
  };
useEffect(()=>{
  searchData()
},[search])
  const GetStudentList = () => {
    setLoading(true);
    request({
      url:
        "/student/list?" +
        new URLSearchParams({
          limit: 10000,
          page: 1,
          group_id:id
        }),
    }).then((resdata) => {
      if (resdata.status === 200 && resdata.data.body.count > 0) {
        console.log(resdata.data.body.students);
        setDataGroup(resdata.data.body.students);
        setLoading(false);
      }
      else{
        setLoading(false);

      }
    });
  };

  useEffect(() => {
   
    GetStudentList();
  }, [refesh]);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };

  const deleteUser = (id) => {
    request({
      url: `/student/${id}`,
      method: "delete",
      // data: {id},
      headers: {
        Authorization: localStorage.getItem("auth_token"),
      },
    }).then((resdata) => {
      if (resdata.status === 200) {
        setrefesh(true);
        message.success({ content: `Deleted user ${id}`, duration: 2 });

        setTimeout(() => {
          setrefesh(false);
        }, 1000);
      }
      console.log(resdata.status);
    });
  };

  const editData = (item) => {
    setEditName(item);
    setOpenModa2(true);
  };

  const showModal = () => {
    setOpenModal(true);
  };

  const getShippingStatus = status => {
    if(status === true) {
      return 'blue'
    }
    if(status === false) {
      return 'red'
    }
    return ''
  }
  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (_, record, index) => index + 1,
    },
    {
      title: "O'quvchi rasmi",
      dataIndex: "photo",
      render: (_, record, index) => (
        <div className="d-flex">
          {record.photo !== "" ? (
            <AvatarStatus size={60} type="square" src={record.photo} />
          ) : (
            <Avatar
              shape="square"
              style={{ backgroundColor: `#f26a${index + 3}0` }}
              size={60}
            >
              {record.first_name.slice(0, 1)}
            </Avatar>
          )}
        </div>
      ),
    },
    {
      title: "Ismi",
      dataIndex: "first_name",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.first_name}</Text>
        </div>
      ),
    },
    {
      title: "Familiyasi",
      dataIndex: "last_namet",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.last_name}</Text>
        </div>
      ),
    },

    {
      title: "Telefoni",
      dataIndex: "phone_number",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.phone_number}</Text>
        </div>
      ),
    },
    {
      title: "Yoshi",
      dataIndex: "age",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.age}</Text>
        </div>
      ),
    },
    {
      title: "Telegram username",
      dataIndex: "started_bot",
      render: (_, record) => (
        <div className="d-flex ">
         <Tag style={{fontSize:"16px"}} color={getShippingStatus(record.started_bot)}>{record.started_bot === true ? "Active" : "No active"}</Tag>
        </div>
      ),
    },

    {
      title: "Jinsi",
      dataIndex: "gender",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.gender}</Text>
        </div>
      ),
    },

    {
      title: "",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right d-flex justify-content-end">
          {
            asisten ? '':
          <Tooltip title="Edit">
            <Button
              type="primary"
              className="mr-2"
              size="small"
              icon={<EditOutlined />}
              onClick={() => editData(elm)}
            />
          </Tooltip>
          }
          {
            asisten ?'' :
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteUser(elm.id);
              }}
              size="small"
            />
          </Tooltip>
          }
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Spin
        indicator={antIcon}
        style={{ textAlign: "center", width: "100%", marginTop: "150px" }}
      />
    );
  } else {
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
          {/* {majorData.length > 0 ? ( */}
          <Table
            columns={tableColumns}
            dataSource={dataGrop}
            rowKey="id"
            // rowSelection={{
            // 	selectedRowKeys: selectedRowKeys,
            // 	type: 'checkbox',
            // 	preserveSelectedRowKeys: false,
            // 	...rowSelection,
            // }}
          />
          {/* ) : (
              <Empty />
            )} */}
          <Modal
            title="Yangi O'quvchi yaratish"
            centered
            open={openModal}
            onOk={handleCreate}
            width={600}
            resetFields
            onCancel={() => {
              setOpenModal(false)
            }}
          >
            <Form form={form} initialValues={editName} layout="vertical">
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

          <EditStudent
              editName={editName}
              openModa2={openModa2}
              setOpenModa2={setOpenModa2}
              setEditName={setEditName}
              setrefesh={setrefesh}
              id={id}
             
            />
        </div>
      </Card>
    );
  }
};

export default Student;
