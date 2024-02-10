import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
// import Modal from './Modal'; // モーダルコンポーネントのインポート
import ClassDetailsModal from './ClassDetailsModal'; // モーダルコンポーネントのインポート
import './TimeTable.css';
import './Modal.css';
import './ClassDetailsModal.css';
import Container from '@mui/material/Container';
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import Carousel from 'react-material-ui-carousel';
import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp';//左矢印アイコン
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';//右矢印アイコン
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const location = useLocation();

  // URLからクエリパラメータを解析する関数
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const query = useQuery();
  const department = query.get('department'); // URLの 'department' クエリパラメータを取得

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://ishiike.herokuapp.com/timetable/schedules/?department=${department}`);
        setSchedules(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('データの取得に失敗しました', error);
      }
    };

    if (department) {
      fetchData();
    }
  }, [department]);
  const [selectedClass, setSelectedClass] = useState(null);
  const days = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日'];
  const timeSlots = {
    '1時間目': '08:50~ 10:20',
    '2時間目': '10:30~ 12:00',
    '3時間目': '13:00~ 14:30',
    '4時間目': '14:40~ 16:10',
    '5時間目': '16:20~ 17:50',
    '6時間目': '18:00~ 19:30'
  };
  const handleCellClick = async (day, period, classInfo) => {
    if (classInfo) {
      // 授業の詳細情報を表示するロジック
      showClassDetails(classInfo);
    }
  };
  const showClassDetails = (classInfo) => {
    setSelectedClass(classInfo);
  };
  const renderSchedule = (classes, day, period, term) => {
    if (!Array.isArray(schedules)) {
      return '';
    }
  
    const classInfo = classes.find(c => c.day === day && c.period === period && c.season === term);
    if (!classInfo) {
      return (
        <>
          <br />
          <br />
        </>
      );
    }
  
    const handleClassInfoClick = (e) => {
      e.stopPropagation();
      handleCellClick(day, period, classInfo);
    };
    return (
      <div onClick={handleClassInfoClick}>
        <div className="class-name-timetable">{classInfo.name}</div>
        {/*<div className="class-room">{classInfo.building} {classInfo.room_id}</div>*/}
      </div>
    );
  };
  const shedulesCont = (shchedules) => {
    if (!Array.isArray(schedules)) {
      return '';
    }
    const len = schedules.length;
    const department = query.get('department');
    if (len == 0) {
      return (
        <Alert severity="warning">
          {department}の時間割情報はまだありません。
        </Alert>
      )
    }
    return (
      <Typography variant='h5'>{department}の先輩の時間割 全{len}件</Typography>
    );
  };
  const closeClassDetails = () => {
    setSelectedClass(null);
  };
  const [modalShow, setModalShow] = useState(false);
  const [currentClasses, setCurrentClasses] = useState([]);
  const handleClassSelect = async (classInfo) => {
    // モーダルを閉じる
    setModalShow(false);
  };
  const renderFreeMsg = (free_msg) => {
    if (!free_msg) {
      return '';
    }
    return (
      <div className="ui raised segment">
        <h4 className="ui header">投稿者のコメント</h4>
        <p>{free_msg}</p>
      </div>
    );
  };

  return (
    <Container>
      {shedulesCont(schedules)}
      <Carousel
      navButtonsAlwaysVisible = {true}
      stopAutoPlayOnHover = {false}
      swipe = {true}
      interval = {10000000000000000} 
      >
      {schedules.map(schedule => (
        <Box key={schedule.id} className="TimeTable">
          {/* 他のスケジュール情報も表示 */}
            <ClassDetailsModal
                classInfo={selectedClass}
                onClose={closeClassDetails}
            />
          <Typography >1年前期</Typography>
          <table>
            <thead>
            <tr>
                <th>時間\曜日</th>
                {days.map(day => <th key={day}>{day}</th>)}
            </tr>
            </thead>
            <tbody>
            {Object.entries(timeSlots).map(([period, time]) => (
                <tr key={period}>
                    <td>{`${period} ${time}`}</td>
                {days.map(day => (
                    <td key={day} onClick={() => handleCellClick(day, period)}>
                    {renderSchedule(schedule.classes, day, period, "前期")}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
          </table>
          <Typography >1年後期</Typography>
          <table>
            <thead>
            <tr>
                <th>時間\曜日</th>
                {days.map(day => <th key={day}>{day}</th>)}
            </tr>
            </thead>
            <tbody>
            {Object.entries(timeSlots).map(([period, time]) => (
                <tr key={period}>
                    <td>{`${period} ${time}`}</td>
                {days.map(day => (
                    <td key={day} onClick={() => handleCellClick(day, period)}>
                    {renderSchedule(schedule.classes, day, period, "後期")}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
          {renderFreeMsg(schedule.free_msg)}
        </Box>
      ))}
      </Carousel>
    </Container>
  );
};

export default ScheduleList;
