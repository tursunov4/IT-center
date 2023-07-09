
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
} from "antd";

import {
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import pending from '../../../../../../assets/svg/stopwatch.svg'
import sent from '../../../../../../assets/svg/check2.svg'
import recived from '../../../../../../assets/svg/check3.svg'
import Flex from "components/shared-components/Flex";
import { request } from "request/Axios";
import EditTelegram from "./EditTelegram";
const Telegram = ({id}) => {
  const [majorData, setMajorData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModa2, setOpenModa2] = useState(false);
  const [refesh, setrefesh] = useState(false);
  const [editName, setEditName] = useState(null);
  const [assisent ,setAsisent] = useState(null)
  const getAssistent =()=>{
    request({
        url:`/group/${id}`,
        method:"get"
    }).then(resdata => {
      setAsisent(resdata.data.body.assistant.id)
    })
  }
  useEffect(()=>{
    getAssistent()
  } ,[])

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
        "/telegram-messages/list?" +
        new URLSearchParams({
          limit: 10000,
          page: 1,
          assistant_id:id-0
        }),
    }).then((resdata) => {
      console.log(resdata);
      if (resdata.status === 200 && resdata.data.Body.count > 0) {
        setMajorData(resdata.data.Body.telegramMessagess);
        setLoading(false);
      } else {
        setLoading(false)
        setMajorData([]);
      }
    });
  };




  useEffect(() => {
    getData();
  }, [refesh]);

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();

        request({
          url: "/telegram-messages",
          method: "post",
          data: { message : values.title ,
                 assistant_id:assisent-0
        },
          headers: {
            Authorization: localStorage.getItem("auth_token"),
          },
        }).then((resdata) => {
          if (resdata.status === 200) {
            setOpenModal(false);
            setrefesh(true)
            setTimeout(() => {
              setrefesh(false);
            }, 1000);
            message.success({
              content: "Yangi habar qushildi",
              duration: 2,
            });

            form.resetFields();
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

 
  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Xabar",
      dataIndex: "message",
      render: (_, record) => (
        <div className="d-flex">
          {/* <AvatarStatus size={60} type="square" src={record.image} name={record.name}/> */}
          <Text strong>{record.message}</Text>
        </div>
      ),
      //   sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <div className="d-flex ">
           <img width={20} src={record.status ==='recieved' ? recived : ''} alt="" />
           <img width={20} src={record.status ==='sent' ? sent : ''} alt="" />
           <img width={20} src={record.status ==='new' || record.status ==='updated' ? pending : '' } alt="" />
    
        </div>
      ),
      //   sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
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
        </div>
      ),
    },
  ];

  if (!loading) {
    return (
      <Card>
        <Flex
          alignItems="center"
          justifyContent="end"
          mobileFlex={false}
        >
         
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
            title="Yangi habar yaratish"
            centered
            open={openModal}
            onOk={handleCreate}
            resetFields
            onCancel={() => setOpenModal(false)}
          >
            <Form form={form} initialValues={editName}>
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

          <EditTelegram
            editName={editName}
            openModa2={openModa2}
            setOpenModa2={setOpenModa2}
            setEditName={setEditName}
            setrefesh={setrefesh}
            assisent={id}
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

export default Telegram;
