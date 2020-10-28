import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { Dict } from '../../data';
import { useRequest } from 'umi';
import { queryDictByType } from '../../services';

export interface FormValueType extends Partial<Dict> { }

interface CreateFormPorps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  values: Partial<Dict>;
  isUpdate: boolean;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const tailLayout = {
  wrapperCol: { offset: 20, span: 4 },
};

const CreateDictForm: React.FC<CreateFormPorps> = (props) => {
  const [form] = Form.useForm();
  const {
    onSubmit: handleSubmit,
    onCancel,
    modalVisible,
    values,
    isUpdate,
  } = props;

  return (
    <Modal
      destroyOnClose
      title={isUpdate ? '编辑字典' : '新建字典'}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form
        form={form}
        {...layout}
        initialValues={{ ...values }}
        onFinish={(formValues) => handleSubmit({ ...formValues, id: values.id })}
      >
        {/* <Form.Item
          name='dictTyped'
          label='字典类型'
          rules={[{ required: true, message: '请输入字典类型！' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item> */}
        <Form.Item
          name='dictCode'
          label='字典编码'
          rules={[{ required: true, message: '请输入字典编码' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='dictName'
          label='字典名称'
          rules={[{ required: true, message: '请输入字典名称' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='dictDesc'
          label='字典描述'
          rules={[{ required: true, message: '请输入字典描述' }]}
        >
          <Input placeholder='请输入' />
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

export default CreateDictForm;
