import { FC, SetStateAction, useEffect, useState } from 'react';
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
import { addQuotation, deleteQuotation, templateSelect } from '@/request/quotationRequest';
import { IQuotation, ITemplate } from '@/request/model';
import { ConfigItemsGroup } from '../configItemsGroup/configItemsGroup';
import { findUserById, getAllUserWithoutMe } from '@/request/userRequest';

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
    const [quotationData, setQuotationData] = useState<IQuotation[]>([]);
    const [userData, setUserData] = useState<any[]>([]);

    const [contentShownIndex, setContentShownIndex] = useState(1);

    const [addQuotationDrawerVisible, setAddQuotationDrawerVisible] = useState(false);
    const [templateSettingDrawerVisible, setTemplateSettingDrawerVisible] = useState(false);
    const [publishQuotationDrawerVisible, setPublishQuotationDrawerVisible] = useState(false);

    const [editSelectIndex, setEditSelectIndex] = useState(-1);
    const [templateSettingIndex, setTemplateSettingIndex] = useState(-1);

    const [selectTemplate, setSelectTemplate] = useState<ITemplate[]>([]);
    const [selectUser, setSelectUser] = useState<any[]>([]);

    const [addQuotationName, setAddQuotationName] = useState('');

    const [configValue, setConfigValue] = useState<ITemplate[]>([]);

    let designer: GCD.Spread.Sheets.Designer.Designer;

    useEffect(() => {
        async function fetchData() {
            await refreshQuotations();
            await getUsersList();
        }
        fetchData();
    }, []);

    const refreshQuotations = async () => {
        const res = await findUserById();

        const quotations = res.result.quotations.map(
            ({ _id, quotationName, template, key, selectedTemplate }) => ({
                id: _id,
                key,
                quotationName,
                template,
                selectedTemplate
            })
        );

        setQuotationData(quotations);
    };

    const getUsersList = async () => {
        const res = await getAllUserWithoutMe();

        setUserData(res.users.map(({ _id, username }) => ({ id: _id, username })));
    };

    const handleQuotationInputChange = (e: { target: { value: SetStateAction<string> } }) => {
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
                            setTemplateSettingDrawerVisible(true);
                            setTemplateSettingIndex(index);
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
                        预览
                    </Button>
                    <Button
                        type='primary'
                        onClick={() => {
                            setPublishQuotationDrawerVisible(true);
                        }}
                    >
                        发布报价
                    </Button>
                    <Button
                        type='primary'
                        danger
                        onClick={async () => {
                            const deleteRes = await deleteQuotation(quotationData[index].id);

                            if (deleteRes.code === 200) {
                                message.success({
                                    content: deleteRes.msg,
                                    duration: 1,
                                    style: {
                                        marginTop: '50px'
                                    }
                                });
                            } else {
                                message.error({
                                    content: deleteRes.msg,
                                    duration: 1,
                                    style: {
                                        marginTop: '50px'
                                    }
                                });
                            }

                            await refreshQuotations();
                        }}
                    >
                        删除
                    </Button>
                </Space>
            )
        }
    ];

    const userTableColumns: ColumnsType<any> = [
        {
            title: '用户名',
            dataIndex: 'username',
            filters: userData.map(({ username }) => ({ text: username, value: username })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter(value, record) {
                return record.username.indexOf(value) === 0;
            },
            render: (text: string) => <a>{text}</a>
        }
    ];

    const templateRowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: ITemplate[]) => {
            setSelectTemplate(selectedRows);
        },
        defaultSelectedRowKeys: quotationData[templateSettingIndex]?.selectedTemplate?.map(
            ({ key }) => key
        )
    };

    const userRowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            setSelectUser(selectedRows);
        }
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
            for (const config of configValue) {
                if (config.name === '') {
                    message.error({
                        content: '配置项名称不能为空',
                        duration: 1,
                        style: {
                            marginTop: '50px'
                        }
                    });
                    return;
                }
            }

            const addResponse = await addQuotation({
                id: '',
                key: '',
                quotationName: addQuotationName,
                template: configValue,
                selectedTemplate: []
            });

            if (addResponse.code === 200) {
                setAddQuotationName('');

                message.success({
                    content: '报价单添加成功',
                    duration: 1,
                    style: {
                        marginTop: '50px'
                    }
                });
            } else {
                message.error({
                    content: addResponse.msg,
                    duration: 1,
                    style: {
                        marginTop: '50px'
                    }
                });
            }

            await refreshQuotations();
        }
    };

    const saveQuotationTemplateSelect = async () => {
        const res = await templateSelect(
            quotationData[templateSettingIndex].id,
            selectTemplate.map(template => template.key)
        );

        if (res.code === 200) {
            message.success({
                content: '模板配置保存成功',
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

        await refreshQuotations();
    };

    const handleQuotationItemsInputChange = (config: ITemplate[]) => {
        setConfigValue(config);
    };

    const renderQuotationTable = () => {
        return (
            <div>
                <Button
                    className={scssStyles.button}
                    onClick={() => {
                        setAddQuotationDrawerVisible(true);
                    }}
                    type='primary'
                >
                    添加报价单
                </Button>

                <Table
                    rowKey={quotationTableData => quotationTableData.key}
                    columns={quotationTableColumns}
                    dataSource={quotationData}
                />

                {/* Template Drawer */}
                <Drawer
                    className={scssStyles.rightDrawer}
                    size='large'
                    width='960px'
                    placement='right'
                    onClose={setTemplateSettingDrawerVisible.bind(this, false)}
                    open={templateSettingDrawerVisible}
                >
                    <div>
                        <Table
                            rowKey={templateTableData => templateTableData.key}
                            rowSelection={{
                                ...templateRowSelection
                            }}
                            columns={templateTableColumns}
                            dataSource={quotationData[templateSettingIndex]?.template}
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

                {/* Publish Quotation */}
                <Drawer
                    className={scssStyles.rightDrawer}
                    size='default'
                    placement='right'
                    onClose={setPublishQuotationDrawerVisible.bind(this, false)}
                    open={publishQuotationDrawerVisible}
                >
                    <div>
                        <Table
                            rowKey={userData => userData.id}
                            rowSelection={{
                                ...userRowSelection
                            }}
                            columns={userTableColumns}
                            dataSource={userData}
                        ></Table>
                        <Button style={{ marginTop: '16px' }} type='primary'>
                            发布报价单
                        </Button>
                    </div>
                </Drawer>
            </div>
        );
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

    const initDesigner = (designerEntity: GCD.Spread.Sheets.Designer.Designer) => {
        designer = designerEntity;

        const spread = designer.getWorkbook() as GC.Spread.Sheets.Workbook;
        const sheet: GC.Spread.Sheets.Worksheet = spread.getActiveSheet();

        renderDataToDesigner(sheet);
    };

    const renderDataToDesigner = (sheet: GC.Spread.Sheets.Worksheet) => {
        sheet.suspendPaint();

        const data = quotationData[editSelectIndex];
        const { selectedTemplate } = data;

        const dataSource = new GC.Spread.Sheets.Bindings.CellBindingSource(data);
        sheet.setDataSource(dataSource);

        const bindingPathCellType = new BindingPathCellType();
        sheet
            .getCell(0, 0)
            .bindingPath('quotationName')
            .cellType(bindingPathCellType)
            .vAlign(GC.Spread.Sheets.VerticalAlign.center);

        const table = sheet.tables.add(
            'quotationsTable',
            1,
            0,
            selectedTemplate.length,
            6,
            GC.Spread.Sheets.Tables.TableThemes.light1
        );

        const tableColumn1 = new GC.Spread.Sheets.Tables.TableColumn(0, 'name', '名称');
        const tableColumn2 = new GC.Spread.Sheets.Tables.TableColumn(1, 'size', '规格');
        const tableColumn3 = new GC.Spread.Sheets.Tables.TableColumn(2, 'count', '数量');
        const tableColumn4 = new GC.Spread.Sheets.Tables.TableColumn(3, 'price', '单价');
        const tableColumn5 = new GC.Spread.Sheets.Tables.TableColumn(4, 'unit', '单位');
        const tableColumn6 = new GC.Spread.Sheets.Tables.TableColumn(5, 'desc', '报价清单');

        table.bindColumns([
            tableColumn1,
            tableColumn2,
            tableColumn3,
            tableColumn4,
            tableColumn5,
            tableColumn6
        ]);

        table.autoGenerateColumns(false);

        table.bindingPath('selectedTemplate');

        sheet.setColumnWidth(0, 100);
        sheet.setColumnWidth(1, 100);
        sheet.setColumnWidth(2, 100);
        sheet.setColumnWidth(3, 100);
        sheet.setColumnWidth(4, 100);
        sheet.setColumnWidth(5, 300);

        sheet.setRowHeight(0, 40);
        sheet.setRowHeight(1, 40);
        for (let i = 0; i < selectedTemplate.length; i++) {
            sheet.setRowHeight(i + 2, 30);
        }

        sheet.addSpan(0, 0, 1, 6, GC.Spread.Sheets.SheetArea.viewport);
        sheet
            .getCell(0, 0, GC.Spread.Sheets.SheetArea.viewport)
            .font('bold 20px 微软雅黑')
            .hAlign(GC.Spread.Sheets.HorizontalAlign.center);

        const all = sheet.getRange(0, 0, 2 + (selectedTemplate ? selectedTemplate.length : 0), 7);
        all.hAlign(GC.Spread.Sheets.HorizontalAlign.center);
        all.vAlign(GC.Spread.Sheets.VerticalAlign.center);

        sheet.resumePaint();
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

class BindingPathCellType extends GC.Spread.Sheets.CellTypes.Text {
    paint(
        ctx: CanvasRenderingContext2D,
        value: string | null | undefined,
        x: number,
        y: number,
        w: number,
        h: number,
        style: GC.Spread.Sheets.Style,
        context: { row?: any; col?: any; sheet?: any }
    ) {
        if (value === null || value === undefined) {
            const { sheet } = context;
            const { row } = context;
            const { col } = context;
            if (sheet && (row === 0 || !!row) && (col === 0 || !!col)) {
                const bindingPath = sheet.getBindingPath(context.row, context.col);
                if (bindingPath) {
                    value = `[${bindingPath}]`;
                }
            }
        }
        super.paint(ctx, value, x, y, w, h, style, context);
    }
}
