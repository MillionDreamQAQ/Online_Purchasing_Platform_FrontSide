import { FC, useEffect, useState } from 'react';
import { Button, Drawer, Input, Space, Table, message } from 'antd';
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
import { addQuotation, getAllQuotations, templateSelect } from '@/request/quotationRequest';
import { IQuotation, ITemplate } from '@/request/model';
import { ConfigItems, ConfigValue } from '../configItem/configItem';
import { ConfigItemsGroup } from '../configItemsGroup/configItemsGroup';

const templateTableColumns: ColumnsType<ITemplate> = [
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

export const QuotationTable: FC = () => {
    const [quotationTableData, setQuotationTableData] = useState<IQuotation[]>([]);

    const [contentShownIndex, setContentShownIndex] = useState(1);

    const [addQuotationDrawerVisible, setAddQuotationDrawerVisible] = useState(false);
    const [templateSetDrawerVisible, setTemplateSetDrawerVisible] = useState(false);

    const [editSelectIndex, setEditSelectIndex] = useState(-1);
    const [editTemplateIndex, setEditTemplateIndex] = useState(-1);

    const [selectTemplate, setSelectTemplate] = useState<ITemplate[]>([]);
    const [addQuotationName, setAddQuotationName] = useState('');

    let designer: GCD.Spread.Sheets.Designer.Designer;
    let configValue = [] as ConfigValue[];

    useEffect(() => {
        async function fetchData() {
            const res = await getAllQuotations();

            const quotations = res.data.map(
                ({ quotationName, template, key, selectedTemplate }) => ({
                    key,
                    quotationName,
                    template,
                    selectedTemplate
                })
            );

            setQuotationTableData(quotations);
        }
        fetchData();
    }, []);

    const handleQuotationInputChange = e => {
        setAddQuotationName(e.target.value);
    };

    const quotationTableColumns: ColumnsType<IQuotation> = [
        {
            title: '报价单名称',
            dataIndex: 'quotationName',
            key: 'quotationName',
            render: name => <a>{name}</a>
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record, index) => (
                <Space size='large'>
                    <Button
                        type='default'
                        onClick={() => {
                            setTemplateSetDrawerVisible(true);
                            setEditTemplateIndex(index);
                        }}
                    >
                        模板配置
                    </Button>
                    <Button
                        type='default'
                        onClick={() => {
                            setContentShownIndex(2);
                            setEditSelectIndex(index);
                        }}
                    >
                        编辑
                    </Button>
                    <Button type='primary'>发布报价</Button>
                </Space>
            )
        }
    ];

    const templateRowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: ITemplate[]) => {
            setSelectTemplate(selectedRows);
        },
        defaultSelectedRowKeys: quotationTableData[editTemplateIndex]?.selectedTemplate?.map(
            ({ key }) => key
        )
    };

    const addQuotationButtonHandler = async () => {
        if (addQuotationName === '') {
            message.error({
                content: '报价单名称不能为空',
                duration: 1,
                style: {
                    marginTop: '50px'
                }
            });
        } else {
            const res = await addQuotation({
                key: Date.now().valueOf().toString(),
                quotationName: addQuotationName,
                template: configValue,
                selectedTemplate: []
            });

            if (res.code === 200) {
                message.success({
                    content: '报价单添加成功',
                    duration: 1,
                    style: {
                        marginTop: '50px'
                    }
                });
            } else {
                message.error({
                    content: res.msg,
                    duration: 1,
                    style: {
                        marginTop: '50px'
                    }
                });
            }
        }
    };

    const saveQuotationTemplateSelect = async () => {
        const res = await templateSelect(
            quotationTableData[editTemplateIndex].quotationName,
            selectTemplate
        );

        if (res.code === 200) {
            message.success({
                content: '模板配置成功',
                duration: 1,
                style: {
                    marginTop: '50px'
                }
            });
        } else {
            message.error({
                content: res.msg,
                duration: 1,
                style: {
                    marginTop: '50px'
                }
            });
        }
    };

    const initDesigner = (designerEntity: GCD.Spread.Sheets.Designer.Designer) => {
        designer = designerEntity;

        const spread = designer.getWorkbook() as GC.Spread.Sheets.Workbook;
        const sheet: GC.Spread.Sheets.Worksheet = spread.getActiveSheet();

        renderDataToDesigner(sheet);
    };

    const renderDataToDesigner = (sheet: GC.Spread.Sheets.Worksheet) => {
        sheet.suspendPaint();

        const data = quotationTableData[editSelectIndex];
        const designerColumns = ['名称', '规格', '数量', '单价', '单位', '报价清单'];
        const { quotationName, selectedTemplate } = data;
        if (quotationName) {
            sheet.addSpan(0, 0, 1, designerColumns.length, GC.Spread.Sheets.SheetArea.viewport);
            sheet.getCell(0, 0, GC.Spread.Sheets.SheetArea.viewport).font('bold 20px 微软雅黑');
            sheet.setValue(0, 0, quotationName);
        }

        designerColumns.forEach((item, index) => {
            sheet.setValue(1, index, item);

            const currentCell = sheet.getCell(1, index, GC.Spread.Sheets.SheetArea.viewport);
            currentCell.backColor('#5c9ad2');
            currentCell.foreColor('#fff');
        });

        if (selectedTemplate) {
            selectedTemplate.forEach((item, index) => {
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
            2 + (selectedTemplate ? selectedTemplate.length : 0),
            designerColumns.length
        );
        all.hAlign(GC.Spread.Sheets.HorizontalAlign.center);
        all.vAlign(GC.Spread.Sheets.VerticalAlign.center);

        for (let i = 0; i < designerColumns.length; i++) {
            sheet.autoFitColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 20);
        }

        for (let i = 0; i < (selectedTemplate ? selectedTemplate.length : 0) + 2; i++) {
            sheet.setRowHeight(i, sheet.getRowHeight(i) + 20);
        }

        sheet.resumePaint();
    };

    const renderQuotationTable = () => {
        return (
            <div>
                <Button
                    className={scssStyles.button}
                    onClick={setAddQuotationDrawerVisible.bind(this, true)}
                    type='primary'
                >
                    添加报价单
                </Button>

                <Button className={scssStyles.button} type='primary'>
                    导入报价单
                </Button>

                <Button className={scssStyles.button} type='primary'>
                    导出报价单
                </Button>

                <Button className={scssStyles.button} type='primary' danger>
                    删除
                </Button>

                <Table
                    rowKey={quotationTableData => quotationTableData.key}
                    columns={quotationTableColumns}
                    dataSource={quotationTableData}
                />

                {/* Template Drawer */}
                <Drawer
                    className={scssStyles.rightDrawer}
                    size='large'
                    width='960px'
                    placement='right'
                    onClose={setTemplateSetDrawerVisible.bind(this, false)}
                    open={templateSetDrawerVisible}
                >
                    <div>
                        <Table
                            rowKey={templateTableData => templateTableData.key}
                            rowSelection={{
                                ...templateRowSelection
                            }}
                            columns={templateTableColumns}
                            dataSource={quotationTableData[editTemplateIndex]?.template}
                        />
                        <Button type='primary' onClick={saveQuotationTemplateSelect}>
                            保存配置
                        </Button>
                    </div>
                </Drawer>

                {/* Add Quotation Drawer */}
                <Drawer
                    className={scssStyles.rightDrawer}
                    size='large'
                    placement='right'
                    onClose={setAddQuotationDrawerVisible.bind(this, false)}
                    open={addQuotationDrawerVisible}
                >
                    <div>
                        <div style={{ marginBottom: '10px' }}>报价单名称</div>
                        <Input
                            className={scssStyles.quotationNameInput}
                            value={addQuotationName}
                            onChange={handleQuotationInputChange}
                            placeholder='输入报价单名称'
                        />
                        <ConfigItemsGroup onChange={handleQuotationItemsInputChange} />
                        <Button type='primary' onClick={addQuotationButtonHandler}>
                            添加报价单
                        </Button>
                    </div>
                </Drawer>
            </div>
        );
    };

    const handleQuotationItemsInputChange = (config: ConfigValue[]) => {
        configValue = config;
    };

    const renderQuotationEditor = () => {
        return (
            <div>
                <Button
                    className={scssStyles.button}
                    onClick={setContentShownIndex.bind(this, 1)}
                    type='default'
                >
                    返回
                </Button>

                <Button className={scssStyles.button} type='primary'>
                    保存模板
                </Button>

                <div className={scssStyles.quotationEditor}>
                    <Designer
                        styleInfo={{ width: '100%', height: '78vh' }}
                        config={GCD.Spread.Sheets.Designer.DefaultConfig}
                        spreadOptions={{ sheetCount: 2 }}
                        designerInitialized={initDesigner}
                    ></Designer>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (contentShownIndex) {
            case 1:
                return renderQuotationTable();
            case 2:
                return renderQuotationEditor();
            default:
                return renderQuotationTable();
        }
    };

    return renderContent();
};
