import { FC, useState } from 'react';
import { Button, Input } from 'antd';
import scssStyles from './configItem.scss';
import { ITemplate } from '@/request/model';

interface IConfigInputsProps {
    index: number;
    value: ITemplate;
    onChange: (config: ITemplate) => void;
    onRemove: (index: number) => void;
}

export const ConfigItems: FC<IConfigInputsProps> = ({ index, value, onChange, onRemove }) => {
    const [key] = useState(value.key);
    const [name, setName] = useState(value.name);
    const [size, setSize] = useState(value.size);
    const [count, setCount] = useState(value.count);
    const [unit, setUnit] = useState(value.unit);
    const [desc, setDesc] = useState(value.desc);

    const handleNameChange = e => {
        setName(e.target.value);
        onChange({ key, count, price: 0, name: e.target.value, size, unit, desc });
    };

    const handleSizeChange = e => {
        setSize(e.target.value);
        onChange({ key, count, price: 0, name, size: e.target.value, unit, desc });
    };

    const handleUnitChange = e => {
        setUnit(e.target.value);
        onChange({ key, count, price: 0, name, size, unit: e.target.value, desc });
    };

    const handleCountChange = e => {
        setCount(e.target.value);
        onChange({ key, count: e.target.value, price: 0, name, size, unit, desc });
    };

    const handleDescriptionChange = e => {
        setDesc(e.target.value);
        onChange({ key, count, price: 0, name, size, unit, desc: e.target.value });
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
                value={value.name}
                onChange={handleNameChange}
            />
            <Input
                style={{ width: '30%' }}
                className={scssStyles.templateInput}
                placeholder='尺寸'
                value={value.size}
                onChange={handleSizeChange}
            />
            <Input
                style={{ width: '14%' }}
                className={scssStyles.templateInput}
                placeholder='数量'
                value={value.count}
                onChange={handleCountChange}
            />
            <Input
                style={{ width: '14%' }}
                placeholder='单位'
                value={value.unit}
                onChange={handleUnitChange}
            />
            <Input
                style={{ width: '100%' }}
                className={scssStyles.templateInput}
                placeholder='描述'
                value={value.desc}
                onChange={handleDescriptionChange}
            />
        </div>
    );
};
