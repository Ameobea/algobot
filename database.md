#Database Architecture
The main database for the bot is a redis database.  Its primary purpose is to store tick data and analysis data calculated from the ticks.  

#Keys
##tick_asks, tick_bids, and tick_timestamps (sorted sets)
- score = price, member = index

As live ticks are recieved by the bot, they are stored in the sorted sets.  Each ticker pair has one or several sorted sets that contain the raw tick data for the ask and bid prices as well as timestamps for each ticker.  These are stored with a score that is their index in that set.

They are currently stored in the format "tick_asks_symbol" and "tick_bids_symbol."  An example is tick_asks_audusd.  All pairs stored in the database are converted to lower case.  

##backtests (set)
If a ticker is a member of this set, that means that a backtest is currently running for that ticker.  Before every time a tick from a backtest is sent, the backtester checks if it is still active in this set.  If it is not, the backtest is cancelled.  Also, a new backtest is not started if one is currently running for the same ticker.  

##tickset_length_symbol
Each of these variables is the length of the current tick sets for the given symbol.  