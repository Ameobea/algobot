#TODO  
- Fix memory leak in tick_generator
- Fix issue in tick_generator that crashes tick_generator when switching to a new flatfile data source.
  /home/ubuntu/bot/tick_generator/helpers/util.js:128
      client.zadd('tick_timestamps_'+pair,chunkResult[curIndex][0],index,functio
                                                               ^
  TypeError: Cannot read property '0' of undefined
      at Command.callback (/home/ubuntu/bot/tick_generator/helpers/util.js:128:62)
      at RedisClient.return_reply (/home/ubuntu/bot/tick_generator/node_modules/redis/index.js:606:25)
      at /home/ubuntu/bot/tick_generator/node_modules/redis/index.js:309:18
      at process._tickCallback (node.js:448:13)
  ubuntu@ip-172-30-0-159:~/bot/tick_generator$
- Merge some small modules together?
- Remove the express requirements from some modules that have no need or web interfaces.   
- Convert the ghetto sorting happening on line ~31 of algo_core/helpers/util.js to alex's pretty way.