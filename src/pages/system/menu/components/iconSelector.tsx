import React, { useState } from 'react';
import { Popover, Input, Row, Col } from 'antd';
import Icon from '@ant-design/icons';
import { iconMap } from '@/shared/components/iconMap';

interface IconSelectorComponentProps {
  value?: string;
  onChange?: (value: string) => void;
}

const IconSelector: React.FC<IconSelectorComponentProps> = ({ value, onChange }) => {
  const [currentIcon, handleCurrentIcon] = useState<string>(value || 'search');
  const [iconVisible, handleIconVisible] = useState<boolean>(false);

  const selectedIcon = (iconStr: string) => {
    handleCurrentIcon(iconStr);
    handleIconVisible(false);
    triggerChange(iconStr);
  };

  const triggerChange = (value: string) => {
    if (onChange) {
      onChange(value);
    }
  };

  const iconContent = () => {
    return (
      <div>
        <Row>
          <Col span={8} className='point' onClick={() => selectedIcon('bell')}>
            {iconMap.bell} bell
          </Col>
          <Col span={8} className='point' onClick={() => selectedIcon('combination')}>
            {iconMap.combination} combination
          </Col>
          <Col span={8} className='point' onClick={() => selectedIcon('connect')}>
            {iconMap.connect} connect
          </Col>
        </Row>
        <Row>
          <Col span={8} className='point' onClick={() => selectedIcon('management')}>
            {iconMap.management} management
          </Col>
          <Col span={8} className='point' onClick={() => selectedIcon('home')}>
            {iconMap.home} home
          </Col>
          <Col span={8} className='point' onClick={() => selectedIcon('search')}>
            {iconMap.search} search
          </Col>
        </Row>
        <Row>
          <Col span={8} className='point' onClick={() => selectedIcon('graph')}>
            {iconMap.graph} graph
          </Col>
          <Col span={8} className='point' onClick={() => selectedIcon('user1')}>
            {iconMap.development} development
          </Col>
          <Col span={8} className='point' onClick={() => selectedIcon('quality')}>
            {iconMap.quality} quality
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Popover content={iconContent} overlayStyle={{width: 402}} trigger='click' placement='bottom' visible={iconVisible} onVisibleChange={handleIconVisible}>
      <Input
        type='text'
        value={value}
        readOnly
        placeholder='请选择图标'
        prefix={ iconMap[currentIcon] }
      />
    </Popover>
  );
};

export default IconSelector;
