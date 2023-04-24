import * as GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets-print';
import '@grapecity/spread-sheets-shapes';
import '@grapecity/spread-sheets-slicers';
import '@grapecity/spread-sheets-pivot-addon';
import '@grapecity/spread-sheets-tablesheet';
import '@grapecity/spread-sheets-io';
import '@grapecity/spread-sheets-resources-zh';
import '@grapecity/spread-sheets-designer-resources-cn';

const colorArray = [
    'rgb(120, 180, 240)',
    'rgb(240, 160, 80)',
    'rgb(140, 240, 120)',
    'rgb(120, 150, 190)'
];

export const addChart = (
    sheet: GC.Spread.Sheets.Worksheet,
    x: number,
    y: number,
    chartType: GC.Spread.Sheets.Charts.ChartType,
    dataFormula: string,
    index: number
) => {
    return sheet.charts.add(
        `${sheet.name()}Chart${index}`,
        chartType,
        x,
        y,
        900,
        400,
        dataFormula,
        GC.Spread.Sheets.Charts.RowCol.rows
    );
};

export const changeChartTitle = (chart, title) => {
    chart.title({ text: title });
};

export const changColumnChartDataLabels = chart => {
    const dataLabels = chart.dataLabels();
    dataLabels.showValue = true;
    dataLabels.showSeriesName = false;
    dataLabels.showCategoryName = false;
    const dataLabelPosition = GC.Spread.Sheets.Charts.DataLabelPosition;
    dataLabels.position = dataLabelPosition.outsideEnd;
    chart.dataLabels(dataLabels);
};

export const changeChartSeriesColor = chart => {
    const series = chart.series().get();
    for (let i = 0; i < series.length; i++) {
        chart.series().set(i, { backColor: colorArray[i] });
    }
};

export const changeChartSeriesGapWidthAndOverLap = chart => {
    const seriesItem = chart.series().get(0);
    seriesItem.gapWidth = 2;
    seriesItem.overlap = 0;
    chart.series().set(0, seriesItem);
};

export const changeSeries = (chart, length) => {
    for (let i = 0; i < length; i++) {
        const series = chart.series().get(i);
        series.xValues = `Sheet1!$A$4:$A${4 + length}`;
        chart.series().set(i, series);
    }
};
