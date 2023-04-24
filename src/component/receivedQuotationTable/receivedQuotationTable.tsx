import { Button, Space, Table, message } from 'antd';
import { FC, useEffect, useState } from 'react';
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
import { ColumnsType } from 'antd/es/table';
import { findUserById } from '@/request/userRequest';
import { IReceivedQuotation } from '@/request/model';
import scssStyles from './receivedQuotationTable.scss';
import { BindingPathCellType } from '@/utils/bindingPathCellType';
import { deleteReceivedQuotation, finishedQuotation } from '@/request/quotationRequest';

export const ReceivedQuotationTable: FC = () => {
    const [receivedQuotationData, setReceivedQuotationData] = useState<IReceivedQuotation[]>([]);
    const [editSelectIndex, setEditSelectIndex] = useState(-1);

    const [contentShownIndex, setContentShownIndex] = useState(1);

    let designer: GCD.Spread.Sheets.Designer.Designer;

    useEffect(() => {
        async function fetchData() {
            await refreshQuotations();
        }
        fetchData();
    }, []);

    const refreshQuotations = async () => {
        const res = await findUserById();

        if (res.code !== 200) {
            message.error({
                content: res.msg,
                duration: 1,
                style: {
                    marginTop: '50px'
                },
                onClose: () => {
                    window.location.href = '/';
                }
            });
        } else {
            const quotations = res.result.receivedQuotations.map(
                ({ _id, key, publisher, receiver, quotation }) => ({
                    id: _id,
                    key,
                    publisher,
                    receiver,
                    quotation
                })
            );

            setReceivedQuotationData(quotations);
        }
    };

    const receivedQuotationTableColumns: ColumnsType<IReceivedQuotation> = [
        {
            title: '报价单名称',
            dataIndex: ['quotation', 'quotationName'],
            key: 'quotationName',
            render: name => <a>{name}</a>
        },
        {
            title: '发布者',
            dataIndex: ['publisher', 'username'],
            key: 'username'
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record, index) => (
                <Space size='large'>
                    <Button
                        type='primary'
                        onClick={() => {
                            setContentShownIndex(2);
                            setEditSelectIndex(index);
                        }}
                    >
                        开始报价
                    </Button>
                    <Button
                        type='primary'
                        danger
                        onClick={async () => {
                            const deleteRes = await deleteReceivedQuotation(record.id);

                            if (deleteRes.code === 200) {
                                message.success({
                                    content: deleteRes.msg,
                                    duration: 1,
                                    style: {
                                        marginTop: '50px'
                                    }
                                });
                                await refreshQuotations();
                            } else {
                                message.error({
                                    content: deleteRes.msg,
                                    duration: 1,
                                    style: {
                                        marginTop: '50px'
                                    }
                                });
                            }
                        }}
                    >
                        拒绝报价
                    </Button>
                </Space>
            )
        }
    ];

    const clickFinishedQuotationButtonHandler = async () => {
        const { quotation } = receivedQuotationData[editSelectIndex];

        const res = await finishedQuotation(
            receivedQuotationData[editSelectIndex].publisher.username,
            quotation
        );

        if (res.code === 200) {
            message.success({
                content: res.msg,
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

    const renderReceivedQuotationTable = () => {
        return (
            <Table
                rowKey={receivedQuotationData => receivedQuotationData.key}
                columns={receivedQuotationTableColumns}
                dataSource={receivedQuotationData}
            />
        );
    };

    const renderReceivedQuotationDesigner = () => {
        return (
            <div>
                <Button
                    className={scssStyles.button}
                    onClick={() => {
                        setContentShownIndex(1);
                    }}
                    type='primary'
                    danger
                >
                    返回
                </Button>
                <Button
                    className={scssStyles.button}
                    onClick={() => {
                        clickFinishedQuotationButtonHandler();
                    }}
                    type='primary'
                >
                    完成报价
                </Button>
                <div className={scssStyles.quotationEditor}>
                    <Designer
                        styleInfo={{ width: '100%', height: '78vh' }}
                        config={GCD.Spread.Sheets.Designer.DefaultConfig}
                        spreadOptions={{ sheetCount: 1 }}
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

        const data = receivedQuotationData[editSelectIndex].quotation;
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
            selectedTemplate.length === 0 ? 1 : selectedTemplate.length,
            7,
            GC.Spread.Sheets.Tables.TableThemes.light1
        );

        const tableColumn1 = new GC.Spread.Sheets.Tables.TableColumn(0, 'name', '名称');
        const tableColumn2 = new GC.Spread.Sheets.Tables.TableColumn(1, 'size', '规格');
        const tableColumn3 = new GC.Spread.Sheets.Tables.TableColumn(2, 'count', '数量');
        const tableColumn4 = new GC.Spread.Sheets.Tables.TableColumn(3, 'price', '单价');
        const tableColumn5 = new GC.Spread.Sheets.Tables.TableColumn(4, 'unit', '单位');
        const tableColumn6 = new GC.Spread.Sheets.Tables.TableColumn(5, 'desc', '报价清单');
        const tableColumn7 = new GC.Spread.Sheets.Tables.TableColumn(6, '', '小计');

        table.setColumnDataFormula(6, '=[@数量]*[@单价]');

        table.bindColumns([
            tableColumn1,
            tableColumn2,
            tableColumn3,
            tableColumn4,
            tableColumn5,
            tableColumn6,
            tableColumn7
        ]);

        table.autoGenerateColumns(false);

        table.bindingPath('selectedTemplate');

        sheet.setColumnWidth(0, 100);
        sheet.setColumnWidth(1, 100);
        sheet.setColumnWidth(2, 100);
        sheet.setColumnWidth(3, 100);
        sheet.setColumnWidth(4, 100);
        sheet.setColumnWidth(5, 300);
        sheet.setColumnWidth(6, 100);

        sheet.setRowHeight(0, 40);
        sheet.setRowHeight(1, 40);
        for (let i = 0; i < selectedTemplate.length; i++) {
            sheet.setRowHeight(i + 2, 30);
        }

        sheet.addSpan(0, 0, 1, 7, GC.Spread.Sheets.SheetArea.viewport);
        sheet
            .getCell(0, 0, GC.Spread.Sheets.SheetArea.viewport)
            .font('bold 20px 微软雅黑')
            .hAlign(GC.Spread.Sheets.HorizontalAlign.center);

        const all = sheet.getRange(0, 0, 3 + (selectedTemplate ? selectedTemplate.length : 0), 7);
        all.hAlign(GC.Spread.Sheets.HorizontalAlign.center);
        all.vAlign(GC.Spread.Sheets.VerticalAlign.center);

        sheet
            .getCell(selectedTemplate.length + 2, 0, GC.Spread.Sheets.SheetArea.viewport)
            .font('bold 16px 微软雅黑')
            .text('合计');

        sheet
            .getRange(selectedTemplate.length + 2, 6, 1, 1)
            .formula(`SUM(G3:G${selectedTemplate.length + 2})`);

        sheet
            .getRange(selectedTemplate.length + 2, 0, 1, 7)
            .borderBottom(
                new GC.Spread.Sheets.LineBorder('black', GC.Spread.Sheets.LineStyle.thin)
            );

        sheet.setRowHeight(selectedTemplate.length + 2, 40);
        sheet.addSpan(selectedTemplate.length + 2, 0, 1, 6, GC.Spread.Sheets.SheetArea.viewport);

        sheet.resumePaint();
    };

    const renderContent = () => {
        switch (contentShownIndex) {
            case 1:
                return renderReceivedQuotationTable();
            case 2:
                return renderReceivedQuotationDesigner();
            default:
                return renderReceivedQuotationTable();
        }
    };

    return renderContent();
};
