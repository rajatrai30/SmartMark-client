import { Card, Layout, Typography } from 'antd';
import React from 'react';
import { HeaderNavbar } from '../../../components/common/mainMenu';
import { Footer } from '../../../components/common/sharedLayout';
import Team from '../Team/Team';

const { Content } = Layout;
const { Title } = Typography;

function About() {
  return (
    <Layout className='home layout'>
    <HeaderNavbar />
    <Content>
        <Card>
            <Title level={2} style={{textAlign:'center'}}>Meet the Creators</Title>
        </Card>
    </Content>
    <Team />
    <Footer />
</Layout>
  )
}

export default About