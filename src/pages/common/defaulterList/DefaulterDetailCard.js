import { Button, Card, Col, Row } from 'antd';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context';

export default ({ course, props }) => {
  const { user } = useContext(AuthContext);
  const [attendance, setAttendance] = useState({});

  const handleAccessHistory = (attendance) => {
    props.history.push(
      `/course/${props.match.params.id}/defaultListTable`
    );
  };
  return (
    <Row className='courseDetails__row'>
      <Col>
        <Card className='courseDetails__info'>
          <p className='courseDetails__shortID'>ID: {course.shortID}</p>
          <p>
            <strong>Code:</strong> {course.code}
          </p>
          <p>
            <strong>Name:</strong> {course.name}
          </p>
          <p>
            <strong>Session:</strong> {course.session}
          </p>
          <br />
          {/* <Link to={`/course/${course.shortID}/defaultListTable`}>
            Attendance List
          <br />
          </Link> */}
          <Link to="#" onClick={() => handleAccessHistory(attendance)}>
            Get Defaulter List
          </Link>
        </Card>
      </Col>
    </Row>
  );
};
