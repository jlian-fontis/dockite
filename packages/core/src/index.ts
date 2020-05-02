// We need to disable eslint ordering for this file since
// we require dotenv to load before everything else
/* eslint-disable import/order,import/first */
import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();

import { getConfig } from './config';
import { connect } from './database';
import { start } from './server';

getConfig();

const startTime = Date.now();

export default connect().then(() =>
  start().then(() => console.log('Time taken', Date.now() - startTime, 'seconds')),
);
