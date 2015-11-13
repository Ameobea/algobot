#Database Architecture
The main database for the bot is a redis database.  Its primary purpose is to store tick data and analysis data calculated from the ticks.  

#Keys
##tick_asks, tick_bids, and tick_timestamps (sorted sets)
- score = price, member = index

As live ticks are recieved by the bot, they are stored in the sorted sets.  Each ticker pair has one or several sorted sets that contain the raw tick data for the ask and bid prices as well as timestamps for each ticker.  These are stored with a score that is their index in that set.

They are currently stored in the format "tick_asks_symbol" and "tick_bids_symbol."  An example is tick_asks_audusd.  All pairs stored in the database are converted to lower case.  

##backtests (set)
If a ticker is a member of this set, that means that a backtest is currently running for that ticker.  Before every time a tick from a backtest is sent, the backtester checks if it is still active in this set.  If it is not, the backtest is cancelled.  Also, a new backtest is not started if one is currently running for the same ticker.   

##SMA Data
These objects contain data involving the recorded simple moving averages of incoming ticks.  They store all calculated averages until emptied.  There are two sorted sets that contain the data: sma_timestamps_* which contains the timestamps that correspond to the averages, and sma_data_* which contain the actual sma data.  The indexes of the sets with the same names correspond.  There are also length counters for each of the set pairs that shows the lengths of those sets.

###sma_timestamps_[symbol]_[period] (sorted set)
These sets contain data about the timestamps of recorded SMA history for different symbols on different time frames.  They contain a sorted set of all the timestamps which contain data for the corresponding sma_data object.  

###sma_data_[symbol]_[period] (sorted set)
These sets contain the actual SMA values for the timestamps of the corresponding indexes in the corresponding timestamp array.  So index 15 of sma_data_* has the timestamp found in index 15 of sma_timestamps_*.  

##SMA Derivative Data
###sma_deriv_[symbol]_[period] (sorted set)