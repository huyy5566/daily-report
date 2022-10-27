// tslint: disabled

import { request } from 'ice';

export default {
  async sendEmailApi(data) {
    return await request({
      method: 'post',
      url: '/api/sendEmail',
      data,
    });
  },
};
