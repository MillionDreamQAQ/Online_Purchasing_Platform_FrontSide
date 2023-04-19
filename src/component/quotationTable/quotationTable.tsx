import React from 'react';
import { Button, Drawer, Space, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import * as GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets-print';
import '@grapecity/spread-sheets-shapes';
import '@grapecity/spread-sheets-slicers';
import '@grapecity/spread-sheets-pivot-addon';
import '@grapecity/spread-sheets-tablesheet';
import '@grapecity/spread-sheets-io';
import '@grapecity/spread-sheets-resources-zh';
import '@grapecity/spread-sheets-designer-resources-cn';
import * as GCD from '@grapecity/spread-sheets-designer';
import { Designer } from '@grapecity/spread-sheets-designer-react';
import scssStyles from './quotationTable.scss';

interface QuotationDataType {
    key: string;
    name: string;
}

interface TemplateDataType {
    key: React.Key;
    name: string;
    size: string;
    unit: string;
    desc: string;
}

const quotationTableData: QuotationDataType[] = [
    {
        key: '1',
        name: '西安酒店报价单'
    }
];

const templateColumns: ColumnsType<TemplateDataType> = [
    {
        title: '名称',
        dataIndex: 'name',
        render: (text: string) => <a>{text}</a>
    },
    {
        title: '规格',
        dataIndex: 'size'
    },
    {
        title: '单位',
        dataIndex: 'unit'
    },
    {
        title: '材质说明',
        dataIndex: 'desc'
    }
];

const templateData: TemplateDataType[] = [
    {
        key: '1',
        name: '行李柜',
        size: '750*500*2480',
        unit: '件',
        desc: '多层板基材贴三聚氰胺饰面环保粘合剂封边优质五金件连接（不含石材与灯带）'
    }
];

export class QuotationTable extends React.Component {
    private selectedRows = [] as TemplateDataType[];

    state = {
        templateDrawerVisible: false,
        contentShownIndex: 1
    };

    quotationTableColumns: ColumnsType<QuotationDataType> = [
        {
            title: '报价单名称',
            dataIndex: 'name',
            key: 'name',
            render: name => <a>{name}</a>
        },
        {
            title: '操作',
            key: 'action',
            render: () => (
                <Space size='large'>
                    <a onClick={this.openTemplateDrawer}>模板配置</a>
                    <a onClick={this.openSpreadSheetEditor}>编辑</a>
                    <a>发布报价</a>
                </Space>
            )
        }
    ];

    templateRowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: TemplateDataType[]) => {
            this.selectedRows = selectedRows;
        }
    };

    private closeTemplateDrawer = () => {
        this.setState({
            templateDrawerVisible: false
        });
    };

    private openTemplateDrawer = () => {
        this.setState({
            templateDrawerVisible: true
        });
    };

    private clickSaveButtonHandler = () => {
        message.success({
            content: '模板配置保存成功',
            duration: 1,
            style: {
                marginTop: '50px'
            },
            onClose: () => {
                this.closeTemplateDrawer();
            }
        });
    };

    private clickSaveTemplateButtonHandler = () => {
        message.success({
            content: '模板保存成功',
            duration: 1,
            style: {
                marginTop: '50px'
            }
        });
    };

    private openQuotationTable = () => {
        this.setState({
            contentShownIndex: 1
        });
    };

    private openSpreadSheetEditor = () => {
        this.setState({
            contentShownIndex: 2
        });
    };

    private renderQuotationTable = () => {
        return (
            <div>
                <Button className={scssStyles.button} type='default'>
                    导入报价单
                </Button>

                <Button className={scssStyles.button} type='primary'>
                    导出报价单
                </Button>

                <Button className={scssStyles.button} type='primary' danger>
                    删除
                </Button>

                <Table columns={this.quotationTableColumns} dataSource={quotationTableData} />

                <Drawer
                    className={scssStyles.rightDrawer}
                    size='large'
                    width='960px'
                    placement='right'
                    onClose={this.closeTemplateDrawer}
                    open={this.state.templateDrawerVisible}
                >
                    <div>
                        <Table
                            rowSelection={{
                                ...this.templateRowSelection
                            }}
                            columns={templateColumns}
                            dataSource={templateData}
                        />
                        <Button type='primary' onClick={this.clickSaveButtonHandler}>
                            保存配置
                        </Button>
                    </div>
                </Drawer>
            </div>
        );
    };

    private renderQuotationEditor = () => {
        return (
            <div>
                <Button
                    className={scssStyles.button}
                    onClick={this.openQuotationTable}
                    type='default'
                >
                    返回
                </Button>

                <Button
                    className={scssStyles.button}
                    onClick={this.clickSaveTemplateButtonHandler}
                    type='primary'
                >
                    保存模板
                </Button>

                <div className={scssStyles.quotationEditor}>
                    <Designer
                        styleInfo={{ width: '100%', height: '78vh' }}
                        config={GCD.Spread.Sheets.Designer.DefaultConfig}
                        spreadOptions={{ sheetCount: 2 }}
                    ></Designer>
                </div>
            </div>
        );
    };

    private renderContent = () => {
        switch (this.state.contentShownIndex) {
            case 1:
                return this.renderQuotationTable();
            case 2:
                return this.renderQuotationEditor();
            default:
                return this.renderQuotationTable();
        }
    };

    render() {
        return this.renderContent();
    }
}
