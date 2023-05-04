import { FC, forwardRef, useImperativeHandle, useState } from 'react';
import { Button } from 'antd';
import { ConfigItems } from '../configItem/configItem';
import { ITemplate } from '@/request/model';

interface IConfigItemsGroupProps {
    onChange: (config: ITemplate[]) => void;
    ref?: any;
}

export const ConfigItemsGroup: FC<IConfigItemsGroupProps> = forwardRef(function ConfigItemsGroup(
    props,
    ref
) {
    const { onChange } = props;
    const [uniqueKey, setUniqueKey] = useState(1);
    const [itemCount, setItemCount] = useState(1);
    const [values, setValues] = useState<ITemplate[]>([
        { key: '0', name: '', size: '', count: 1, unit: '', desc: '', price: 0 }
    ]);

    useImperativeHandle(ref, () => ({
        resetValues
    }));

    const resetValues = () => {
        setValues([
            {
                key: '0',
                name: '',
                size: '',
                count: 1,
                unit: '',
                desc: '',
                price: 0
            }
        ]);
    };

    const onInputChange = (index: number, newValue: ITemplate) => {
        const newValues = [...values];
        newValues[index] = newValue;
        setValues(newValues);

        onChange(newValues);
    };

    const onAddChildClick = () => {
        setUniqueKey(uniqueKey + 1);

        setValues([
            ...values,
            {
                key: uniqueKey.toString(),
                name: '',
                size: '',
                count: 1,
                unit: '',
                desc: '',
                price: 0
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
                key={value.key}
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
});
