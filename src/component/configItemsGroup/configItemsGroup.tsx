import { FC, useState } from 'react';
import { Button } from 'antd';
import { ConfigItems, ConfigValue } from '../configItem/configItem';

interface IConfigItemsGroupProps {
    onChange: (config: ConfigValue[]) => void;
}

export const ConfigItemsGroup: FC<IConfigItemsGroupProps> = ({ onChange }) => {
    const [itemCount, setItemCount] = useState(1);
    const [values, setValues] = useState<ConfigValue[]>(Array(itemCount).fill(''));

    const onInputChange = (index: number, newValue: ConfigValue) => {
        const newValues = [...values];
        newValues[index] = newValue;
        setValues(newValues);

        onChange(newValues);
    };

    const onAddChildClick = () => {
        setItemCount(itemCount + 1);
        setValues([
            ...values,
            {
                key: '',
                name: '',
                size: '',
                unit: '',
                desc: ''
            }
        ]);
    };

    const childInputs = [] as any;

    for (let i = 0; i < itemCount; i++) {
        childInputs.push(
            <ConfigItems
                key={i}
                index={i + 1}
                onChange={newValue => {
                    onInputChange(i, newValue);
                }}
            />
        );
    }

    return (
        <div>
            {childInputs}
            <Button style={{ marginBottom: '10px' }} type='primary' onClick={onAddChildClick}>
                添加配置项
            </Button>
        </div>
    );
};
