import * as React from 'react';
import { Table, PageHeader, Form, Button, Modal, Input } from 'antd';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'; 
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../mainscore/MainScoreBoard.css';
import { RootState } from 'src/reducer';

const MainAttend = ({history}:any) => {

  
  const userData = useSelector((state:RootState) => state.userData.data);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [tableLoading, setTableLoading] = React.useState(true);
  const [inputType, setInputType] = React.useState();
  const [boardId, setBoardId] = React.useState();
  const [textData, setTextData] = React.useState();
  const [boardTitle, setBoardTitle] = React.useState();
  const [dataSource, setDataSource] = React.useState();
  const columns : any = [
    {
      title: '번호',
      dataIndex: 'key',
      key: 'key',
      width:'20%'
    },
    {
      title: '작성자',
      dataIndex: 'name',
      key: 'name',
      width:"25%"
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      width:"55%",
      render: (text:any,recode:any) => <div onClick={() => {
        history.push(
          {
            pathname:'/mainAttend/data',
            state:recode
          }
        )
      }}>{text}</div>
    }
  ];

  const columns2 : any = [
    {
      title: '번호',
      dataIndex: 'key',
      key: 'key',
      width:'15%'
    },
    {
      title: '작성자',
      dataIndex: 'name',
      key: 'name',
      width:"25%"
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      width:"55%",
      render: (text:any,recode:any) => <div onClick={() => {
        history.push(
          {
            pathname:'/mainAttend/data',
            state:recode
          }
        )
      }}>{text}</div>
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (index:any, recode:any, text:any) =>
        <div>
          <a 
            onClick={() => {
              setModalVisible(true)
              setInputType('renew');
              setTextData(recode.text);
              setBoardTitle(recode.title);
              setBoardId(recode.id);
            }} 
          > 
            수정
          </a>
        </div>
    }

  ];

  const titleChange = (e : any) => {
    setBoardTitle(e.target.value)
  }

  const onClick = () => {
    setModalVisible(!modalVisible);
    setTextData('');
    setBoardTitle('');
    setInputType('new');
  }

  const handleOk = () => {
    setTableLoading(true);
    const num:any = Object.values(dataSource)[0];
    let boardListNum:number = Object.values(dataSource).length !== 0 ? num.key : 0;
    const today = new Date();
    const year = (today.getFullYear()).toString();
    let month = (today.getMonth() + 1).toString();
    let day = today.getDate().toString();

    if(parseInt(day, 10) < 10){
      day = '0'+ day
    }

    if(parseInt(month, 10) < 10){
      month = '0' + month
    }
    const sendNum = ++boardListNum;

    if(inputType === 'new'){
      axios.post('/api/mainAttendBoardData',{
        key:sendNum,
        title:boardTitle,
        name:userData.username,
        text:textData,
        date:year + month + day
      }).then((rrr) => {
        axios.get('/api/mainAttendBoardData')
        .then(res => {
          setModalVisible(false);
          setDataSource([...res.data.reverse()])
        })
        .then(() => {
          setTableLoading(false);
        })
        return rrr
      }).then((response) => {
        axios.post('/api/mainscoreBoardData', {
          key:sendNum,
          title:boardTitle,
          boardId:response.data.id,
          name:userData.username,
          close:'false',
          date:year + month + day
        })
      })
    }else{
      axios.patch('/api/mainAttendBoardData',{
        id:boardId,
        title:boardTitle,
        text:textData,
      }).then(() => {
        axios.get(`/api/mainscoreBoardData/getBoard?getId=${boardId}`).then(res => {
          axios.patch(`/api/mainscoreBoardData`,{
            id:res.data.result[0]._id,
            title:boardTitle,
          })
        })
      }).then(() => {
        axios.get('/api/mainAttendBoardData')
        .then(res => {
          setModalVisible(false);
          setDataSource([...res.data.reverse()])
        })
        .then(() => {
          setTableLoading(false);
        })
      })
    }
  }
  
  const handleCancel = () => {
    setModalVisible(false);
  }
  const handleText = (e:any) => {
    setTextData(e);
  }

  React.useEffect(() => {
    axios.get('/api/mainAttendBoardData').then(res => {
      setDataSource(res.data.reverse());
      setTableLoading(false)
    })
  }, [])

  return(
    <React.Fragment>
        <PageHeader 
            title="참가신청"
            style={{
            background: "#00d0ff5e",
            }}
        />
        <Table 
          columns={userData.usertype === 'admin' ? columns2 : columns} 
          dataSource={dataSource}
          loading={tableLoading}
          pagination={{
              size:"small"
          }}
          rowKey={(recode:any) => `${recode.key}`}
        />
        {
          userData.usertype === 'admin' 
          ? 
          <Form style={{textAlign:'center'}}>
            <Form.Item>
                <Button style={{width:'60%'}} onClick={onClick}  block={true}> 게시글 등록</Button>
            </Form.Item>
          </Form>
          : ''
        }
        <Modal 
          visible={modalVisible} 
          width='100%' 
          bodyStyle={{height:'800px'}} 
          onCancel={handleCancel} 
          onOk={handleOk}
        >
          <Input 
            addonBefore="제목" 
            style={{
              border:'1px solid #dbdbdb', 
              borderRadius:'5px', 
              marginTop:'30px',
            }}
            value={boardTitle}
            className='attendTitle'
            onChange={titleChange} 
          />
          <ReactQuill value={textData} onChange={handleText} theme="snow" style={{marginTop:'20px', height:'570px'}} />
        </Modal>    
    </React.Fragment>
  )
}

export default React.memo(MainAttend);