import React from 'react';
import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import scssStyles from './home.scss';
import { QuotationTable } from '../quotationTable/quotationTable';

const { Header, Content, Footer, Sider } = Layout;

const MenuLabel = ['报价模板管理', '供应商报价', '比价'];

export interface IHomeState {
    menuSelectedIndex: number;
}

export class Home extends React.Component<{}, IHomeState> {
    state = {
        menuSelectedIndex: 1
    };

    private menuOnSelect = (e: { key: any }) => {
        this.setState({
            menuSelectedIndex: Number(e.key)
        });
    };

    private renderContent = () => {
        switch (this.state.menuSelectedIndex) {
            case 1:
                return <QuotationTable />;
            case 2:
                return <div>供应商报价</div>;
            case 3:
                return <div>比价</div>;
            default:
                return <QuotationTable />;
        }
    };

    render() {
        return (
            <Layout>
                <Sider className={scssStyles.sider}>
                    <div className={scssStyles.logo}></div>
                    <Menu
                        className={scssStyles.siderMenu}
                        theme='dark'
                        mode='inline'
                        defaultSelectedKeys={['1']}
                        onSelect={this.menuOnSelect}
                        items={[UserOutlined, VideoCameraOutlined, UploadOutlined].map(
                            (icon, index) => ({
                                key: String(index + 1),
                                icon: React.createElement(icon),
                                label: MenuLabel[index]
                            })
                        )}
                    />
                </Sider>
                <Layout>
                    <Header className={scssStyles.header}>在线采购管理系统</Header>
                    <Content className={scssStyles.contentContainer}>
                        <div className={scssStyles.content}>{this.renderContent()}</div>
                    </Content>
                    <Footer className={scssStyles.footer}>@ Dream</Footer>
                </Layout>
            </Layout>
        );
    }
}