import React from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { AuthorityData } from '../../data';
import TextArea from 'antd/lib/input/TextArea';
import { useRequest } from 'umi';
import { queryDictByType } from '../../services';

export interface FormValueType extends Partial<AuthorityData> { }

interface CreateFormPorps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  values: Partial<AuthorityData>;
  isUpdate: boolean;
}

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  wrapperCol: { offset: 20, span: 4 },
};


const CreateForm: React.FC<CreateFormPorps> = (props) => {
  const [form] = Form.useForm();

  const {
    onSubmit: handleSubmit,
    onCancel,
    modalVisible,
    values,
    isUpdate,
  } = props;

  const { data: authorityData, loading: authorityLoading } = useRequest(() => {
    return queryDictByType('authority_data_type');
  });

  const { data: frontData, loading: frontLoading } = useRequest(() => {
    return queryDictByType('front_column_type');
  });


  if (authorityLoading) {
    return (
      <></>
    );
  }

  if (frontLoading) {
    return (
      <></>
    );
  }

  return (
    <Modal
      destroyOnClose
      title={isUpdate ? '编辑数据权限' : '新建数据权限'}
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
          name='authorityDataTyped'
          label='权限类型'
          rules={[{ required: true, message: '请输入数据权限类型！' }]}
        >
          <Select
            placeholder='请选择'
          >
            {authorityData.map((element: any) => (
              <Option value={element.value} key={element.value}>{element.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='tableName'
          label='表名称'
          rules={[{ required: true, message: '请输入表名称！' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='tableDisplayName'
          label='表展示名称'
          rules={[{ required: true, message: '请输入表展示名称！' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='columnName'
          label='字段名称'
          rules={[{ required: true, message: '请输入字段名称！' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='columnDisplayName'
          label='字段展示名称'
          rules={[{ required: true, message: '请输入字段展示名称！' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='frontColumnTyped'
          label='前端类型'
          rules={[{ required: true, message: '请输入前端字段类型！' }]}
        >
          <Select
            placeholder='请选择'
          >
            {frontData.map((element: any) => (
              <Option value={element.value} key={element.value}>{element.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='serviceClass'
          label='接口类'
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='serviceMethod'
          label='接口方法'
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='serviceParams'
          label='接口参数'
        >
          <TextArea placeholder='请输入' />
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
