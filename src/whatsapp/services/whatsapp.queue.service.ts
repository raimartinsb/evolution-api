import Queue from 'bull';

import { Bull, configService } from '../../config/env.config';

const queueOptions = {
  redis: {
    port: configService.get<Bull>('BULL').REDIS.PORT,
    host: configService.get<Bull>('BULL').REDIS.HOST,
    password: configService.get<Bull>('BULL').REDIS.PASSWORD,
  },
};

const queues = [{ bull: new Queue('init', queueOptions), name: 'init' }];

// Function to add a new queue to the list
function addQueue(name) {
  const newQueue = new Queue(name, queueOptions);
  queues.push({ bull: newQueue, name });
}

// Function to add a job to a specific queue
async function add(name, data) {
  const queue = await queues.find((q) => q.name === name);

  if (!queue) {
    throw new Error(`Queue with name "${name}" not found.`);
  }

  await queue.bull.add(data);
  return;
}

export default {
  queues,
  addQueue,
  add,
  // process() {
  //   return this.queues.forEach((queue) => {
  //     queue.bull.process(async (job) => {
  //       const { payload, database, settings } = job.data;
  //       waInstances[job.instance]?.getMessageHandle(payload, database, settings);
  //       return;
  //     });
  //   });
  // },
};
