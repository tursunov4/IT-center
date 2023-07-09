import { useParams   } from "react-router-dom";
import { Tabs, Form, Button, message } from 'antd';
import GroupData from "./GroupData";
import Homework from "./Homework";
import Student from "./student/Student";

import { Rating } from "./rating";


import Telegram from "./telegram/Telegram";
import { useEffect , useState } from "react";
import { request } from "request/Axios";


const asisten = localStorage.getItem('asisten')



const SingleViews = () => {
  const { id } = useParams();
  console.log(id);
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
  return (
    <div className="">
    <Tabs 
        defaultActiveKey="1" 
        style={{marginTop: 30}}
        items={[
          {
            label: "To'liq guruh ma'lumotlar",
            key: '1',
          children: <GroupData id={id} />,
           
          },
          {
            label: 'Vazifalar',
            key: '2',
            children: <Homework id={id} />,
          },
          {
            label: "O'quvchilar",
            key: '3',
            children: <Student id={id} />,
          },
          {
            label: "O'quvchilar bahosi",
            key: '4',
            children: <Rating id={id}/>,
          },
           asisten ? '':{
            label: "Telegram habarlar",
            key: '5',
            children: <Telegram id={assisent} />,
          }
        ]}
      />
     </div>
  )
  
};

export default SingleViews;
