import React, { useState } from 'react';
import { useRequest } from 'umi';
import { Modal, Form, Radio, Input, Row, Col, InputNumber, TreeSelect, Button } from 'antd';
import { queryDictByType } from '../../services';
import IconSelector from './iconSelector';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  values: any;
  menuList: any[];
}

const tailLayout = {
  wrapperCol: { offset: 20, span: 4 },
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();

  const { modalVisible, onCancel, menuList } = props;

  const {
    onSubmit: handleUpdate,
    values
  } = props;

  const { data } = useRequest(() => {
    return queryDictByType('authority_menu_type');
  });

  const menuDatas = [{
    key: -1,
    title: '顶部',
    children: menuList
  }];

  return (
    <Modal
      destroyOnClose
      title='新建规则'
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form
        name='menuForm'
        form={form}
        initialValues={{ ...values, parentId: values.parentId ? values.parentId : -1 }}
        onFinish={(formValues) => handleUpdate({ id: values.id, ...formValues, parentId: formValues.parentId !== -1 ? formValues.parentId : null })}
      >
        <Form.Item label='菜单类型' name='authorityMenuTyped'>
          {/* <Radio.Group options={data} optionType='button' /> */}
          <Radio.Group>
            <Radio.Button value='menu'>目录</Radio.Button>
            <Radio.Button value='panel'>面板</Radio.Button>
            <Radio.Button value='button'>按钮</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label='菜单图标' name='icon'>
          <IconSelector />
        </Form.Item>
        <Form.Item label='菜单标题' name='title'>
          <Input />
        </Form.Item>
        <Form.Item label='权限标识' name='menuCode'>
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='菜单排序' name='menuOrder'>
              <InputNumber min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='路由地址' name='link'>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label='上级目录' name='parentId'>
          <TreeSelect
            treeData={menuDatas}
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            确定
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
