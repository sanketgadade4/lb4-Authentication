// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-passport-login
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';

// const config = {
//   name: 'db',
//   connector: 'memory',
//   localStorage: '',
//   file: 'db.json'
// };

const config = {
  name: 'db',
  connector: 'postgresql',
  url: '',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'bfl@123',
  database: 'local_auth_db_jwt_new'
};

export class DbDataSource extends juggler.DataSource {
  static dataSourceName = 'db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.db', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
