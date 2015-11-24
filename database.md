#Database Architecture Overview
The main database for the bot is a redis database.  Its primary purpose is to store tick data and analysis data calculated from the ticks.  

#Indexed Sets
Much data is held in the form of indexed sets.  By this method, many pieces of related data can be stored together among multiple sets.  For more information on indexed sets, see readme.md in the folder db.  

##ticks_[asset] indexed set

As live ticks are recieved by the bot, they are stored in the indexed sets such as ticks_eurusd, ticks_audjpy, etc.  There are three columns for this sorted set: asks, bids, and timestamps  

##SMA Data
These objects contain data involving the recorded simple moving averages of incoming ticks.  They store all calculated averages until emptied.  

One indexed set exists per symbol for all SMA data stored.  The name of the indexed set is sma_[asset], such as sma_eususd.  There are a variable number of columns in this set depending on the number of different periods on which averages are taken.  Columns are in the following format: data_[period] where period is the lookback period of the average as well as the column timestamps for timestamps.  

##SMA Derivative Data
This data is stored in an indexed set called sma_deriv_[asset].  This indexed set is simlar to others in that all data for an asset is stored in the same indexed set but with a variable number of columns for deriv data calculated on different SMA periods and calculation ranges.  

Timestamps are stored in the timestamp column and data is stored in columns named like the following: data_[period]_[range] where period is the period of the moving average used to make the calculations and range is how far back in seconds the past timestamp used for deriv calculation was.  

#Other database objects
These are data structures stored in the database that aren't in the form of indexed sets.  They contain data such as algorithm states, bot commands, etc.

##backtests (set)
If a ticker is a member of this set, that means that a backtest is currently running for that ticker.  Before every time a tick from a backtest is sent, the backtester checks if it is still active in this set.  If it is not, the backtest is cancelled.  Also, a new backtest is not started if one is currently running for the same ticker.  