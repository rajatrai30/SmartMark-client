import {
  DeleteFilled,
  ProfileOutlined,
  RedoOutlined,
  RightCircleFilled,
  ClockCircleFilled,
  StopOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Layout,
  message,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../../components/common/customModal";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { AuthContext } from "../../../context";
import { CheckError } from "../../../utils/ErrorHandling";
import { FETCH_ATTENDANCE_LIMIT, modalItems } from "../../../globalData";
import { DELETE_ATTENDANCE_MUTATION } from "../../../graphql/mutation";
import {
  FETCH_ATTENDANCE_LIST_COUNT_IN_COURSE_QUERY,
  FETCH_ATTENDANCE_LIST_IN_COURSE_QUERY,
} from "../../../graphql/query";
import singleHistory from "../attendance/singleHistory";

const { Title } = Typography;
const { Content } = Layout;

export default (props) => {
  const { user } = useContext(AuthContext);
  const [attendanceList, setAttendanceList] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [absentees, setAbsentees] = useState([]);

  const columns = [
    {
      title: <strong>Bil</strong>,
      dataIndex: "bil",
      key: "bil",
      render: (text) => <Skeleton loading={loading}>{text}</Skeleton>,
      sorter: {
        compare: (a, b) => a.bil - b.bil,
        multiple: 2,
      },
    },
    {
      key: "room",
      title: <strong>Attendance Room ID</strong>,
      dataIndex: "room",
      align: "center",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.mode.localeCompare(b.mode),
    },
    {
      key: "date",
      title: <strong>Date</strong>,
      dataIndex: "date",
      align: "center",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      key: "time",
      title: <strong>Time</strong>,
      dataIndex: "time",
      align: "center",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.time.localeCompare(b.time),
    },
    {
      key: "mode",
      title: <strong>Mode</strong>,
      dataIndex: "mode",
      align: "center",
      render: (text) => (
        <Skeleton active loading={loading}>
          {text}
        </Skeleton>
      ),
      sorter: (a, b) => a.mode.localeCompare(b.mode),
    },
    {
      title: <strong>{"Get Defaulter List"}</strong>,
      dataIndex: user.userLevel === 1 ? "action" : "status",
      render: (_, record) => (
        <Skeleton loading={loading} active>

          <Tooltip placement="topLeft" title="History Record">
            <Button
              onClick={() => handleAccessHistory(record)}
              // onClick={handleAccessHistory}
              style={{ margin: "10px" }}
              icon={<ProfileOutlined />}
            ></Button>
          </Tooltip>

          {user.userLevel == 1 && (
            <Tooltip placement="topLeft" title="Delete Record">
              <Button
                onClick={() => handleDelete(record)}
                loading={
                  selectedAttendance.key == record.key &&
                  deleteAttendanceListtatus.loading
                }
                disabled={
                  selectedAttendance.key == record.key &&
                  deleteAttendanceListtatus.loading
                }
                style={{ margin: "10px" }}
                type="danger"
                icon={<DeleteFilled />}
              ></Button>
            </Tooltip>
          )}
        </Skeleton>
      ),
      align: "center",
    },
  ];

  const columns2 = [
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

  // const courseAndParticipantsGQLQuery = useQuery(
  //   FETCH_PARTICIPANTS_QUERY,
  //   {
  //     onError(err) {
  //       props.history.push(`/dashboard`);

  //       CheckError(err);
  //     },
  //     variables: {
  //       id: props.match.params.courseID,
  //     },
  //     notifyOnNetworkStatusChange: true,
  //   }
  // );

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



  //modal visible boolean
  const [visible, SetVisible] = useState(false);

  const [tablePagination, setTablePagination] = useState({
    pageSize: FETCH_ATTENDANCE_LIMIT,
    current: 1,
    total: 0,
  });

  //get total attendanceList count query
  const [selectedAttendance, setSelectedAttendance] = useState({});
  const totalAttendanceListCountInCourse = useQuery(
    FETCH_ATTENDANCE_LIST_COUNT_IN_COURSE_QUERY,
    {
      onCompleted(data) {
        totalAttendanceListCountInCourse.refetch();
        setTablePagination({
          ...tablePagination,
          total: data.getAttendanceListCountInCourse,
        });
      },
      variables: {
        courseID: props.match.params.id,
      },
      onError(err) {
        CheckError(err);
      },
    }
  );
  const { data, loading, error, refetch } = useQuery(
    FETCH_ATTENDANCE_LIST_IN_COURSE_QUERY,
    {
      onCompleted(data) {
        setTablePagination({
          ...tablePagination,
          total:
            totalAttendanceListCountInCourse.data
              ?.getAttendanceListCountInCourse,
        });
        if (
          totalAttendanceListCountInCourse.data
            ?.getAttendanceListCountInCourse -
          (tablePagination.current - 1) * tablePagination.pageSize <=
          0 &&
          tablePagination.current !== 1
        ) {
          setTablePagination((prevState) => {
            return {
              ...prevState,
              current: prevState.current - 1,
            };
          });
        }
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        courseID: props.match.params.id,
        currPage: tablePagination.current,
        pageSize: tablePagination.pageSize,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [deleteAttendanceCallback, deleteAttendanceListtatus] = useMutation(
    DELETE_ATTENDANCE_MUTATION,
    {
      onCompleted(data) {
        SetVisible(false);
        message.success("Delete Success");
        totalAttendanceListCountInCourse.refetch();
        refetch();
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        attendanceID: selectedAttendance.key,
      },
    }
  );

  useEffect(() => {
    setAttendanceList(data?.getAttendanceListInCourse.attendanceList || []);
  }, [data]);

  const [showComponent, setShowComponent] = useState(false);

  const handleAccessHistory = (attendance) => {
    // setShowComponent(!showComponent);
    props.history.push(
      `/course/${props.match.params.id}/defaultListTable/${attendance.key}`
    );
  };

  const handleAccessRoom = (attendance) => {
    props.history.push(
      `/course/${props.match.params.id}/attendanceRoom/${attendance.key}`
    );
  };

  const handleDelete = (attendance) => {
    setSelectedAttendance(attendance);
    SetVisible(true);
  };
  const handleOk = (e) => {
    deleteAttendanceCallback();
  };

  const handleCancel = (e) => {
    SetVisible(false);
  };

  const parseAttendanceData = (attendanceList) => {
    let parsedData = [];
    attendanceList.map((att, index) => {
      console.log(att);
      const tmp = {
        key: att._id,
        bil:
          !loading &&
          tablePagination.pageSize * (tablePagination.current - 1) + index + 1,
        date: moment(att.date).format("DD/MM/YYYY"),
        time: moment(att.time).format("HH:mm"),
        room: att._id,
        mode: att.mode,
        open: att.isOn ? "On" : "Off",
      };
      parsedData.push(tmp);
    });

    return parsedData;
  };

  const handleTableChange = (value) => {
    setTablePagination(value);
  };

  return (
    <Layout className="layout">
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb
          titleList={[
            { name: "Defaulter List", link: "/dashboard" },
            {
              name: `Defaulter Details for the course: ${props.match.params.id}`,
              link: `/defaultlist/${props.match.params.id}`,
            },
            {
              name: "Defaulter List",
              link: `/course/${props.match.params.id}/defaultListTable`,
            },
          ]}
        />
        <Content>
          <Card>
            <Space direction="vertical" className="width100">
              {data && (
                <Title level={4}>
                  Course:{" "}
                  {`${data.getAttendanceListInCourse.course.code} ${data.getAttendanceListInCourse.course.name} (${data.getAttendanceListInCourse.course.session})`}
                </Title>
              )}
              <Divider />
              <h1>
                Total Lectures Taken:{" "}
                {totalAttendanceListCountInCourse.data
                  ?.getAttendanceListCountInCourse || 0}
              </h1>
              <Button
                style={{ float: "right" }}
                icon={<RedoOutlined />}
                disabled={loading}
                loading={loading}
                onClick={() => refetch()}
              >
                Refresh Table
              </Button>
              <Table
                scroll={{ x: "max-content" }}
                loading={loading}
                pagination={tablePagination}
                dataSource={parseAttendanceData(attendanceList)}
                onChange={handleTableChange}
                columns={columns}
              />
              <Table
                scroll={{ x: "max-content" }}
                loading={loading}
                pagination={tablePagination}
                dataSource={parseAbsenteeData(participants, absentees)
                } onChange={handleTableChange}
                columns={columns2}
              />


              {/*modal backdrop*/}
              <Modal
                title="Delete Attendance"
                action={modalItems.attendance.action.delete}
                itemType={modalItems.attendance.name}
                visible={visible}
                loading={deleteAttendanceListtatus.loading}
                handleOk={handleOk}
                handleCancel={handleCancel}
                payload={selectedAttendance}
              />
            </Space>
          </Card>
          {showComponent && <singleHistory />}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
