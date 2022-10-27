'use strict';

const Hapi = require('@hapi/hapi');
const nodemailer = require('nodemailer');

const tableData = [
  ['姓名', '', '项目名称', '', '工作日期', [new Date().toLocaleDateString()]],
  ['甲方直属领导', '', '工作模式', '', '合计办公时长', '8h'],
  ['工作内容', ''],
];
const tableStyle = `border-spacing: 0;
        border-top: 1px solid black;
        border-left: 1px solid black;`;

const firstRowTdStyle = `border-right: 1px solid black;
            border-bottom: 1px solid black;
            width: 100px;`;

const otherRowTdStyle = `border-right: 1px solid black; border-bottom: 1px solid black`;

const getHtml = (data) => {
  const curTableData = JSON.parse(JSON.stringify(tableData));
  const { basic, project, report } = data;
  curTableData[0][1] = basic.user;
  curTableData[0][3] = project.name;
  curTableData[1][1] = project.leader;
  curTableData[1][3] = project.mode;

  let tableHtml = `<table style='${tableStyle}'>`;
  // first row;
  tableHtml += '<tr>';
  for (let item of curTableData[0]) {
    tableHtml += `<td style='${firstRowTdStyle}'>${item}</td>`;
  }
  tableHtml += '</tr>';
  // second row;
  tableHtml += '<tr>';
  for (let item of curTableData[1]) {
    tableHtml += `<td style='${otherRowTdStyle}'>${item}</td>`;
  }
  tableHtml += '</tr>';
  // third row;
  tableHtml += '<tr>';
  tableHtml += `<td style='${otherRowTdStyle}'>${curTableData[2][0]}</td>`;
  tableHtml += `<td colspan='5' style='${otherRowTdStyle}'>${report.content}</td>`;
  tableHtml += '</tr>';

  return tableHtml;
};

const server = Hapi.server({
  port: 5000,
  host: 'localhost',
});

server.route({
  method: ['POST'],
  path: '/api/sendEmail',
  handler: (request) => {
    const html = getHtml(request.payload);
    return sendEmailController(request.payload.basic, html);
  },
});

const sendEmailController = (basic, html) => {
  let result = true;
  const transport = nodemailer.createTransport({
    host: 'stmp.qq.com',
    service: 'qq',
    port: 587,
    secure: false,
    auth: {
      user: '2295790516@qq.com',
      pass: 'zbwpqoxvveqwebii',
    },
  });
  const subject = `${new Date().toLocaleDateString()}-${basic.user}-日报`;
  const mailOptions = {
    from: basic.from,
    to: basic.to,
    subject,
    html,
  };
  transport.sendMail(mailOptions, (err, response) => {
    'use strict';
    if (err) {
      result = false;
      console.log('err: ', err);
    } else {
      console.log('sendEmail success');
    }
    transport.close();
  });
  return result;
};

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
