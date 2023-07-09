import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Typography,

  Avatar,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ProductListData from "assets/data/product-list.data.json";
import moment from "moment/moment";
import { API_BASE_URL } from "configs/AppConfig";
import AvatarStatus from "components/shared-components/AvatarStatus";
import { Link, useNavigate } from "react-router-dom";
import Flex from "components/shared-components/Flex";
import { request } from "request/Axios";

const GroupData = ({id}) => {
    console.log(id);
    const { Text } = Typography;
    const[IdData,setIdData] = useState({})


   const  getGroupId = () =>{

    request({
        url:`/group/${id}`,
        method:"get"
    }).then(resdata => {
        console.log(resdata.data.body);
      setIdData(resdata.data.body)
    })
  }

useEffect(() => {
    getGroupId()
}, []);

const tableColumns = [
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
    title: "Dars Vaqti",
    dataIndex: "lesson_time",
    render: (_, record) => (
      <div className="d-flex">
        <Text>{record.lesson_time}</Text>
      </div>
    ),
  }, 
  {
    title: "Ochilgan sana",
    dataIndex: "open_date",
    render: (_, record) => (
      <div className="d-flex">
        <Text>{record.open_date.slice(0, 10)}</Text>
      </div>
    ),
  },
  {
    title: "Dars kunlari",
    dataIndex: "lesson_days",
    render: (_, record) => (
      <div className="d-flex">
        <Text>
              {IdData.lesson_days.du ? 'Du' : ''}
              {IdData.lesson_days.se ? ',Se' : ''}
              {IdData.lesson_days.chor ? ',Chor' : ''}
              {IdData.lesson_days.pa ? ',Pay' : ''}
              {IdData.lesson_days.ju ? ',Ju' : ''}
              {IdData.lesson_days.shan ? ',Sha' : ''}
              {IdData.lesson_days.yak ? ',Yak' : ''}
        </Text>
      </div>
    ),
  },
];

  return (
    <div className="card">
    {IdData.hasOwnProperty("title") ? (
      <div>
        <div className="table">
          <Table columns={tableColumns} dataSource={[IdData]} rowKey="id" pagination={false} />
        </div>
      </div>
    ) : null}
  </div>
  

  )

}

export default GroupData