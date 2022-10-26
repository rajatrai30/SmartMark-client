import {
  HomeOutlined,
  PictureOutlined,
  LinkOutlined,
  ContactsOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { useQuery } from '@apollo/react-hooks';
import { Menu } from 'antd';
import React, { useContext, useEffect } from 'react';
import { FpsView } from 'react-fps';
import { Link } from 'react-router-dom';
import { EnrolmentContext, NavbarContext } from '../../context';
import { CheckError } from '../../utils/ErrorHandling';

export default () => {
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substr(1);

  const { enrolCount, getEnrolCount } = useContext(EnrolmentContext);

  const { collapsed } = useContext(NavbarContext);

  return (
    <Menu theme='dark' mode='vertical' defaultSelectedKeys={[path]}>
      <Menu.Item key={'dashboard'} icon={<HomeOutlined />}>
        <Link to={'/dashboard'}>Courses</Link>
      </Menu.Item>
      <Menu.Item key={'facegallery'} icon={<PictureOutlined />}>
        <Link to={'/facegallery'}>Face Gallery</Link>
      </Menu.Item>
      <Menu.Item key={'phcet'} icon={<LinkOutlined />}>
        <a href='https://phcet.ac.in/' target="_blank">PHCET</a>
      </Menu.Item>
      <Menu.Item key={'portal'} icon={<ProjectOutlined />}>
        <a href='https://phcetstudentportal.mes.ac.in/' target="_blank">Student Portal</a>
      </Menu.Item>
      {/* {!collapsed && <FpsView width={190} height={100} top={525} />} */}
      <Menu.Item key={'contact'} icon={<ContactsOutlined />}>
        <a href='https://github.com/rajatrai30/SmartMark' target="_blank">Support</a>
      </Menu.Item>
    </Menu>
  );
};
