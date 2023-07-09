import { Table, Typography, Modal, Form, Input, message, InputNumber } from "antd";
import { useState,useEffect } from "react";
import { request } from "request/Axios";

export const Rating = ({ id }) => {
  // In the fifth row, other columns are merged into first column
  // by setting it's colSpan to be 0
  const { Text } = Typography;
  const [taskData,settaskData] = useState([])
  const [refrash , setrefesh] = useState(false)
  const [grades, setGrades] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [grade , setGrade] = useState(null)
  const [isgrade , setIsgrade] = useState(false)

  const [form] = Form.useForm();


  const getData =  () => {
    // setLoading(true);

    request({
      url:
        "/student-task/list?" +
        new URLSearchParams({
          limit: 10000,
          page: 1,
          group_id:id,
        }),
    }).then((resdata) => {
    //   console.log(resdata.data.body.students);
      if (resdata.status === 200 && resdata.data.body.count > 0) {
        settaskData(resdata.data.body.students)
        // setMajorData(resdata.data.body.majors);
        // setLoading(false);
      } else {
        // setMajorData([]);
        settaskData([])
      }
    });
  };


  useEffect(() => {
    getData();
  }, [refrash]);





  const editData = (item, task) => {
  console.log(item)
  console.log(item.student.id)
  setStudentId(item.student.id)
  setTaskId(task.task.id)
  setIsgrade(task.is_graded)
  if(task.is_graded){
    setGrade(task?.grade.id)
  }
    // setStudentId(student, task_id);
    // setTaskId(task_id);
    setOpenModal(true);
    // console.log(task_id)
    // console.log(student)
  };


    
  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        console.log(taskId);
        if (isgrade !== true) {
          request({
            url: "/grade",
            method: "post",
            data: { student_id: studentId-0, task_id: taskId-0, ...values },
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
                content: "Baho qo'yildi",
                duration: 2,
              });

              form.resetFields();
            }
            console.log(resdata.status);
          });
        }
        else{
            request({
                url: "/grade",
                method: "put",
                data: { student_id: studentId-0, task_id: taskId-0,  id:grade-0, ...values },
                headers: {
                  Authorization: localStorage.getItem("auth_token"),
                },
              }).then((resdata) => {
                if (resdata.status === 200) {
                  setOpenModal(false);
                  // setrefesh(true)
                  setTimeout(() => {
                    //   setrefesh(false);
                  }, 1000);
                  message.success({
                    content: "Baho yangilandi",
                    duration: 2,
                  });
    
                  form.resetFields();
                }
                console.log(resdata.status);
              });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
      console.log('asfdnjasofnd')
  
  };

  //   const showModal = () => {
  //     setOpenModal(true);
  //   };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      render: (_, elm, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Name",
      dataIndex: "first_name",
      render: (_, elm) => <Text strong>{elm.student.first_name}</Text>,
    },
  ];
 

  taskData.forEach((item, index) => {
    let taskFoo = item.tasks;

    let taskindex = item.tasks[index];
     console.log(taskindex)
     console.log(taskFoo)
console.log(item);
    const taskColumn = {
      title: `${taskFoo}`,
      dataIndex: taskindex,
      children: [
        {
          title: "Vazifa Nomi",
          dataIndex: taskindex.task.id,
          render: (_, elm) => <Text>{taskFoo[index].task.title}</Text>,
        },
        // {
        //   title: "Baho",
        //   dataIndex:'phone',
        //   render: (_, elm) => {
        //     <Text>
        //     {`${taskindex.is_graded === true ? taskindex.grade.comment : "no"}`}
        //   </Text>
        //   },
        // },
        {
          title: "Baho",
          dataIndex: "rate",
          render: (_, elm) => (
            <Text onClick={()=>editData(elm , taskindex) }>
              {`${taskindex.is_graded === true ? taskindex.grade.rate : "no"}`}
            </Text>
          ),
        },
        {
          title: "Izoh",
          dataIndex: "phone",
          render: (_, elm) => (
            <Text>
              {`${taskindex.is_graded === true ? taskindex.grade.comment : "no"}`}
            </Text>
          ),
        },
      ],
    };

    columns.push(taskColumn);
  });

  return (
    <>
      <Table columns={columns} dataSource={taskData} bordered />

      <Modal
        title="O'quvchilarni baholash"
        centered
        open={openModal}
        onOk={handleCreate}
        width={500}
        resetFields
        onCancel={() => {
          setOpenModal(false);
        }}
      >
        <Form form={form} >
          <Form.Item
            label="Baho"
            name="rate"
            rules={[
              {
                required: true,
                message: "Iltimos guruh nomini yozing",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Izoh"
            name="comment"
            rules={[
              {
                required: true,
                message: "Iltimos guruh nomini yozing",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
