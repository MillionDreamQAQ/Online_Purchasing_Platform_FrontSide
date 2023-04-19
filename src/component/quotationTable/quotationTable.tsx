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
    template?: TemplateDataType[];
}

interface TemplateDataType {
    key: string;
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

    private designer;

    state = {
        templateDrawerVisible: false,
        contentShownIndex: 1,
        templateSettingSelectIndex: 0,
        editSelectIndex: 0
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
            render: (_, record) => (
                <Space size='large'>
                    <Button type='default' onClick={() => this.openTemplateDrawer(record)}>
                        模板配置
                    </Button>
                    <Button type='default' onClick={() => this.showSpreadSheetEditor(record)}>
                        编辑
                    </Button>
                    <Button type='primary'>发布报价</Button>
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

    private openTemplateDrawer = record => {
        this.setState({
            templateDrawerVisible: true,
            selectedRowsIndex: record.key - 1
        });
    };

    private clickSaveButtonHandler = () => {
        quotationTableData[this.state.templateSettingSelectIndex].template = [...this.selectedRows];

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

    private showQuotationTable = () => {
        this.setState({
            contentShownIndex: 1
        });
    };

    private showSpreadSheetEditor = record => {
        this.setState({
            contentShownIndex: 2,
            editSelectIndex: record.key - 1
        });
    };

    private initDesigner = (designerEntity: GCD.Spread.Sheets.Designer.Designer) => {
        this.designer = designerEntity;

        const spread = this.designer.getWorkbook() as GC.Spread.Sheets.Workbook;
        const sheet: GC.Spread.Sheets.Worksheet = spread.getActiveSheet();

        this.renderDataToDesigner(sheet);
    };

    private renderDataToDesigner = (sheet: GC.Spread.Sheets.Worksheet) => {
        const data = quotationTableData[this.state.editSelectIndex];
        const designerColumns = ['名称', '规格', '数量', '单价', '单位', '报价清单'];
        const { name, template } = data;
        if (name) {
            sheet.addSpan(0, 0, 1, designerColumns.length, GC.Spread.Sheets.SheetArea.viewport);
            sheet.getCell(0, 0, GC.Spread.Sheets.SheetArea.viewport).font('bold 20px 微软雅黑');
            sheet.setValue(0, 0, name);
        }

        designerColumns.forEach((item, index) => {
            sheet.setValue(1, index, item);

            const currentCell = sheet.getCell(1, index, GC.Spread.Sheets.SheetArea.viewport);
            currentCell.backColor('#5c9ad2');
            currentCell.foreColor('#fff');
        });

        if (template) {
            template.forEach((item, index) => {
                sheet.setValue(index + 2, 0, item.name);
                sheet.setValue(index + 2, 1, item.size);
                sheet.setValue(index + 2, 2, 1);
                sheet.setValue(index + 2, 3, '');
                sheet.setValue(index + 2, 4, item.unit);
                sheet.setValue(index + 2, 5, item.desc);

                const currentRow = sheet.getRange(index + 2, 0, 1, designerColumns.length);
                if (index % 2 === 0) {
                    currentRow.backColor('#dbeaf6');
                } else {
                    currentRow.backColor('#fff');
                }
            });
        }

        const all = sheet.getRange(
            0,
            0,
            2 + (template ? template.length : 0),
            designerColumns.length
        );
        all.hAlign(GC.Spread.Sheets.HorizontalAlign.center);
        all.vAlign(GC.Spread.Sheets.VerticalAlign.center);

        for (let i = 0; i < designerColumns.length; i++) {
            sheet.autoFitColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 20);
        }

        for (let i = 0; i < (template ? template.length : 0) + 2; i++) {
            sheet.setRowHeight(i, sheet.getRowHeight(i) + 20);
        }
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
                    onClick={this.showQuotationTable}
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
                        designerInitialized={this.initDesigner.bind(this)}
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
