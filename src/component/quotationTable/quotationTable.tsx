import React from 'react';
import { Button, Drawer, Space, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import * as GC from '@grapecity/spread-sheets';
import { SpreadSheets } from '@grapecity/spread-sheets-react';
import scssStyles from './quotationTable.scss';
import '../../assets/css/gc.spread.sheets.excel2016colorful.16.0.2.css';

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
            content: '操作成功',
            duration: 1,
            style: {
                marginTop: '50px'
            },
            onClose: () => {
                this.closeTemplateDrawer();
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
                    type='primary'
                >
                    保存模板
                </Button>
                <div className={scssStyles.quotationEditor}>
                    <SpreadSheets
                        workbookInitialized={spread => this.initSpread(spread)}
                    ></SpreadSheets>
                </div>
            </div>
        );
    };

    private initSpread = (spread: GC.Spread.Sheets.Workbook) => {
        const sheet = spread.getActiveSheet();
        sheet.setValue(0, 0, '报价单名称');
        sheet.setValue(0, 1, '西安酒店报价单');
        sheet.setValue(1, 0, '报价单编号');
        sheet.setValue(1, 1, '2021-01-01');
        sheet.setValue(2, 0, '报价单日期');
        sheet.setValue(2, 1, '2021-01-01');
        sheet.setValue(3, 0, '报价单备注');
        sheet.setValue(3, 1, '备注');
        sheet.setValue(4, 0, '报价单模板');
        sheet.setValue(4, 1, '模板名称');
        sheet.setValue(5, 0, '报价单模板编号');
        sheet.setValue(5, 1, '模板编号');
        sheet.setValue(6, 0, '报价单模板日期');
        sheet.setValue(6, 1, '模板日期');
        sheet.setValue(7, 0, '报价单模板备注');
        sheet.setValue(7, 1, '模板备注');
        sheet.setValue(8, 0, '报价单模板版本');
        sheet.setValue(8, 1, '模板版本');
        sheet.setValue(9, 0, '报价单模板创建人');
        sheet.setValue(9, 1, '模板创建人');
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
