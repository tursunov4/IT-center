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
  Avatar
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
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EditAssisint from "./EditAssisint";

const Assisint = () => {
  const [seldataGet, setSelDataGet] = useState([]);
  const [dataGrop,setDataGroup] = useState([])
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

  const GetAssistantList = () =>{
    setLoading(true)
    request({
      url:
      "/assistant/list?" +
      new URLSearchParams({
        limit: 10000,
        page: 1,
        sortby_group_count: -1,
      }),
    }).then((resdata) => {
      if (resdata.status === 200 && resdata.data.body.count > 0) {
        console.log(resdata.data.body.assistants);
        setDataGroup(resdata.data.body.assistants);
        setLoading(false)

      }
    });
  }
  const searchData = () => {
    
    request({
      url:
        "/assistant/list?" +
        new URLSearchParams({
          search: search,
          limit: 10000,
          page: 1,
        }),
    }).then((resdata) => {
      if (resdata.status === 200 && resdata.data.body.count > 0) {
        setDataGroup(resdata.data.body.assistants);
        setLoading(false);
      } else {
        setDataGroup([]);     
      }
    });
  };
  useEffect(()=>{
    searchData()
  },[search])
  useEffect(() => {
    GetAssistantList()
    getMajorList()
  }, [refesh]);

  const getMajorList = () => {
    request({
      url:
        "/major/list?" +
        new URLSearchParams({
          limit: 10000,
          page: 1,
        }),
    }).then((resdata) => {
      if (resdata.status === 200 && resdata.data.body.count > 0) {
        setSelDataGet(resdata.data.body.majors);
      }
    });
  }

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
      

        request({
          url: "/assistant",
          method: "post",
          data: {
            age: values.age,
            first_name: values.first_name,
            gender: values.gender,
            last_name: values.last_name,
            major_id: values.major_id,
            password: "",
            phone_number:values.phone_number,
            photo: values.photo !== undefined ? values.photo[0].response.body.photo_url : "",
            t_username: values.t_username,
            username: "",
          },
          headers: {
            Authorization: localStorage.getItem("auth_token"),
          },
        }).then((resdata) => {
          if (resdata.status === 200) {
            setOpenModal(false);
            setrefesh(true)
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

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };

  const deleteUser = (id) => {
    request({
      url: `/assistant/${id}`,
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

  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Ustoz rasmi",
      dataIndex: "photo",
      render: (_, record) => (
        <div className="d-flex">

          {
            record.photo !== ""?(
              <AvatarStatus size={60} type="square" src={record.photo} />

            ):( <Avatar shape="square" style={{ backgroundColor:"#f56a00"}} size={60}>
            {record.first_name.slice(0,1)}
          </Avatar>)
          }
         
        </div>
      ),
    },
    {
      title: "Ismi",
      dataIndex:"first_name",
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
      title: "Yoshi",
      dataIndex: "age",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.age}</Text>
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
      title: "Usename",
      dataIndex: "username",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.username}</Text>
        </div>
      ),
    },
    {
      title: "Telegram username",
      dataIndex: "t_username",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.t_username}</Text>
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
      title: "Yo'nalishi",
      dataIndex: "major",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.major.title_uz}</Text>
        </div>
      ),
    },
    {
      title: "Guruhlar soni",
      dataIndex: "group_count",
      render: (_, record) => (
        <div className="d-flex">
          <Text>{record.group_count}</Text>
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right d-flex justify-content-end">
          <Tooltip title="Edit">
            <Button
              type="primary"
              className="mr-2"
              size="small"
              icon={<EditOutlined />}
              onClick={() => editData(elm)}
            />
          </Tooltip>
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
        </div>
      ),
    },
  ];
  if(loading){
    return (
      <Spin
        indicator={antIcon}
        style={{ textAlign: "center", width: "100%", marginTop: "150px" }}
      />
    );
  }

  else{
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
            <Button
              type="primary"
              onClick={showModal}
              icon={<PlusCircleOutlined />}
              block
            >
              Add product
            </Button>
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
            title="Yangi guruh yaratish"
            centered
            open={openModal}
            onOk={handleCreate}
            width={600}
            resetFields
            onCancel={() => setOpenModal(false)}
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
                    size="small" className="w-100" />
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
                  <Form.Item name="major_id" label="Yo'nalishni tanlang"  rules={[
                      {
                        required: true,
                        message: "Iltimos yo'nalishni tanlang",
                      },
                    ]}>
                    <Select className="w-100" placeholder="Yo'nalishlar">
                      {seldataGet.map((elm) => (
                        <Option key={elm.id} value={elm.id}>
                          {elm.title_uz}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item name="gender" label="Jinsni belgilang"  rules={[
                      {
                        required: true,
                        message: "Iltimos username nomini yozing",
                      },
                    ]} >
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
  
          <EditAssisint
              editName={editName}
              openModa2={openModa2}
              setOpenModa2={setOpenModa2}
              setEditName={setEditName}
              setrefesh={setrefesh}
              seldataGet={seldataGet}
            />
        </div>
      </Card>
    );
  }
};

export default Assisint;
