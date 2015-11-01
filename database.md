#Database Architecture
The main database for the bot is a redis database.  Its primary purpose is to store tick data and analysis data calculated from the ticks.  

#Keys
##live_ticks (sorted set)
As live ticks are recieved by the bot, they are stored in the sorted set live_ticks.  

##backtests (set)
If a ticker is a member of this set, that means that a backtest is currently running for that ticker.  Before every time a tick from a backtest is sent, the backtester checks if it is still active in this set.  If it is not, the backtest is cancelled.  Also, a new backtest is not started if one is currently running for the same ticker.  