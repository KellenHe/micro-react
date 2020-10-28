import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Row, Col, Spin, Tooltip } from 'antd';
import { useRequest } from 'umi';
import { queryDictByType, queryTaskDetail } from '../../services';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { TaskParams, TaskDetails, DictTypeItem } from '../../data';

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  values: any;
  isUpdate: boolean;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 20, span: 4 },
};

/**
 * 接口数据结构转换为form表单展示数据结构
 * @param data detailData
 */
const taskGroupToTable = (data: TaskDetails) => {
  const formValues: any = {...data};
  const paramList: TaskParams[] = formValues.paramList;
  const params: any[] = [];
  for (const element of paramList) {
    if (element.groupId === 0){
      formValues[element.jobKey] = element.jobValue;
    }else{
      if (params[element.groupId - 1]){
        params[element.groupId - 1][element.jobKey] = element.jobValue;
      }else{
        params[element.groupId - 1] = {
          [element.jobKey]: element.jobValue
        };
      }
    }
  }
  formValues.params = params;
  return formValues;
};

/**
 * form表单展示数据结构转换为接口数据结构
 * @param formValues form表单数据
 * @param typeParams 任务类型
 */
const taskTableToGroup = (formValues: any, typeParams: DictTypeItem[]) => {
  const params = {...formValues};
  const paramList: TaskParams[] = [];
  for (const type of typeParams) {
    paramList.push({
      jobKey: type.value,
      jobValue: params[type.value],
      groupId: 0
    });
    delete params[type.value];
  }

  if (params.params && params.params.length > 0){
    for (let i = 0; i < params.params.length; i++){
      const oneData = params.params[i];
      for (const type of typeParams) {
        paramList.push({
          jobKey: type.value,
          jobValue: oneData[type.value],
          groupId: i + 1
        });
      }
    }
  }

  params.params = paramList;
  return params;
};

const cornTooltip = (
  <span>
    每隔5秒执行：*/5 * * * * ?<br/>
    每隔1分钟执行：0 */1 * * * ?<br/>
    每天23点执行：0 0 23 * * ?<br/>
    每天凌晨1点执行：0 0 1 * * ?<br/>
    每月月初凌晨1点执行：0 0 1 1 * ?<br/>
    每月月末23点执行：0 0 23 L * ?<br/>
    每周日凌晨1点实行：0 0 1 ? * L<br/>
    {/* 在26分、29分、33分执行：0 26,29,33 * * * ?<br/>
    每天的0点、13点、18点、21点都执行：0 0 0,13,18,21 * * ?<br/> */}
  </span>
);

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    modalVisible,
    values,
    isUpdate
  } = props;

  // 缓存params数据
  const [detailParams, handleDetailParams] = useState<TaskParams[]>([]);

  const [typeSelected, handleTypeSelected] = useState<string>('');
  const [typeParams, handleTypeParams] = useState<DictTypeItem[]>([]);
  const [form] = Form.useForm();


  const { data: jobType, loading: typeLoading } = useRequest(() => {
    return queryDictByType('job_type');
  });

  const { loading: detailLoading } = useRequest(() => {
    return queryTaskDetail(values.id);
  }, {
    ready: !!isUpdate,
    formatResult: (res: any) => {
      let { data } = res;
      data = taskGroupToTable(data);
      return data;
    },
    onSuccess: (data) => {
      form.setFieldsValue(data);
      handleDetailParams([...data.params]);
    }
  });

  const { loading: paramLoading } = useRequest(() => {
    return queryDictByType('job_' + values.jobTyped + '_type');
  }, {
    ready: !!isUpdate,
    onSuccess: (data) => {
      handleTypeSelected(values.jobTyped);
      handleTypeParams(data);
    }
  });

  const { run: queryTypeParams } = useRequest((value) => {
    return queryDictByType('job_' + value + '_type');
  }, {
    manual: true,
    cacheKey: 'typeParams'
  });

  const onTypeSelected = async (value: string) => {
    handleTypeSelected(value);
    if (values.jobTyped === value){
      form.setFieldsValue({params: [...detailParams]});
    }else{
      form.setFieldsValue({params: []});
    }
    const data = await queryTypeParams(value);
    if (data) {
      handleTypeParams(data);
    }
  };

  // 根据不同任务类型 循环生成不同的formItem (目前后端数据结构不完全，后续需要更多匹配修改)
  // tslint:disable-next-line: no-shadowed-variable
  const FormRender = (props: any) => {
    const params: any[] = props.params;
    return (
      <Row gutter={[16, 24]}>
        {params.map((param, index) => {
          if (param.label.indexOf('参数') > -1){
            return (
              <Col span={12} key={index}>
                <Form.Item style={{marginBottom: '12px'}}
                  label={param.label}
                  name={param.value}
                >
                  <Input.TextArea placeholder={param.label} rows={1}/>
                </Form.Item>
              </Col>
            );
          }else{
            return (
              <Col span={12} key={index}>
                <Form.Item style={{marginBottom: '12px'}}
                  label={param.label}
                  name={param.value}
                  rules={[{ required: param.label.indexOf('token') > -1 ? false : true, message: '请填写' + param.label }]}
                >
                  <Input placeholder={param.label} />
                </Form.Item>
              </Col>
            );
          }
        })}
        <Col span={24}>
          <Form.List name='params'>
            {(fields, { add, remove }) => {
              return (
                <Row gutter={[16, 24]}>
                  <Col span={4}>
                  </Col>

                  <Col span={16}>
                    <Button
                      type='dashed'
                      onClick={() => {
                        add();
                      }}
                      block
                    >
                      <PlusOutlined />添加子任务
                    </Button>
                  </Col>

                  <Col span={4}>
                  </Col>
                  <Col span={24}>
                    {fields.map(field => (
                      <Row gutter={[16, 24]} key={field.key} style={{margin: 0}}>
                        {params.map((param, index) => {
                          if (param.label.indexOf('参数') > -1){
                            return (
                              <Col span={12} key={index}>
                                <Form.Item style={{marginBottom: '12px'}}
                                {...field}
                                label={param.label}
                                name={[field.fieldKey, param.value]}
                                fieldKey={[field.fieldKey, param.value]}
                              >
                                <Input.TextArea placeholder={param.label} rows={1}/>
                              </Form.Item>
                            </Col>
                            );
                          }else{
                            return (
                              <Col span={12} key={index}>
                                <Form.Item style={{marginBottom: '12px'}}
                                  {...field}
                                  label={param.label}
                                  name={[field.fieldKey, param.value]}
                                  fieldKey={[field.fieldKey, param.value]}
                                  rules={[{ required: param.label.indexOf('token') > -1 ? false : true, message: '请填写' + param.label }]}
                                >
                                  <Input placeholder={param.label} />
                                </Form.Item>
                              </Col>
                            );
                          }
                        })}

                        <Col span={20}>
                        </Col>

                        <Col span={4}>
                          <Button
                            onClick={() => {
                              remove(field.name);
                            }}
                            block
                          >
                            删除
                          </Button>
                        </Col>
                      </Row>
                    ))}
                  </Col>
                </Row>
              );
            }}
          </Form.List>
        </Col>
      </Row>
      );
  };

  if (typeLoading && detailLoading && paramLoading) {
    return (
      <div style={{textAlign: 'center'}}>
        <Spin />
      </div>
    );
  }

  return (
    <Modal
      destroyOnClose
      title={isUpdate ? '修改任务' : '新建任务'}
      visible={modalVisible}
      onCancel={() => handleUpdateModalVisible()}
      footer={null}
      width={800}
    >
      <Form
        name='basic'
        {...layout}
        form={form}
        initialValues={{...values}}
        onFinish={(formValues) => handleUpdate(taskTableToGroup({...formValues, id: values.id}, typeParams))}
        // labelAlign='left'
      >
        <Row gutter={[16, 24]}>
          <Col span={12}>
             <Form.Item style={{marginBottom: '12px'}}
              label='任务分组'
              name='jobGroup'
              rules={[{ required: true, message: '请输入任务分组!' }]}
            >
              <Input placeholder='任务分组'/>
            </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item style={{marginBottom: '12px'}}
              label='任务名称'
              name='jobName'
              rules={[{ required: true, message: '请输入任务名称!' }]}
            >
              <Input placeholder='任务名称'/>
            </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item style={{marginBottom: '12px'}}
              label={
                <span>
                  cron表达式&nbsp;
                  <Tooltip title={cornTooltip}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              name='jobCron'
            >
              <Input placeholder='0/7 * * * * ?'/>
            </Form.Item>
          </Col>
          <Col span={12}>
          </Col>
          <Col span={12}>
             <Form.Item style={{marginBottom: '12px'}}
              label='任务负责人'
              name='jobCharge'
            >
              <Input placeholder='任务负责人'/>
            </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item style={{marginBottom: '12px'}}
              label='告警邮箱'
              name='jobEmail'
              rules={[{ type: 'email', message: '请输入有效邮箱!' }]}
            >
              <Input placeholder='xxxx@cscs.com'/>
            </Form.Item>
          </Col>
          <Col span={12}>
             <Form.Item style={{marginBottom: '12px'}}
              label='调用方式'
              name='jobTyped'
              rules={[{ required: true, message: '请选择调用方式!' }]}
            >
              <Select options={jobType} onChange={onTypeSelected} />
            </Form.Item>
          </Col>
        </Row>
        { typeSelected === '' ?  null : <FormRender params={typeParams}></FormRender> }
        <Form.Item style={{marginBottom: '12px'}} {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            确定
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
