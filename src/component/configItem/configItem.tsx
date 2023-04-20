import { FC, useState } from 'react';
import { Button, Input } from 'antd';
import scssStyles from './configItem.scss';

export interface ConfigValue {
    key: string;
    name: string;
    size: string;
    unit: string;
    desc: string;
}

interface IConfigInputsProps {
    index: number;
    onChange: (config: ConfigValue) => void;
    onRemove: (index: number) => void;
}

export const ConfigItems: FC<IConfigInputsProps> = ({ index, onChange, onRemove }) => {
    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [unit, setUnit] = useState('');
    const [desc, setDesc] = useState('');

    const handleNameChange = e => {
        setName(e.target.value);
        onChange({ key: Date.now().valueOf().toString(), name: e.target.value, size, unit, desc });
    };

    const handleSizeChange = e => {
        setSize(e.target.value);
        onChange({ key: Date.now().valueOf().toString(), name, size: e.target.value, unit, desc });
    };

    const handleUnitChange = e => {
        setUnit(e.target.value);
        onChange({ key: Date.now().valueOf().toString(), name, size, unit: e.target.value, desc });
    };

    const handleDescriptionChange = e => {
        setDesc(e.target.value);
        onChange({ key: Date.now().valueOf().toString(), name, size, unit, desc: e.target.value });
    };

    const handleRemoveClick = () => {
        onRemove(index - 1);
    };

    return (
        <div>
            <div
                style={{
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                配置项{index}
                <Button type='primary' danger onClick={handleRemoveClick}>
                    删除
                </Button>
            </div>
            <Input
                style={{ width: '35%' }}
                className={scssStyles.templateInput}
                placeholder='名称'
                value={name}
                onChange={handleNameChange}
            />
            <Input
                style={{ width: '30%' }}
                className={scssStyles.templateInput}
                placeholder='尺寸'
                value={size}
                onChange={handleSizeChange}
            />
            <Input
                style={{ width: '30%' }}
                placeholder='单位'
                value={unit}
                onChange={handleUnitChange}
            />
            <Input
                style={{ width: '100%' }}
                className={scssStyles.templateInput}
                placeholder='描述'
                value={desc}
                onChange={handleDescriptionChange}
            />
        </div>
    );
};
