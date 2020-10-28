import React from 'react';
import { Modal, Form, Input, TreeSelect, InputNumber, Button } from 'antd';
import { Departments } from '../../data';

export interface FormValueType extends Partial<Departments> {}

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  values: Partial<Departments>;
  isUpdate: boolean;
  treeDatas: API.TreeData[];
}

const tailLayout = {
  wrapperCol: { offset: 20, span: 4 },
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();

  const {
    onSubmit: handleSubmit,
    onCancel,
    modalVisible,
    values,
    isUpdate,
    treeDatas
  } = props;

  const depTreeData = [{
    title: '顶级部门',
    value: -1,
    key: -1,
    children: treeDatas
  }];

  return (
    <Modal
      destroyOnClose
      title={ isUpdate ? '编辑部门' : '新建部门' }
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form
        form={form}
        initialValues={{ ...values, parentId: values.parentId ? values.parentId : -1 }}
        onFinish={(formValues) => handleSubmit({ ...formValues, id: values.id, parentId: formValues.parentId === -1 ? null : formValues.parentId })}
      >
        <Form.Item
          name='departmentName'
          label='部门名称'
          rules={[{ required: true, message: '请输入部门名称！' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='departmentOrder'
          label='部门排序'
          rules={[{ required: true, message: '请选择部门排序' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name='parentId'
          label='上级部门'
          rules={[{ required: true, message: '请选择上级部门' }]}
        >
          <TreeSelect
            treeData={depTreeData}
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
