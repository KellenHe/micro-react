import React, { useState } from 'react';
import { Tree } from 'antd';

interface FormTreeComponentProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  treeData: API.TreeData[];
}

const FormTree: React.FC<FormTreeComponentProps> = ({ value, onChange, treeData }) => {
  const [checkedKeys, setCheckedKeys] = useState<string[]>(value || []);

  const onCheck = (checked: any, e: any) => {
    console.log('onCheck', checked);
    setCheckedKeys(checked);
    if (onChange) {
      onChange(checked);
    }
  };

  return (
    <Tree
      checkable
      onCheck={(checked, e) => onCheck(checked, e)}
      checkedKeys={checkedKeys}
      treeData={treeData}
    />
  );
};

export default FormTree;
