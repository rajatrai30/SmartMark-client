import { useQuery } from "@apollo/react-hooks";
import { useHistory } from 'react-router-dom';

import React, { useContext, useEffect, useState } from "react";
import { CourseContext } from "../../../context";
import { CheckError } from "../../../utils/ErrorHandling";
import { FETCH_COURSE_LIMIT } from "../../../globalData";
import {
    FETCH_COURSES_COUNT_QUERY,
    FETCH_COURSES_QUERY,
} from "../../../graphql/query";

import "./displayCourseData.css"

export default (props) => {
    const history = useHistory();


    const parseCourseData = (courses) => {
        let parsedData = [];
        courses.map((c, index) => {
            const tmp = {
                _id: c._id,
                key: c._id,
                bil:
                    !loading &&
                    tablePagination.pageSize * (tablePagination.current - 1) + index + 1,
                shortID: c.shortID,
                code: c.code,
                name: c.name,
                session: c.session,
                owner: c.creator.firstName + " " + c.creator.lastName + " (" + c.creator.cardID + ")"
            };
            parsedData.push(tmp);
        });

        return parsedData;
    };

    const { courses, loadCourses } = useContext(CourseContext);

    const [tablePagination, setTablePagination] = useState({
        pageSize: FETCH_COURSE_LIMIT,
        current: 1,
        total: 0,
    });

    const [selectedCourse, SetSelectedCourse] = useState({});

    //get total courses count query
    const totalCoursesQuery = useQuery(FETCH_COURSES_COUNT_QUERY, {
        onCompleted(data) {
            // totalAttendancesCount.refetch();
            setTablePagination({
                ...tablePagination,
                total: data.getCoursesCount,
            });
        },
        onError(err) {
            CheckError(err);
        },
        notifyOnNetworkStatusChange: true,
    });

    //get list of couse query
    const { data, loading, refetch, fetchMore } = useQuery(FETCH_COURSES_QUERY, {
        onCompleted(data) {
            setTablePagination({
                ...tablePagination,
                total: totalCoursesQuery.data?.getCoursesCount,
            });

            if (
                totalCoursesQuery.data?.getEnrolledCoursesCount -
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
            currPage: tablePagination.current,
            pageSize: tablePagination.pageSize,
        },
        notifyOnNetworkStatusChange: true,
    });

    //withdrawCourse mutation

    //load courses as long as data is fetched
    useEffect(() => {
        if (data) {
            console.log(data);
            loadCourses(data.getCourses.courses);
        }
    }, [data]);

    //-> icon is pressed, navigate to course detail page
    const handleAccess = (course) => {
        history.push(`/course/${course.shortID}/enrolledCourse`);
    };

    const data2 = parseCourseData(courses);

    return (
        <>
            <h2 className="text-left text-[1rem]">My courses</h2>
            <div className="myCourseInfo">
                {data2.map((item) => (
                    <div
                        onClick={() => handleAccess(item)}
                        className={"eventcard mx-4"}
                    >
                        <div key={item._id} className="p-4 font-bold">
                            <p>{`Course ID: ${item.shortID}`}</p>
                            <p>{`Code: ${item.code}`}</p>
                            <p>{`Name: ${item.name}`}</p>
                            <p>{`Session: ${item.session}`}</p>
                            <p>{`Faculty: ${item.owner}`}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
