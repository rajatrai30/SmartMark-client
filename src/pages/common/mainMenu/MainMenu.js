import { Button, Col, Divider, Layout, Row, Typography } from 'antd';
import Texty from 'rc-texty';
import 'rc-texty/assets/index.css';
import '../../../css/main.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderNavbar } from '../../../components/common/mainMenu';
import { Footer } from '../../../components/common/sharedLayout';
import teamimg from '../../../assets/images/team.svg';

const { Content } = Layout;
const { Title } = Typography;

export default () => {
  return (
    <Layout className='home layout'>
      <HeaderNavbar />
      <Content>
      <section class="wrapper">
      <div class="container landing">
        <div class="grid-cols-2">
          <div class="grid-item-1">
            <h1 class="main-heading">
              Welcome to <span>SmartMark</span>
              <br />
            </h1>
            <p class="info-text">
              An AI based, foolproof attendance management system to monitor the
              Student's attendance using Face Recognition
            </p>

            <div class="btn_wrapper">
              <button class="btn view_more_btn">
              <Link to='/signup' style={{color: "white"}}>Get Started...</Link><i class="ri-arrow-right-line"></i>
              </button>

              <button class="btn documentation_btn"><Link to='/userguidelines'> User Guidelines</Link></button>
            </div>
          </div>
          <div class="grid-item-2">
            <div class="team_img_wrapper">
              <img
                src={teamimg}
                alt="team-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
      </Content>
      <Footer />
    </Layout>
  );
};
