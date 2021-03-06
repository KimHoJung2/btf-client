import * as React from 'react';
import { PageHeader, Button, Modal, Table } from 'antd';
import axios from 'axios';

const MainAttendInput = (location:any) => {

    const userData = location.userData.data;
    const [attendDisable, setAttendDisable] = React.useState(true);
    const [dettendDisable, setDettendDisable] = React.useState(true);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [attendList, setAttendList] = React.useState();
    const [tableLoading, setTableLoading] = React.useState(true);

    const columns = [
        {
            title:'신청리스트',
            dataIndex:'username',
            key:"username",
        },
    ]

    const modalOk = () => {
        setModalVisible(false);
    }

    const modalCancel = () => {
        setModalVisible(false);
    }

    const attendButton = () => {
        axios.post('/api/attendUsers',{
            username:userData.username,
            boardId:location.location.location.state.id
        }).then(() => {
            setAttendDisable(true);
            setDettendDisable(false);
        });
    }

    const dettendButton = () => {
        axios.post(`/api/attendUsers/deleteUser?deleteName=${userData.username}&deleteBoardId=${location.location.location.state.id}`) 
        setAttendDisable(false);
        setDettendDisable(true);
    }

    const attendListButton = () => {
        setModalVisible(true);
        axios.get(`/api/attendUsers/getList?getBoardId=${location.location.location.state.id}`).then(res => {
            setAttendList(res.data.result);
            setTableLoading(false);
        })
    }

    React.useEffect(() => {
        Object.values(userData).length > 0 ? axios.get(`/api/attendUsers/getUser?getName=${userData.username}&getBoardId=${location.location.location.state.id}`)
            .then(res => {
                res.data.result.length > 0 
                ? (() => {
                    setAttendDisable(true);
                    setDettendDisable(false);
                })()
                : setAttendDisable(false)
            }).catch(() => {
                setAttendDisable(false)
            })
        :(()=>{console.log('no userData')})()
    }, [userData])

    return(
        <React.Fragment>
            <PageHeader
                 title={`${location.location.location.state.title} 참가신청`}
                 style={{
                     background: "#00d0ff5e",
                 }}
            />
            <div 
                dangerouslySetInnerHTML={{__html : location.location.location.state.text}} 
                style={{textAlign:'center', background:'white', paddingBottom:'100px'}} 
            />
            <div style={{background:'white'}}> 
                <Button onClick={attendButton} disabled={attendDisable} block={true} style={{bottom:'50px', marginBottom:'20px'}} >참가신청</Button>
                <Button onClick={dettendButton} disabled={dettendDisable} block={true} style={{bottom:'50px', marginBottom:'20px'}} >참가취소</Button>
                <Button onClick={attendListButton} block={true} style={{bottom:'50px'}} >신청현황</Button>
            </div>
            <Modal 
                visible={modalVisible}
                bodyStyle={{top:'20px'}}
                onOk={modalOk}
                onCancel={modalCancel}
                closable={false}
                cancelButtonProps={{style:{display:'none'}}}
                maskClosable={false}
            >

                <Table 
                    dataSource={attendList ? attendList : []} 
                    loading={tableLoading}
                    pagination={false}
                    columns={columns}
                    style={{marginTop:'20px'}}
                    rowKey={(recode:any) => `${recode._id}`}
                    scroll={{y: 400 }}
                />
                <div
                    style={{textAlign:'center', marginTop:'7%'}}
                >
                    {
                       attendList
                       ? 
                       `${attendList.length} 명`
                       :''
                    } 
                </div>
            </Modal>
        </React.Fragment>
    )
}

export default React.memo(MainAttendInput);

