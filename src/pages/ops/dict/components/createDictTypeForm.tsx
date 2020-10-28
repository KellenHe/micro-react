import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { DictType } from '../../data';

export interface FormValueType extends Partial<DictType> { }

interface CreateFormPorps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  values: Partial<DictType>;
  isUpdate: boolean;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  wrapperCol: { offset: 20, span: 4 },
};

const CreateDictTypeForm: React.FC<CreateFormPorps> = (props) => {
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
      title={isUpdate ? '编辑字典类型' : '新建字典类型'}
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
        <Form.Item
          name='typeCode'
          label='字典类型编码'
          rules={[{ required: true, message: '请输入字典类型编码！' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='typeName'
          label='字典类型名称'
          rules={[{ required: true, message: '请输入字典类型名称' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='typeDesc'
          label='字典类型描述'
          rules={[{ required: true, message: '请输入字典类型描述' }]}
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

export default CreateDictTypeForm;
