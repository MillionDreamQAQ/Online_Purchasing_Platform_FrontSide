import { useState } from 'react';
import scssStyles from '@/App.scss';

function App() {
    const [count, setCounts] = useState('');

    const onChange = (e: any) => {
        setCounts(e.target.value);
    };

    return (
        <div>
            <h2>webpack5-react-ts</h2>

            <div className={scssStyles.scssBox}>
                <div className={scssStyles.box}>scssBox</div>
            </div>

            <div>
                <p>受控组件</p>
                <input type='text' value={count} onChange={onChange} />
                <br />
                <p>非受控组件</p>
                <input type='text' />
            </div>
        </div>
    );
}

export default App;
