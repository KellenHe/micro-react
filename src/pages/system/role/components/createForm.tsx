import React, { useState, useRef } from 'react';
import { Modal, Steps, Form, Button, Input, Select } from 'antd';
import { RoleTableListItem } from '../../data';
import { useRequest } from 'umi';
import { queryMenuList } from '../../services';
import FormTree from './formTree';
import DataRule from './dataRule';

const { Step } = Steps;
const { TextArea } = Input;
const FormItem = Form.Item;

export interface FormValueType extends Partial<RoleTableListItem> {}

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  values: FormValueType;
  isUpdate: boolean;
  roleType: any[];
  dataType: any[];
  dataRuleExpress: any[];
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    id: props.values.id,
    roleName: props.values.roleName,
    roleDesc: props.values.roleDesc,
  });
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [form] = Form.useForm();
  const dataRuleRef = useRef<any>();

  const {
    modalVisible,
    onSubmit: handleUpdate,
    onCancel,
    isUpdate,
    values,
    roleType,
    dataType,
    dataRuleExpress
  } = props;

  const { data } = useRequest(() => {
    return queryMenuList({});
  });

  const forward = () => setCurrentStep(currentStep + 1);

  const backward = () => setCurrentStep(currentStep - 1);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();

    setFormVals({ ...formVals, ...fieldsValue });

    if (currentStep < 2) {
      forward();
    } else {
      let rules;
      if (dataRuleRef.current) {
        rules = await dataRuleRef.current.checkAndSave();
      }
      handleUpdate({ ...{ ...formVals, ruleDtos: rules}, ...fieldsValue, id: values.id });
    }
  };

  const dataRuleSave = (value: any[]) => {
    setFormVals({
      ...formVals,
      ruleDtos: value
    });
  };

  const renderForm = () => {
    if (currentStep === 2) {
      return (
        <DataRule dataType={dataType} dataRuleExpress={dataRuleExpress} values={values.rules} onSave={dataRuleSave} actionRef={dataRuleRef}/>
      );
    } else {
      return (
        <Form
          form={form}
          initialValues={{ ...values }}
        >
          {renderContent()}
        </Form>
      );
    }
  };

  const renderContent = () => {
    if (currentStep === 1) {
      return (
        <FormItem name='menuIds' label='菜单分配'>
          <FormTree treeData={data}/>
        </FormItem>
      );
    }
    return (
      <>
        <FormItem
          name='roleName'
          label='名称'
          rules={[{ required: true, message: '请输入角色名称！' }]}
        >
          <Input placeholder='请输入' />
        </FormItem>
        <FormItem
          name='roleTyped'
          label='类型'
          rules={[{ required: true, message: '请输入角色名称！' }]}
        >
          <Select options={roleType} />
        </FormItem>
        <FormItem
          name='roleCode'
          label='编码'
          rules={[{ required: true, message: '请输入角色名称！' }]}
        >
          <Input placeholder='请输入' />
        </FormItem>
        <FormItem
          name='roleDesc'
          label='描述'
        >
          <TextArea rows={4} placeholder='请输入至少五个字符' />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    if (currentStep === 1) {
      return (
        <>
          <Button style={{ float: 'left' }} onClick={backward}>
            上一步
          </Button>
          <Button onClick={() => onCancel()}>取消</Button>
          <Button type='primary' onClick={() => handleNext()}>
            下一步
          </Button>
        </>
      );
    }
    if (currentStep === 2) {
      return (
        <>
          <Button style={{ float: 'left' }} onClick={backward}>
            上一步
          </Button>
          <Button onClick={() => onCancel()}>取消</Button>
          <Button type='primary' onClick={() => handleNext()}>
            完成
          </Button>
        </>
      );
    }
    return (
      <>
        <Button onClick={() => onCancel()}>取消</Button>
        <Button type='primary' onClick={() => handleNext()}>
          下一步
        </Button>
      </>
    );
  };

  return (
    <Modal
      destroyOnClose
      title={isUpdate ? '编辑角色' : '新建角色'}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={renderFooter()}
    >
      <Steps style={{ marginBottom: 28 }} size='small' current={currentStep}>
        <Step title='基本信息' />
        <Step title='功能权限' />
        <Step title='数据权限' />
      </Steps>
      {renderForm()}
    </Modal>
  );
};

export default CreateForm;
