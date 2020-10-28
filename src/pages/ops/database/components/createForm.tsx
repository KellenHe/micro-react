import React, { useState } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import { Datatable } from '../../data';
import { testDatabase } from '../../services';
import { Access, useAccess } from 'umi';

export interface FormValueType extends Partial<Datatable> { }

interface CreateFormPorps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  values: Partial<Datatable>;
  isUpdate: boolean;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const tailLayout = {
  wrapperCol: { offset: 15, span: 9 },
};

const CreateForm: React.FC<CreateFormPorps> = (props) => {
  const access = useAccess();
  const [form] = Form.useForm();
  const [isConnectable, handleIsConnectable] = useState<boolean>(false);

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
      title={isUpdate ? '编辑数据库' : '新建数据库'}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form
        form={form}
        {...layout}
        initialValues={{ ...values }}
        onFinish={(formValues) => handleSubmit({ ...formValues, id: values.id })}
        onChange={() => handleIsConnectable(false)}
      >
        <Form.Item
          name='databaseName'
          label='名称'
          rules={[{ required: true, message: '请输入名称！' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='jdbcUrl'
          label='连接地址'
          rules={[{ required: true, message: '请输入连接地址' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='databaseClass'
          label='连接对象'
          rules={[{ required: true, message: '请输入连接对象' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='connectAccount'
          label='连接账号'
          rules={[{ required: true, message: '请输入连接账号' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='connectPassword'
          label='连接密码'
          rules={[{ required: true, message: '请输入连接密码' }]}
        >
          <Input.Password placeholder='请输入' autoComplete='new-password' />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Access accessible={access.canTestDatabase}>
            <Button onClick={async () => {
              form.validateFields()
                .then(async values => {
                  const hide = message.loading('正在测试');
                  handleIsConnectable(false);
                  try {
                    const { success, data } = await testDatabase({ ...values });
                    hide();
                    if (success && data) {
                      message.success('数据库连接正常！');
                      handleIsConnectable(true);
                    } else {
                      message.error('数据库连接失败！');
                    }
                    return true;
                  } catch (error) {
                    hide();
                    message.error('数据库连接失败！');
                    return false;
                  }
                })
                .catch(errorInfo => {
                  // console.log(errorInfo);
                });
            }}>测试连接</Button>
          </Access>
          <Button type='primary' htmlType='submit' disabled={!isConnectable}>
            确定
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
