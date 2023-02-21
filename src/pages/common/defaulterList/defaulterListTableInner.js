import { UserOutlined, RedoOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/react-hooks";
import {
  Avatar,
  Card,
  Divider,
  Layout,
  Space,
  Table,
  Tag,
  Button,
  Typography,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { CheckError } from "../../../utils/ErrorHandling";
import {
  FETCH_ATTENDANCE_QUERY,
  FETCH_PARTICIPANTS_QUERY,
  FETCH_TRX_LIST_IN_ATTENDANCE,
} from "../../../graphql/query";
import HistoryViz from "../attendance/HistoryViz";
import { LoadingSpin } from "../../../utils/LoadingSpin";
import moment from "moment";
import DefaulterListTable from "./defaulterListTable";

const { Title } = Typography;
const { Content } = Layout;

export default (props) => {
  const columns = [
    {
      title: <strong>Avatar</strong>,
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      width: "5%",
    },
    {
      key: "cardID",
      title: <strong>Matric Number</strong>,
      dataIndex: "cardID",
      align: "center",
      sorter: (a, b) => a.cardID.localeCompare(b.cardID),
    },
    {
      key: "name",
      title: <strong>Name</strong>,
      dataIndex: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: <strong>Defaulter Status</strong>,
      dataIndex: "status",
      render: (_, record) => (
        <Tag color={record.status === "Defaulter" ? "volcano" : "green"}>
          {record.status}
        </Tag>
      ),
      align: "center",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  const [participants, setParticipants] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [trx, setTrx] = useState([]);

  const [stats, setStats] = useState("");

  const attendanceGQLQuery = useQuery(FETCH_ATTENDANCE_QUERY, {
    onError(err) {
      props.history.push(
        `/course/${props.match.params.courseID}/attendanceList`
      );

      CheckError(err);
    },
    variables: {
      attendanceID: props.match.params.attendanceID,
    },
    notifyOnNetworkStatusChange: true,
  });

  const courseAndParticipantsGQLQuery = useQuery(
    FETCH_PARTICIPANTS_QUERY,
    {
      onError(err) {
        props.history.push(`/dashboard`);

        CheckError(err);
      },
      variables: {
        id: props.match.params.courseID,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const trxListInAttendanceGQLQuery = useQuery(FETCH_TRX_LIST_IN_ATTENDANCE, {
    onError(err) {
      CheckError(err);
    },
    variables: {
      attendanceID: props.match.params.attendanceID,
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (courseAndParticipantsGQLQuery.data) {
      setParticipants(
        courseAndParticipantsGQLQuery.data.getParticipants
      );
    }
  }, [courseAndParticipantsGQLQuery.data]);

  useEffect(() => {
    if (trxListInAttendanceGQLQuery.data) {
      const currAbsentees = participants.filter((participant) => {
        delete participant.attend_at;

        const result = trxListInAttendanceGQLQuery.data.getTrxListInAttendance.filter(
          (attendee) => participant._id == attendee.studentID
        );

        return result.length == 0; //count as absentee if no found
      });


      const currAttendees = participants.filter((participant) => {
        const result = trxListInAttendanceGQLQuery.data.getTrxListInAttendance.filter(
          (attendee) => participant._id == attendee.studentID
        );
        console.log("result", result);
        if (result.length >= 1) {
          Object.assign(participant, { attend_at: result[0].createdAt });
        }
        return result.length >= 1; //count as attendee if found
      });

      setAbsentees(currAbsentees);
      setAttendees(currAttendees);
    }
    return () => {

      setAbsentees([]);
      setAttendees([]);
    }
  }, [participants, trxListInAttendanceGQLQuery.data]);

  useEffect(() => {
    setStats(`${attendees.length}/${participants.length}`);
    return () => {
      setStats("");
    }
  }, [attendees, absentees, participants]);

  const parseAbsenteeData = (participants, absentees) => {
    let parsedData = [];
    participants.map((participant) => {
      if (absentees.find((abs) => abs._id == participant._id)) {
        const tmp = {
          key: participant._id,
          avatar: (
            <Avatar
              src={participant.profilePictureURL}
              style={{
                backgroundColor: `rgb(${Math.random() * 150 + 30}, ${Math.random() * 150 + 30
                  }, ${Math.random() * 150 + 30})`,
              }}
            >
              {participant.firstName[0]}
            </Avatar>
          ),
          cardID: participant.cardID,
          name: participant.firstName + " " + participant.lastName,
          status: "Defaulter",
        };
        parsedData.push(tmp);
      }
    });
    return parsedData;
  };

  const Print = () => {
    //console.log('print');  
    let buttonComp = document.getElementById('printButton');
    buttonComp.style.display = "none";
    let buttonComp2 = document.getElementById('printButton2');
    buttonComp2.style.display = "none";
    let printContents = document.getElementById('printablediv').innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  return (
    <Layout className="layout">
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb
          titleList={[
            { name: "Defaulters", link: "/dashboard" },
            {
              name: `Course: ${props.match.params.courseID}`,
              link: `/course/${props.match.params.courseID}`,
            },
            {
              name: `Defaulter List`,
              link: `/course/${props.match.params.courseID}/attendanceList`,
            },
            {
              name: `Defaulter Record for the lecture: ${props.match.params.attendanceID}`,
              link: `/course/${props.match.params.courseID}/attendanceList/${props.match.params.attendanceID}`,
            },
          ]}
        />
        <Content>
          <Card id='printablediv'>
            <Space direction="vertical" className="width100">
              {attendanceGQLQuery.data && (
                <Card>
                  <Title
                    level={4}
                  >{`Defaulter List for the Course: ${attendanceGQLQuery.data.getAttendance.course.shortID} - ${attendanceGQLQuery.data.getAttendance.course.code} - ${attendanceGQLQuery.data.getAttendance.course.name} - ${attendanceGQLQuery.data.getAttendance.course.session}`}</Title>

                  <p>
                    of the Date:{" "}
                    <strong>
                      {moment(
                        attendanceGQLQuery.data.getAttendance.date
                      ).format("DD/MM/YYYY")}
                    </strong>
                  </p>
                  <p>
                    on Time:{" "}
                    <strong>
                      {moment(
                        attendanceGQLQuery.data.getAttendance.time
                      ).format("h:mm a")}
                    </strong>
                  </p>
                </Card>
              )}
              <Divider />
              <div className="flex flex-row">
              <Button
                id="printButton2"
                style={{ float: "right" }}
                icon={<RedoOutlined />}
                disabled={attendanceGQLQuery.loading}
                loading={attendanceGQLQuery.loading}
                onClick={() => attendanceGQLQuery.refetch()}
              >
                Refresh Table
              </Button>
              <Button type="primary" className="mx-4" id="printButton" style={{ float: "right" }} onClick={Print}>Print Report</Button>
              </div>
              <Table
                scroll={{ x: "max-content" }}
                loading={courseAndParticipantsGQLQuery.loading}
                pagination={{ pageSize: 5 }}
                dataSource={
                  courseAndParticipantsGQLQuery.data
                    ? parseAbsenteeData(participants, absentees)
                    : []
                }
                columns={columns}
              />
            </Space>
          </Card>
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
};
