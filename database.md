#Database Architecture
The main database for the bot is a redis database.  Its primary purpose is to store tick data and analysis data calculated from the ticks.  

Much data is held in the form of indexed sets.  By this method, many pieces of related data can be stored together among multiple sets.  For example, for each timestamp there is an ask and a bid price.  Thus, three sorted sets are used to represent the data:

- the timestamp set, which has members equal to the indexes (increasing numerically as the length of the set increases) and scores equal to the timestamp of each index.  
- the ask set, which has members equal to the indexes and scores equal to the ask price at the timestamp that share the same index
- the bid set, which has members equal to the indexes and scores equal to the bid price at the timestamp that share the same index

This same structure can be used for many different kinds of data that would normally be stored in columns.  Basically, each column in a traditional SQL table or similar would be represented in a unique sorted set that contains both the index and that data from that column.  

#Keys
##tick_asks, tick_bids, and tick_timestamps (sorted sets)
- score = price, member = index

As live ticks are recieved by the bot, they are stored in the sorted sets.  Each ticker pair has one or several sorted sets that contain the raw tick data for the ask and bid prices as well as timestamps for each ticker.  These are stored with a score that is their index in that set.

They are currently stored in the format "tick_asks_symbol" and "tick_bids_symbol."  An example is tick_asks_audusd.  All pairs stored in the database are converted to lower case.  

##backtests (set)
If a ticker is a member of this set, that means that a backtest is currently running for that ticker.  Before every time a tick from a backtest is sent, the backtester checks if it is still active in this set.  If it is not, the backtest is cancelled.  Also, a new backtest is not started if one is currently running for the same ticker.   

##SMA Data
These objects contain data involving the recorded simple moving averages of incoming ticks.  They store all calculated averages until emptied.  There are two sorted sets that contain the data: sma_timestamps_* which contains the timestamps that correspond to the averages, and sma_data_* which contain the actual sma data.  The indexes of the sets with the same names correspond.

For now, SMA deriv data is stored * 100,000,000 to avoid it getting stored as 2*11000000000e-7 or similar.

###sma_timestamps_[symbol] (sorted set)
- score = timestamp, member = index

This set contains data about the timestamps of recorded SMA history for different symbols.  All time frames share the same timestamp index array.  It contains a sorted set of all the timestamps which contain data for the corresponding sma_data objects.  

###sma_data_[symbol]_[period] (sorted set)
- score = price, member = index

These sets contain the actual SMA values for the timestamps of the corresponding indexes in the corresponding timestamp array.  So index 15 of sma_data_* has the timestamp found in index 15 of sma_timestamps_*.  

##SMA Derivative Data
These contain the slopes between different lines of the ticks.  They can be used to determine the directions of trends over different time periods.  

It is important to make sure that the correct average lines for each period are used.  

###sma_deriv_data_[symbol]_[ma_period]_[lookback_period] (sorted set)
- score = sma deriv, member = index

These sets contain the slope of the line between the provided timestamp and points in the past for that function.  

###sma_deriv_timestamp_[symbol] (sorted set)
- score = timestamp, member = index