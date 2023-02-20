import { useQuery } from "@apollo/react-hooks";
import {
    Card,
    Layout,
    Space,
    Table,
    Tag,
} from "antd";
import React, { useState, useEffect, useContext } from "react";
import {
    Footer,
    Greeting,
    Navbar,
    PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { CheckError } from "../../../utils/ErrorHandling";
import {
    FETCH_PARTICIPANTS_QUERY,
    FETCH_TRX_LIST_IN_ATTENDANCE,
} from "../../../graphql/query";
import moment from "moment";
import Index2 from "./index2";
import { AuthContext } from '../../../context';


const { Content } = Layout;

export default (props) => {
    const { user } = useContext(AuthContext);

    const columns = [
        {
            key: "name",
            title: <strong>Name</strong>,
            dataIndex: "name",
            align: "center",
            // sorter: (a, b) => a.name.localeCompare(b.name),
            sorter: (a, b) => user.name,

        },
        {
            title: <strong>Status</strong>,
            dataIndex: "status",
            render: (_, record) => (
                <Tag color={record.status === "You were Absent" ? "volcano" : "green"}>
                    {record.status}
                </Tag>
            ),
            align: "center",
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        // {
        //     title: <strong>Check In Date</strong>,
        //     dataIndex: "checkin_date",
        //     render: (_, record) => record.checkin_date,
        //     align: "center",
        //     sorter: (a, b) => a.checkin_date.localeCompare(b.checkin_date),
        // },
        // {
        //     title: <strong>Check In Time</strong>,
        //     dataIndex: "checkin_time",
        //     render: (_, record) => record.checkin_time,
        //     align: "center",
        //     sorter: (a, b) => a.checkin_time.localeCompare(b.checkin_time),
        // },
    ];

    const [participants, setParticipants] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [absentees, setAbsentees] = useState([]);
    const [stats, setStats] = useState("");


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

    // const parseParticipantData = (participants, absentees) => {
    //     let parsedData = [];
    //     console.log(absentees)
    //     participants.map((participant, index) => {
    //         const tmp = {
    //             key: user._id,
    //             cardID: user.cardID,
    //             name: user.firstName + " " + user.lastName,

    //             status: absentees.find((abs) => abs._id == participant._id)
    //                 ? "Absent"
    //                 : "Present",
    //             checkin_date: participant.attend_at
    //                 ? moment(participant.attend_at).format("DD/MM/YYYY")
    //                 : "-",
    //             checkin_time: participant.attend_at
    //                 ? moment(participant.attend_at).format("h:mm:ss a")
    //                 : "-",
    //         };
    //         parsedData.push(tmp);
    //     });

    //     return parsedData;
    // };

    // const parseParticipantData = (participants, absentees) => {
    //     let parsedData = [];
    //     participants.map((participant, index) => {
    //         const tmp = {
    //             key: user._id,
    //             cardID: user.cardID,
    //             name: user.firstName + " " + user.lastName,

    //             status: absentees.find((abs) => abs._id == participant._id)
    //                 ? "Absent"
    //                 : "Present",
    //             checkin_date: participant.attend_at
    //                 ? moment(participant.attend_at).format("DD/MM/YYYY")
    //                 : "-",
    //             checkin_time: participant.attend_at
    //                 ? moment(participant.attend_at).format("h:mm:ss a")
    //                 : "-",
    //         };
    //         parsedData.push(tmp);
    //     });

    //     return parsedData;
    // };

    const parseParticipantData = (participants, absentees, user) => {
        const currentUserParticipant = participants.find(participant => participant._id === user._id);
        const parsedData = {
            key: user._id,
            cardID: user.cardID,
            name: user.firstName + " " + user.lastName,
            status: absentees.find(abs => abs._id === user._id) ? "You were Absent" : "You were Present",
            // checkin_date: currentUserParticipant.attend_at ? moment(currentUserParticipant.attend_at).format("DD/MM/YYYY") : "-",
            // checkin_time: currentUserParticipant.attend_at ? moment(currentUserParticipant.attend_at).format("h:mm:ss a") : "-",
        };
        return [parsedData];
    };



    return (
        <Layout className="layout">
            <Navbar />
            <Layout>
                <Greeting />
                <PageTitleBreadcrumb
                    titleList={[
                        { name: "My DashBoard", link: "/studentdashboard" },
                        {
                            name: "Enrolled Course List",
                            link: `/course/${props.match.params.id}/attendanceList`,
                        },
                        {
                            name: `Lecture Record: ${props.match.params.attendanceID}`,
                            link: `/course/${props.match.params.courseID}/attendanceList/${props.match.params.attendanceID}`,
                        },
                    ]}
                />
                <Content>
                    <Card>
                        <Index2 />
                        <Space direction="vertical" className="width100">
                            <Table
                                scroll={{ x: "max-content" }}
                                loading={courseAndParticipantsGQLQuery.loading}
                                pagination={{ pageSize: 5 }}
                                dataSource={
                                    courseAndParticipantsGQLQuery.data
                                        ? parseParticipantData(participants, absentees, user)
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
