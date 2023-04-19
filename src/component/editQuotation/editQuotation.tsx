import React from 'react';
import GC from '@grapecity/spread-sheets';
import '../../assets/css/gc.spread.sheets.excel2016colorful.16.0.2.css';

class EditQuotation extends React.Component {
    private spreadRef;

    private spread;

    constructor(props) {
        super(props);
        this.spreadRef = React.createRef();
        this.spread = null;
    }

    componentDidMount() {
        const spreadNS = GC.Spread.Sheets;

        const sheet = new spreadNS.Worksheet('Sheet1');
        this.spread = new spreadNS.Workbook(this.spreadRef.current);
        this.spread.suspendPaint();
        this.spread.addSheet(sheet);
        this.spread.resumePaint();
    }

    render() {
        return <div ref={this.spreadRef} />;
    }
}

export default EditQuotation;
