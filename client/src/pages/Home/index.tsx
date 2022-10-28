// tslint: disabled
import { useEffect, useState } from 'react';
import { useRequest } from 'ice';
import { useLocalStorageState } from 'ahooks';
import { Form, Input, Button, Divider, notification } from 'antd';
import ReactQuill from 'react-quill';
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
  const [content, setContent] = useState('');

  const [form] = Form.useForm();
  useEffect(() => {
    if (state) {
      form.setFieldsValue(state);
    }
  }, [state]);

  const onFinish = async (values) => {
    setState(values);
    const data = { ...values, report: { content } };
    const ret = await sendEmailReq(data);
    console.log('ret: ', ret);
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
        <Form.Item name={['basic', 'user']} label="发件人姓名" rules={requiredRule}>
          <Input placeholder="请输入姓名,用于生成邮件主题" />
        </Form.Item>
        <Form.Item name={['basic', 'from']} label="发件邮箱" rules={requiredRule}>
          <Input placeholder="只能用qq邮箱发邮件" />
        </Form.Item>
        <Form.Item
          tooltip="参考: https://service.mail.qq.com/cgi-bin/help?subtype=1&&no=1001256&&id=28"
          name={['basic', 'pass']}
          label="发件邮箱stmp授权码"
          rules={requiredRule}
        >
          <Input placeholder="请输入发件邮箱stmp授权码" />
        </Form.Item>
        <Form.Item name={['basic', 'to']} label="收件邮箱" rules={requiredRule}>
          <Input placeholder="请输入收件邮箱(若多个收件邮箱, 请用空格分隔)" />
        </Form.Item>
        <Form.Item name={['basic', 'cc']} label="抄送邮箱" rules={requiredRule}>
          <Input placeholder="请输入抄送邮箱(若多个抄送邮箱, 请用空格分隔)" />
        </Form.Item>
        <Divider>项目信息</Divider>
        <Form.Item name={['project', 'name']} label="项目名称" rules={requiredRule}>
          <Input placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item name={['project', 'leader']} label="甲方领导" rules={requiredRule}>
          <Input placeholder="请输入领导姓名" />
        </Form.Item>
        <Form.Item name={['project', 'mode']} label="工作模式" rules={requiredRule}>
          <Input placeholder="请输入工作模式(现场 或 远程)" />
        </Form.Item>
        <Divider>日报内容</Divider>
        <ReactQuill style={{ height: 200 }} theme="snow" value={content} onChange={setContent} />
        <Form.Item style={{ marginTop: 80 }}>
          <Button loading={loading} htmlType="submit" type="primary" block size="large">
            发送
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
