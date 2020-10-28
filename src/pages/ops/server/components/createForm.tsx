import React, { useState } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import { Server } from '../../data';
import { testServer } from '../../services';
import { Access, useAccess } from 'umi';

export interface FormValueType extends Partial<Server> { }

interface CreateFormPorps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  values: Partial<Server>;
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
      title={isUpdate ? '编辑服务器' : '新建服务器'}
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
          name='serverName'
          label='名称'
          rules={[{ required: true, message: '请输入名称！' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='connectIp'
          label='IP'
          rules={[{ required: true, message: '请输入IP！' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='connectPort'
          label='端口'
          rules={[{ required: true, message: '请输入端口！' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='connectAccount'
          label='账号'
          rules={[{ required: true, message: '请输入账号！' }]}
        >
          <Input placeholder='请输入' />
        </Form.Item>
        <Form.Item
          name='connectPassword'
          label='密码'
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password placeholder='请输入' autoComplete='new-password' />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Access accessible={access.canTestServer}>
            <Button onClick={async () => {
              form.validateFields()
                .then(async values => {
                  const hide = message.loading('正在测试');
                  handleIsConnectable(false);
                  try {
                    const { success, data } = await testServer({ ...values });
                    hide();
                    if (success && data) {
                      message.success('服务器连接正常！');
                      handleIsConnectable(true);
                    } else {
                      message.error('服务器连接失败！');
                    }
                    return true;
                  } catch (error) {
                    hide();
                    message.error('服务器连接失败！');
                    return false;
                  }
                })
                .catch(errors => {
                  console.log(errors);
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
