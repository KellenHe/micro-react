import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Form, Radio, Select, Input, TreeSelect, Button, message } from 'antd';
import { useRequest } from 'umi';
import { queryDataRuleList } from '../../services';

const FormItem = Form.Item;

interface DataRuleComponentProps {
  values?: any[];
  onSave?: (value: any[]) => void;
  dataType: any[];
  dataRuleExpress: any[];
  actionRef?: any;
}

const DataRule: React.FC<DataRuleComponentProps> = ({ values, onSave, dataType, dataRuleExpress, actionRef }) => {
  const [formVals, setFormVals] = useState<any>(values ? { ...values[0], type: values[0]?.authorityDataTyped } : {});
  const [submitVals, setSubmitVals] = useState<any[]>(values || []);
  const [ruleList, setRuleList] = useState<any[]>([]);
  const [currentDataRule, setCurrentDataRule] = useState<any>({});
  const [dataRule, setDataRule] = useState<any[]>([]);
  const [form] = Form.useForm();

  useImperativeHandle(actionRef, () => ({
    checkAndSave: async () => {
      const fieldsValue = await form.validateFields();
      saveFieldsValue(fieldsValue);
      return submitVals;
    }
  }));

  const { loading, run } = useRequest(queryDataRuleList, {
    manual: true,
    onSuccess: (result) => {
      if (result && result.length > 0) {
        setDataRule(result);
        const rules = result.map((rule: any) => {
          return {
            label: rule.columnDisplayName,
            value: rule.id
          };
        });
        setRuleList(rules);
        const authorityConfigId = form.getFieldValue('authorityConfigId');
        const currentRule = result.find((rule: any) => rule.id === authorityConfigId);
        setCurrentDataRule(currentRule);
      }
    },
  });

  useEffect(() => {
    if (values && values[0] && values[0].authorityDataTyped) {
      run(values[0].authorityDataTyped);
    }
  }, []);

  const onDataTypeChange = async (value: any) => {
    if (form.getFieldValue('authorityConfigId')) {
      form.validateFields()
      .then(fieldsValue => {
        saveFieldsValue(fieldsValue);
        setFieldsValue(value.target.value);
        form.setFieldsValue({ authorityDataTyped: form.getFieldValue('type') });
        run(value.target.value);
      })
      .catch(errorInfo => {
        form.setFieldsValue({ type: form.getFieldValue('authorityDataTyped') });
      });
    } else {
      form.setFieldsValue({ authorityDataTyped: form.getFieldValue('type') });
      run(value.target.value);
    }
  };

  const onDataRuleChange = (value: any) => {
    const currentRule = dataRule.find(rule => rule.id === value);
    setCurrentDataRule(currentRule);
  };

  /**
   * 保存表单数据到待提交列表
   * @param fieldsValue 表单数据
   */
  const saveFieldsValue = (fieldsValue: any) => {
    if (submitVals.some(val => val.authorityDataTyped === fieldsValue.authorityDataTyped)) {
      submitVals.forEach(val => {
        if (val.authorityDataTyped === fieldsValue.authorityDataTyped) {
          val.authorityConfigId = fieldsValue.authorityConfigId;
          val.ruleExpression = fieldsValue.ruleExpression;
          val.ruleValue = fieldsValue.ruleValue;
          val.treeValues = fieldsValue.treeValues;
        }
      });
    } else {
      submitVals.push(fieldsValue);
    }
    setSubmitVals(submitVals);
    if (onSave) {
      onSave(submitVals);
    }
  };

  const setFieldsValue = (typeStr: string) => {
    const currentFormVals = submitVals.find(val => val.authorityDataTyped === typeStr) || values?.find(val => val.authorityDataTyped === typeStr);
    form.setFieldsValue( currentFormVals ? { ...currentFormVals, type: typeStr } : {
      type: typeStr,
      authorityDataTyped: typeStr,
      authorityConfigId: '',
      ruleExpression: '',
      ruleValue: '',
      treeValues: [],
    });
  };

  const renderDataAuthority = () => {
    if (currentDataRule) {
      if (currentDataRule.frontColumnTyped === 'tree') {
        return (
          <>
            <FormItem
              name='ruleExpression'
              label='规则表达式'
              rules={[{ required: true, message: '请选择规则表达式！' }]}>
              <Select options={dataRuleExpress} />
            </FormItem>
            <FormItem
              name='treeValues'
              label='规则选值'
              rules={[{ required: true, message: '请选择规则值！' }]}>
              <TreeSelect
                multiple
                treeData={currentDataRule.data}
              />
            </FormItem>
          </>
        );
      }
      if (currentDataRule.frontColumnTyped === 'list') {
        return (
          <>
            <FormItem
              name='ruleExpression'
              label='规则表达式'
              rules={[{ required: true, message: '请选择规则表达式！' }]}>
              <Select options={dataRuleExpress} />
            </FormItem>
            <FormItem
              name='treeValues'
              label='规则选值'
              rules={[{ required: true, message: '请选择规则值' }]}>
              <Select mode='multiple'>
                {currentDataRule.data.map((element: any) => (
                  <Select.Option value={element.key}>{element.titile}</Select.Option>
                ))}
              </Select>
            </FormItem>
          </>
        );
      }
      if (currentDataRule.frontColumnTyped === 'text') {
        return (
          <>
            <FormItem
              name='ruleExpression'
              label='规则表达式'
              rules={[{ required: true, message: '请选择规则表达式' }]}>
              <Select options={dataRuleExpress} />
            </FormItem>
            <FormItem
              name='ruleValue'
              label='规则值'
              rules={[{ required: true, message: '请输入规则值' }]}>
              <Input />
            </FormItem>
          </>
        );
      }
    }
    return (
      <></>
    );
  };

  return (
    <>
      <Form
        form={form}
        initialValues={{ ...formVals }}
      >
        <FormItem
          name='type'
          label='权限类型'
          rules={[{ required: true, message: '请选择权限类型！' }]}>
          <Radio.Group options={dataType} optionType='button' onChange={onDataTypeChange}/>
        </FormItem>
        <FormItem
          name='authorityDataTyped'
          label='权限类型'
          hidden>
          <Radio.Group options={dataType} optionType='button'/>
        </FormItem>
        <FormItem
          name='authorityConfigId'
          label='数据规则'
          rules={[{ required: true, message: '请选择数据规则！' }]}>
          <Select options={ruleList} loading={loading} onChange={onDataRuleChange}/>
        </FormItem>
        {renderDataAuthority()}
      </Form>
    </>
  );
};

export default DataRule;
