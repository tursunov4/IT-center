import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Avatar, Table } from 'antd';
import { Pie, Bar } from 'react-chartjs-2';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import GoalWidget from 'components/shared-components/GoalWidget';
import Card from 'components/shared-components/Card';
import { request } from "request/Axios";

const tableColumns = [
  {
    title: "Rasmi",
    dataIndex: "image",
    render: (_, record) => (
      <div className="d-flex">
        {
          record.image !== ""?(
            <AvatarStatus size={40} type="circle" src={record.image} />

          ):( <Avatar shape="circle" style={{ backgroundColor:"#f56a00"}} size={40}>
          {record.full_name.slice(0,1)}
        </Avatar>)
        }
       
      </div>
    ),
  },
  {
    title: 'Ism Familiyasi',
    dataIndex: 'full_name',
    key: 'full_name',
  },
  {
    title: 'Guruhlari soni',
    dataIndex: 'group_count',
    key: 'group_count',
  },
  {
    title: "O'quvchilari Soni",
    dataIndex: 'students_count',
    key: 'students_count',
  }
];

const PieChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      // Destroy the previous Chart instance
      const chartInstance = chartRef.current.chartInstance;
      chartInstance.destroy();
    }
  }, [data]);

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: [
          '#6495ED',
          '#FF7F50',
          '#00FF00',
          '#FF00FF',
        ],
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    height: "450px", 
    width: "450px",
    aspectRatio: 1
  };
  return (
    <div style={{ backgroundColor: 'white', height: '500px', display: 'flex', justifyContent: 'center'}}>
      <div style={{ height: '400px', width: '400px'}}>
        <h1 style={{ display: 'flex', justifyContent: 'center'}}>Foydalanuvchilarimiz kimlar?</h1>
        <Pie data={chartData} options={chartOptions} />
      </div>  
    </div>
  );
};

const ColumnChart = ({ data }) => {
  if (!Array.isArray(data)) {
    return <div>No data available for the chart.</div>;
  }

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Berilgan vazifalar',
        data: data.map(item => item.given_tasks),
        backgroundColor: '#FFC107',
      },
      {
        label: 'Tekshirilgan vazifalar',
        data: data.map(item => item.checked_tasks),
        backgroundColor: '#4CAF50',
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    height: 400,
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Oxirgi 10 kunda berilgan vazifalar statistikasi</h2>
      <div style={{ height: chartOptions.height-120 + 'px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
   </div>
  );
};

export const DefaultDashboard = () => {
  const [apidata, setApiData] = useState([])
  const [refresh, setrefresh] = useState(false);

  const getData = async () => {
    request({
      url:
        "/statistics" 
    }).then((resdata) => {
      if (resdata.status === 200 && resdata.data.body != null) {
        const data = resdata.data
        console.log(data.body);
        setApiData(data.body)
      }
    });
  };
  useEffect(() => {
    getData();
  }, [refresh]);

  if (apidata==null  || apidata.total_task_statistics === undefined) {
    return <div>Ooops something went wrong!!!</div>;
  }

  return (
    <>  
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={18}>
          <ColumnChart data={apidata.task_statistics}/>
        </Col>
        <Col xs={29} sm={24} md={24} lg={6}>
          <GoalWidget 
            title="Baholangan vazifalar" 
            value={((100/apidata.total_task_statistics.given_tasks|1)*apidata.total_task_statistics.checked_tasks|1)>>0}
            subtitle="Berilgan vazifalarning boholangan foizi."
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={11}>
          <PieChart 
            data={apidata.our_users_pie_chart} 
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={13}>
          <Card title={<h2 style={{ textAlign: 'center' }}>Top yordamchi ustozlar</h2>} style={{ margin: '0 auto' }} >
            <Table 
              className="no-border-last" 
              columns={tableColumns} 
              dataSource={apidata.top_assistants} 
              rowKey='id' 
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}


export default DefaultDashboard;
