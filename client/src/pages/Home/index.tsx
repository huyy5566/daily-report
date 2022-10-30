// tslint: disabled
import { useEffect, useState } from 'react';
import { useRequest } from 'ice';
import { useLocalStorageState } from 'ahooks';
import { Form, Input, DatePicker, Button, Divider, notification, Row, Col } from 'antd';
import ReactQuill from 'react-quill';
import moment from 'moment';
import 'react-quill/dist/quill.snow.css';
import services from './services';
import styles from './index.module.css';

const DailyReportKey = 'Daily_Report_Key';

const requiredRule = [
  {
    required: true,
    message: '请输入该项内容!',
  },
];

export default function Home() {
  const { loading, request: sendEmailReq } = useRequest(services.sendEmailApi);
  const [state, setState] = useLocalStorageState(DailyReportKey);

  const [form] = Form.useForm();
  useEffect(() => {
    if (state) {
      const formNewState: any = { ...state };
      formNewState.report = {
        date: moment(),
        hour: '8',
      };
      form.setFieldsValue(formNewState);
    }
  }, [state]);

  const onFinish = async (values) => {
    console.log('values: ', values);
    setState({
      basic: values.basic,
      project: values.project,
    });

    values.report.date = moment(values.date).format('YYYY/MM/DD');
    debugger;

    const ret = await sendEmailReq(values);
    if (ret.success) {
      notification.success({
        message: ret.message,
      });
    } else {
      notification.error({
        message: ret.message.response,
      });
    }
  };
  return (
    <div className={styles.container}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Divider>基本信息</Divider>
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item name={['basic', 'user']} label="发件人姓名" rules={requiredRule}>
              <Input placeholder="请输入姓名,用于生成邮件主题" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['basic', 'from']} label="发件QQ邮箱" rules={requiredRule}>
              <Input placeholder="只能用qq邮箱发邮件" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              tooltip="参考: https://service.mail.qq.com/cgi-bin/help?subtype=1&&no=1001256&&id=28"
              name={['basic', 'pass']}
              label="发件QQ邮箱stmp授权码"
              rules={requiredRule}
            >
              <Input placeholder="请输入发件邮箱stmp授权码" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item name={['basic', 'to']} label="收件邮箱" rules={requiredRule}>
              <Input placeholder="请输入收件邮箱(若多个收件邮箱, 请用空格分隔)" />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item name={['basic', 'cc']} label="抄送邮箱" rules={requiredRule}>
              <Input placeholder="请输入抄送邮箱(若多个抄送邮箱, 请用空格分隔, 建议也把自己的企业邮箱加上)" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item name={['project', 'name']} label="项目名称" rules={requiredRule}>
              <Input placeholder="请输入项目名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['project', 'leader']} label="甲方领导" rules={requiredRule}>
              <Input placeholder="请输入领导姓名" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['project', 'mode']} label="工作模式" rules={requiredRule}>
              <Input placeholder="请输入工作模式(现场 或 远程)" />
            </Form.Item>
          </Col>
        </Row>
        <Divider>日报信息</Divider>
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item name={['report', 'date']} label="日报日期" rules={requiredRule}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name={['report', 'hour']} label="工作时长" rules={requiredRule}>
              <Input placeholder="请输入工作时长(如: 8)" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={24}>
            <Form.Item name={['report', 'content']} label="工作内容" rules={requiredRule}>
              <ReactQuill style={{ height: 150 }} theme="snow" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ marginTop: 80 }}>
          <Button loading={loading} htmlType="submit" type="primary" block size="large">
            发送
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
