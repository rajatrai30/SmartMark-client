import { LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Card, Layout, message, Switch } from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/common/customModal";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { FacePhotoContext } from "../../../context";
import { CheckError } from "../../../utils/ErrorHandling";
import { FETCH_FACE_PHOTOS_LIMIT, modalItems } from "../../../globalData";
import {
  DELETE_FACE_PHOTO_MUTATION,
  TOGGLE_PHOTO_PRIVACY_MUTATION,
  DISPLAY_PARTICIPANT_DATA_MUTATION
} from "../../../graphql/mutation";
import {
  FETCH_FACE_PHOTOS_COUNT_QUERY,
  FETCH_FACE_PHOTOS_QUERY,
} from "../../../graphql/query";
import { LoadingSpin } from "../../../utils/LoadingSpin";
import Profile from "../profile/Profile";
import { Link } from "react-router-dom";
import DisplayData from "../studentDashBoard/displayData";
import DisplayCourseData from "../studentDashBoard/displayCourseData";
import Dashboard from "../dashboard/Dashboard";

const { Content } = Layout;
export default () => {
  const {
    facePhotos,
    fetchedDone,
    loadFacePhotos,
    setFetchedDone,
  } = useContext(FacePhotoContext);

  const [isDescriptorVisible, setIsDescriptorVisible] = useState({});

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState();

  const { data, loading, refetch, fetchMore } = useQuery(
    FETCH_FACE_PHOTOS_QUERY,
    {
      onCompleted(data) {
        data.getFacePhotos.facePhotos.map((photo) => {
          setIsDescriptorVisible({
            ...isDescriptorVisible,
            [photo._id]: false,
          });
        });
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        limit: FETCH_FACE_PHOTOS_LIMIT,
      },
      notifyOnNetworkStatusChange: true,
    }
  );



  const facePhotosCountQuery = useQuery(FETCH_FACE_PHOTOS_COUNT_QUERY, {
    onError(err) {
      CheckError(err);
    },
  });


  const [deleteFacePhotoCallback, deleteFacePhotoStatus] = useMutation(
    DELETE_FACE_PHOTO_MUTATION,
    {
      onError(err) {
        CheckError(err);
      },
    }
  );

  useEffect(() => {
    loadFacePhotos(data?.getFacePhotos.facePhotos || []);
    if (data) {
      if (!data.getFacePhotos.hasNextPage) setFetchedDone(true);
      else setFetchedDone(false);
    }
  }, [data]);

  const handleDescriptorVisible = (id) => {
    setIsDescriptorVisible({
      ...isDescriptorVisible,
      [id]: !isDescriptorVisible[id],
    });
  };

  const handleDelete = () => {
    deleteFacePhotoCallback({
      update(_, { data }) {
        message.success(data.deleteFacePhoto);
        setSelectedPhoto(null);
        setIsDeleteModalVisible(false);
        refetch();
        facePhotosCountQuery.refetch();
      },
      variables: {
        photoID: selectedPhoto._id,
      },
    });
  };

  const handleCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        limit: FETCH_FACE_PHOTOS_LIMIT,
        cursor: facePhotos[facePhotos.length - 1]._id,
      },
      onError(err) {
        CheckError(err);
      },
      updateQuery: (pv, { fetchMoreResult }) => {
        return {
          getFacePhotos: {
            __typename: "FacePhotos",
            facePhotos: [
              ...pv.getFacePhotos.facePhotos,
              ...fetchMoreResult.getFacePhotos.facePhotos,
            ],
            hasNextPage: fetchMoreResult.getFacePhotos.hasNextPage,
          },
        };
      },
    });
  };
  return (
    <Layout className="layout">
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb
          titleList={[{ name: "My DashBoard", link: "/studentdashboard" }]}
        />
        <Content>
          <Card
          >
            {facePhotos.length > 0 && (
              <div key={facePhotos[0]._id}>
                <div className="myCourseFlex">
                  <div className="flex flex-row">
                    <img
                      height={150}
                      width={120}
                      data-src={facePhotos[0].photoURL}
                      src={`${process.env.PUBLIC_URL}/img/loader.gif`}
                      className="lazyload"
                      alt="Face Photo"
                    />
                    <DisplayData />
                  </div>
                  <div>
                  <DisplayCourseData />
                  </div>
                </div>
              </div>
            )}
            <LoadingSpin loading={loading} />
          </Card>
          {/* <Dashboard /> */}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
