import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Row, Col, Space } from 'antd';
import { Access, useRequest } from 'umi';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 20, span: 4 },
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    modalVisible,
  } = props;

  return (
    <Modal
      destroyOnClose
      title={'新建流程'}
      visible={modalVisible}
      onCancel={() => handleUpdateModalVisible()}
      footer={null}
    >
      <Form
        name='basic'
        {...layout}
        form={form}
        // onFinish={(formValues) => handleUpdate({id: values.id, ...formValues})}
        onFinish={(formValues) => console.log(...formValues)}
        labelAlign='left'
      >
        <Row gutter={[16, 24]}>
          <Col span={12}>
             <Form.Item
              label='流程名称'
              name='flowName'
              rules={[{ required: true, message: '请输入流程名称!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item
              label='流程类型'
              name='flowTyped'
            >
              <Select>
                <Select.Option value='demo'>主体信评</Select.Option>
                <Select.Option value='demo'>债券信评</Select.Option>
                <Select.Option value='demo'>投资池新增</Select.Option>
                <Select.Option value='demo'>投资池编辑</Select.Option>
                <Select.Option value='demo'>投资池删除</Select.Option>
                <Select.Option value='demo'>限额新增</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item
              label='流程版本'
              name='flowVersion'
              rules={[{ required: true, message: '请输入流程版本!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
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
