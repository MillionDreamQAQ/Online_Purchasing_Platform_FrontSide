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
import { IFinishedQuotation } from '@/request/model';
import scssStyles from './publishedQuotationTable.scss';
import { BindingPathCellType } from '@/utils/bindingPathCellType';
import { templateSelect } from '@/request/quotationRequest';
import { numberToLetter } from '@/utils/helper';
import {
    addChart,
    changColumnChartDataLabels,
    changeChartSeriesColor,
    changeChartSeriesGapWidthAndOverLap,
    changeChartTitle,
    changeSeries
} from '@/utils/chart';

interface IGroupQuotation {
    groupQuotation: IGroupQuotationItem[];
}

interface IGroupQuotationItem {
    key: string;
    quotations: IFinishedQuotation[];
}

export const PublishedQuotationTable: FC = () => {
    const [groupPublishedQuotation, setGroupPublishedQuotation] = useState<IGroupQuotationItem[]>(
        []
    );
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
            const finishedQuotations = res.result.finishedQuotations.map(
                ({ _id, key, publisher, receiver, quotation }) => ({
                    id: _id,
                    key,
                    publisher,
                    receiver,
                    quotation
                })
            );

            const groupedQuotations: IGroupQuotation = finishedQuotations.reduce(
                (grouped: any, q) => {
                    if (!grouped[q.quotation.key]) {
                        grouped[q.quotation.key] = {
                            key: q.quotation.key,
                            quotations: []
                        };
                    }

                    grouped[q.quotation.key].quotations.push(q);
                    return grouped;
                },
                {}
            );

            const groupPublishedQuotation: IGroupQuotationItem[] = Object.keys(
                groupedQuotations
            ).map(k => groupedQuotations[k]);

            setGroupPublishedQuotation(groupPublishedQuotation);
        }
    };

    const receivedQuotationTableColumns: ColumnsType<IGroupQuotationItem> = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: '报价单名称',
            dataIndex: ['quotations', '0', 'quotation', 'quotationName'],
            key: 'quotationName',
            render: name => <a>{name}</a>
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
                        报价分析
                    </Button>
                    <Button type='primary'>对比报价</Button>
                    <Button type='primary' danger>
                        关闭报价
                    </Button>
                </Space>
            )
        }
    ];

    const renderReceivedQuotationTable = () => {
        return (
            <Table
                rowKey={groupPublishedQuotation => groupPublishedQuotation.key}
                columns={receivedQuotationTableColumns}
                dataSource={groupPublishedQuotation}
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
                >
                    返回
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

        const data = groupPublishedQuotation[editSelectIndex];
        const { selectedTemplate } = data.quotations[0].quotation;

        // bind data source
        const dataSource = new GC.Spread.Sheets.Bindings.CellBindingSource(data);
        sheet.setDataSource(dataSource);

        const bindingPathCellType = new BindingPathCellType();

        // render header
        sheet
            .getCell(0, 0)
            .bindingPath('quotations.0.quotation.quotationName')
            .cellType(bindingPathCellType)
            .vAlign(GC.Spread.Sheets.VerticalAlign.center);

        // render quotations table
        const quotationsTable = sheet.tables.add(
            'quotationsTable',
            2,
            0,
            selectedTemplate.length === 0 ? 1 : selectedTemplate.length,
            5,
            GC.Spread.Sheets.Tables.TableThemes.light1
        );

        const quotationsTableColumn1 = new GC.Spread.Sheets.Tables.TableColumn(0, 'name', '名称');
        const quotationsTableColumn2 = new GC.Spread.Sheets.Tables.TableColumn(1, 'size', '规格');
        const quotationsTableColumn3 = new GC.Spread.Sheets.Tables.TableColumn(2, 'count', '数量');
        const quotationsTableColumn4 = new GC.Spread.Sheets.Tables.TableColumn(4, 'unit', '单位');
        const quotationsTableColumn5 = new GC.Spread.Sheets.Tables.TableColumn(
            5,
            'desc',
            '报价清单'
        );

        quotationsTable.bindColumns([
            quotationsTableColumn1,
            quotationsTableColumn2,
            quotationsTableColumn3,
            quotationsTableColumn4,
            quotationsTableColumn5
        ]);

        quotationsTable.autoGenerateColumns(false);

        quotationsTable.bindingPath('quotations.0.quotation.selectedTemplate');

        for (let i = 0; i < 5; i++) {
            if (i === 4) {
                sheet.setColumnWidth(i, 300);
                break;
            }
            sheet.setColumnWidth(i, 100);
        }

        // render compare table
        const cfs = sheet.conditionalFormats;

        for (let i = 0; i < selectedTemplate.length; i++) {
            const compareTable = sheet.tables.add(
                `compareTable${i}`,
                2,
                5 + i,
                selectedTemplate.length,
                1,
                GC.Spread.Sheets.Tables.TableThemes.light1
            );

            const compareTableColumn = new GC.Spread.Sheets.Tables.TableColumn(
                0,
                'price',
                data.quotations[i].publisher.username
            );

            compareTable.autoGenerateColumns(false);
            compareTable.bindColumns([compareTableColumn]);
            compareTable.bindingPath(`quotations.${i}.quotation.selectedTemplate`);
        }

        for (let i = 0; i < selectedTemplate.length; i++) {
            cfs.add2ScaleRule(
                GC.Spread.Sheets.ConditionalFormatting.ScaleValueType.lowestValue,
                0,
                'green',
                GC.Spread.Sheets.ConditionalFormatting.ScaleValueType.highestValue,
                Number.MAX_SAFE_INTEGER,
                'red',
                [new GC.Spread.Sheets.Range(3 + i, 5, 1, selectedTemplate.length)]
            );
        }

        for (let i = 0; i < data.quotations.length; i++) {
            sheet.setColumnWidth(5 + i, 100);
        }

        // render total at last column
        sheet.addSpan(3 + templateSelect.length, 0, 1, 5, GC.Spread.Sheets.SheetArea.viewport);
        sheet.getRange(3 + templateSelect.length, 0, 1, 5).backColor('#f0f0f0');
        sheet
            .getCell(3 + templateSelect.length, 0, GC.Spread.Sheets.SheetArea.viewport)
            .value('汇总')
            .font('bold 15px 微软雅黑')
            .hAlign(GC.Spread.Sheets.HorizontalAlign.center)
            .vAlign(GC.Spread.Sheets.VerticalAlign.center);
        for (let i = 0; i < selectedTemplate.length; i++) {
            sheet
                .getRange(3 + selectedTemplate.length, 5 + i, 1, 1)
                .formula(
                    `SUM(${numberToLetter(6 + i)}4:${numberToLetter(6 + i)}${
                        selectedTemplate.length + 3
                    })`
                );
        }

        cfs.add2ScaleRule(
            GC.Spread.Sheets.ConditionalFormatting.ScaleValueType.lowestValue,
            0,
            'green',
            GC.Spread.Sheets.ConditionalFormatting.ScaleValueType.highestValue,
            Number.MAX_SAFE_INTEGER,
            'red',
            [new GC.Spread.Sheets.Range(3 + selectedTemplate.length, 5, 1, selectedTemplate.length)]
        );

        // set row height
        sheet.setRowHeight(0, 40);
        sheet.setRowHeight(1, 40);
        sheet.setRowHeight(2, 30);
        for (let i = 0; i < selectedTemplate.length; i++) {
            sheet.setRowHeight(i + 3, 30);
        }
        sheet.setRowHeight(3 + selectedTemplate.length, 30);

        // set span and style
        sheet.addSpan(0, 0, 1, 5 + data.quotations.length, GC.Spread.Sheets.SheetArea.viewport);
        sheet
            .getCell(0, 0, GC.Spread.Sheets.SheetArea.viewport)
            .font('bold 20px 微软雅黑')
            .hAlign(GC.Spread.Sheets.HorizontalAlign.center);

        sheet.addSpan(1, 0, 1, 5, GC.Spread.Sheets.SheetArea.viewport);
        sheet
            .getCell(1, 0, GC.Spread.Sheets.SheetArea.viewport)
            .text('报价清单')
            .font('bold 16px 微软雅黑')
            .hAlign(GC.Spread.Sheets.HorizontalAlign.center);

        sheet.addSpan(1, 5, 1, data.quotations.length, GC.Spread.Sheets.SheetArea.viewport);
        sheet
            .getCell(1, 5, GC.Spread.Sheets.SheetArea.viewport)
            .text('供应商报价')
            .font('bold 16px 微软雅黑')
            .hAlign(GC.Spread.Sheets.HorizontalAlign.center);

        // set all style
        const all = sheet.getRange(0, 0, 4 + (selectedTemplate ? selectedTemplate.length : 0), 7);
        all.hAlign(GC.Spread.Sheets.HorizontalAlign.center);
        all.vAlign(GC.Spread.Sheets.VerticalAlign.center);

        // add chart
        const chartType = [
            {
                type: GC.Spread.Sheets.Charts.ChartType.columnClustered,
                desc: 'column',
                dataFormula: `F3:${numberToLetter(5 + data.quotations.length)}${
                    4 + selectedTemplate.length
                }`,
                changeStyle(chart, length) {
                    chart.axes({ primaryValue: { title: { text: '价格 (RMB)' } } });
                    chart.switchDataOrientation(true);
                    changeChartTitle(chart, '柱状报价对比图');
                    changColumnChartDataLabels(chart);
                    changeChartSeriesColor(chart);
                    changeChartSeriesGapWidthAndOverLap(chart);
                    changeSeries(chart, length);
                }
            },
            {
                type: GC.Spread.Sheets.Charts.ChartType.lineStacked,
                desc: 'column',
                dataFormula: `F3:${numberToLetter(5 + data.quotations.length)}${
                    4 + selectedTemplate.length
                }`,
                changeStyle(chart, length) {
                    chart.axes({ primaryValue: { title: { text: '价格 (RMB)' } } });
                    chart.switchDataOrientation(true);
                    changeChartTitle(chart, '折线报价对比图');
                    changColumnChartDataLabels(chart);
                    changeChartSeriesColor(chart);
                    changeChartSeriesGapWidthAndOverLap(chart);
                    changeSeries(chart, length);
                }
            },
            {
                type: GC.Spread.Sheets.Charts.ChartType.barClustered,
                desc: 'bar',
                dataFormula: `F3:${numberToLetter(5 + data.quotations.length)}${
                    4 + selectedTemplate.length
                }`,
                changeStyle(chart, length) {
                    chart.legend({ position: GC.Spread.Sheets.Charts.LegendPosition.right });
                    chart.axes({ primaryValue: { title: { text: '价格 (RMB)' } } });
                    chart.switchDataOrientation(true);
                    changeChartTitle(chart, '条状报价对比图');
                    changColumnChartDataLabels(chart);
                    changeChartSeriesColor(chart);
                    changeChartSeriesGapWidthAndOverLap(chart);
                    changeSeries(chart, length);
                }
            }
        ];
        for (let i = 0; i < chartType.length; i++) {
            const chart = addChart(
                sheet,
                0,
                140 + selectedTemplate.length * 30 + i * 450 + 50,
                chartType[i].type,
                chartType[i].dataFormula,
                i
            );
            chartType[i].changeStyle(chart, selectedTemplate.length);
        }

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
