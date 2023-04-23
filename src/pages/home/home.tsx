import React from 'react';
import { Avatar, Button, Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import scssStyles from './home.scss';
import { QuotationTable } from '../../component/quotationTable/quotationTable';
import { logout } from '@/request/userRequest';
import { ReceivedQuotationTable } from '@/component/receivedQuotationTable/receivedQuotationTable';
import { PublishedQuotationTable } from '@/component/publishedQuotationTable/publishedQuotationTable';

const { Header, Content, Footer, Sider } = Layout;

const MenuLabel = ['报价模板管理', '供应商报价', '比价'];

export interface IHomeState {
    menuSelectedIndex: number;
}

export class Home extends React.Component<{}, IHomeState> {
    state = {
        menuSelectedIndex: 1
    };

    componentDidMount(): void {
        if (!document.cookie) {
            window.location.href = '/';
        }
    }

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
                return <ReceivedQuotationTable />;
            case 3:
                return <PublishedQuotationTable />;
            default:
                return <QuotationTable />;
        }
    };

    private changeUser = async () => {
        const logoutRes = await logout();

        if (logoutRes.code === 200) {
            window.location.href = '/';
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
                    <Header className={scssStyles.header}>
                        在线采购管理系统
                        <div className={scssStyles.user}>
                            <Avatar
                                style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }}
                                size='large'
                            >
                                {document.cookie.split('=')[1]}
                            </Avatar>
                            <Button
                                size='small'
                                style={{ margin: '0 16px', verticalAlign: 'middle' }}
                                onClick={this.changeUser}
                            >
                                切换用户
                            </Button>
                        </div>
                    </Header>
                    <Content className={scssStyles.contentContainer}>
                        <div className={scssStyles.content}>{this.renderContent()}</div>
                    </Content>
                    <Footer className={scssStyles.footer}>@ Dream</Footer>
                </Layout>
            </Layout>
        );
    }
}
