import { FC, useState } from 'react';
import { Button } from 'antd';
import { ConfigItems, ConfigValue } from '../configItem/configItem';

interface IConfigItemsGroupProps {
    onChange: (config: ConfigValue[]) => void;
}

export const ConfigItemsGroup: FC<IConfigItemsGroupProps> = ({ onChange }) => {
    const [itemCount, setItemCount] = useState(1);
    const [values, setValues] = useState<ConfigValue[]>(
        Array(itemCount).fill({
            key: '',
            name: '',
            size: '',
            unit: '',
            desc: ''
        })
    );

    const onInputChange = (index: number, newValue: ConfigValue) => {
        const newValues = [...values];
        newValues[index] = newValue;
        setValues(newValues);

        onChange(newValues);
    };

    const onAddChildClick = () => {
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
        setItemCount(itemCount + 1);
    };

    const onRemoveChildClick = (index: number) => {
        const newValues = [...values];

        newValues.splice(index, 1);

        setValues(newValues);

        setItemCount(itemCount - 1);

        onChange(newValues);
    };

    const renderItems = () => {
        return values.map((value, index) => (
            <ConfigItems
                key={index}
                index={index + 1}
                value={value}
                onChange={newValue => {
                    onInputChange(index, newValue);
                }}
                onRemove={() => {
                    onRemoveChildClick(index);
                }}
            />
        ));
    };

    return (
        <div>
            {renderItems()}
            <Button style={{ marginBottom: '10px' }} type='default' onClick={onAddChildClick}>
                添加配置项
            </Button>
        </div>
    );
};
