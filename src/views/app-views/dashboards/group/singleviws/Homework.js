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
  DatePicker
} from "antd";
import moment from "moment/moment";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import Flex from "components/shared-components/Flex";
import { request } from "request/Axios";
import EditHomework from "./EditHomewrok";
const Homework = ({id}) => {
  const [majorData, setMajorData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModa2, setOpenModa2] = useState(false);
  const [refesh, setrefesh] = useState(false);
  const [search, setSearch] = useState("");
  const [editName, setEditName] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null)

  const [loading, setLoading] = useState(false);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 50,
      }}
      spin
    />
  );

  const [form] = Form.useForm();

  const { Text } = Typography;

  const getData = async () => {
    setLoading(true);

    request({
      url:
        "/task/list?" +
        new URLSearchParams({
          limit: 10000,
          page: 1,
          group_id :id
        }),
    }).then((resdata) => {
      console.log(resdata);
      if (resdata.status === 200 && resdata.data.body.count > 0) {
        setMajorData(resdata.data.body.tasks);
        setLoading(false);
      } else {
        setLoading(false)
        setMajorData([]);
        
      }
    });
  };

  const searchData = () => {

    request({
      url:
        "/task/list?" +
        new URLSearchParams({
          search: search,
          group_id:id-0
        }),
    }).then((resdata) => {
      if (resdata.status === 200 && resdata.data.body.count > 0) {
        setMajorData(resdata.data.body.tasks);
        setLoading(false);
      } else {
        setMajorData([]);
      }
     
    });
  };

  useEffect(() => {
    searchData();
  }, [search]);

  useEffect(() => {
    getData();
  }, [refesh]);

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();

        request({
          url: "/task",
          method: "post",
          data: { group_id:id-0,
            title : values.title,
            given_date : selectedDate
         },
          headers: {
            Authorization: localStorage.getItem("auth_token"),
          },
        }).then((resdata) => {
          if (resdata.status === 200) {
            form.resetFields();
            setOpenModal(false);
            setrefesh(true);
           message.success({ content: `Yangi vazifa qo'shildi`, duration: 2 });

            setTimeout(() => {
              setrefesh(false);
            }, 1000);
            setEditName(null);
          
          }
          console.log(resdata.status);
        });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const showModal = () => {
    setOpenModal(true);
  };

  const editData = (item) => {
    setEditName(item);
    setOpenModa2(true);
  };
  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };
  const deleteUser = (id) => {
    request({
      url: `/task/${id}`,
      method: "delete",
      // data: {id},
      headers: {
        Authorization: localStorage.getItem("auth_token"),
      },
    }).then((resdata) => {
      if (resdata.status === 200) {
        setrefesh(true);
        message.success({ content: `Vazifa o'chirildi`, duration: 2 });

        setTimeout(() => {
          setrefesh(false);
        }, 1000);
      }
      console.log(resdata.status);
    });
  };

  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Nomi",
      dataIndex: "title",
      render: (_, record) => (
        <div className="d-flex">
          {/* <AvatarStatus size={60} type="square" src={record.image} name={record.name}/> */}
          <Text strong>{record.title}</Text>
        </div>
      ),
      //   sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
    },

    {
      title: "Berilgan sana",
      dataIndex: "given_date",
      render: (_, record) => (
        <div className="d-flex">
          {/* <AvatarStatus size={60} type="square" src={record.image} name={record.name}/> */}
          <Text>{record.given_date}</Text>
        </div>
      ),
      // sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
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
            <Button
              type="primary"
              onClick={showModal}
              icon={<PlusCircleOutlined />}
              block
            >
              Qo'shish
            </Button>
          </div>
        </Flex>
        <div className="table-responsive">
          {majorData.length > 0 ? (
            <Table
              columns={tableColumns}
              dataSource={majorData}
              rowKey="id"
              // rowSelection={{
              // 	selectedRowKeys: selectedRowKeys,
              // 	type: 'checkbox',
              // 	preserveSelectedRowKeys: false,
              // 	...rowSelection,
              // }}
            />
          ) : (
            <Empty />
          )}
          <Modal
            title="Yangi guruh yaratish"
            centered
            open={openModal}
            onOk={handleCreate}
            resetFields
            onCancel={() => setOpenModal(false)}
          >
            <Form form={form} initialValues={editName}>
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
            </Form>
          </Modal>

          <EditHomework
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
  } else {
    return (
      <Spin
        indicator={antIcon}
        style={{ textAlign: "center", width: "100%", marginTop: "150px" }}
      />
    );
  }
};

export default Homework;

