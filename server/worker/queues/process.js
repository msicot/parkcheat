const { onBoardNewuser } = require('../tasks/Session/processor');

const {onBoardNewUserQueue} = require('index');

const logger = require("morgan");

const handleFailure = (job, err) => {
    if (job.attemptsMade >= job.opts.attempts) {
      logger.info(
        `Job failures above threshold in ${job.queue.name} for: ${JSON.stringify(
          job.data
        )}`,
        err
      );
      job.remove();
      return null;
    }
    logger.info(
      `Job in ${job.queue.name} failed for: ${JSON.stringify(job.data)} with ${
        err.message
      }. ${job.opts.attempts - job.attemptsMade} attempts left`
    );
  };

  const handleCompleted = job => {
    logger.info(
      `Job in ${job.queue.name} completed for: ${JSON.stringify(job.data)}`
    );
    job.remove();
  };
  
  const handleStalled = job => {
    logger.info(
      `Job in ${job.queue.name} stalled for: ${JSON.stringify(job.data)}`
    );
  };

  const activeQueues = [
      {
          queue: onBoardNewUserQueue,
          processor: onBoardNewuser
      }
  ];


  activeQueues.forEach(handler => {
    const queue = handler.queue;
    const processor = handler.processor;
    const failHandler = handler.failHandler || handleFailure;
    const completedHandler = handler.completedHandler || handleCompleted;

    queue.on("failed", failHandler);
    queue.on("completed", completedHandler);
    queue.on("stalled", handleStalled);
    queue.process(processor);// link the correspondant processor/worker
  
    logger.info(`Processing ${queue.name}...`);
  })