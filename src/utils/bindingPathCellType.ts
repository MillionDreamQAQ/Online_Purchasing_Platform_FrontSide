import * as GC from '@grapecity/spread-sheets';

export class BindingPathCellType extends GC.Spread.Sheets.CellTypes.Text {
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
