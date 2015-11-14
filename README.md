# algobot
Algorithmic trading platform

The bot consists of several interconnected modules that work together to analyze and respond to live price data and execute trades.  It is designed to be completely asynchronous and modular so that it can be runover multiple cores and servers.  

##Module Architecture
Live tick data source/simulated live tick data source -> tick_generator -> redis pubsub

From the redis pubsub system, the data is processed by the tick_database which both stores incoming ticks as well as performing calculations offloaded by other modules.  Depending on the needs of the other modules, it will either act as an interface to the actual redis database through with the other modules can request data or transmit it over the redis pubsub as soon as it's calculated.  I'm leaning towards the second, as this allows it to output the data faster.  

##Data flow
Data is shared between the modules through redis pubsubs that link all of the modules together.  The socket server is hosted by the tick_generator module (possibly changed later) which has the job of providing raw, live tick data to the other modules.  

For now, the plan is that all data share one redis pubsub and be broadcast to all modules, but this may be changed in the future to improve performance.  Using that method, data could either be requested by one module and fufilled by another or broadcast out as soon as it is avaliable (See section above)

# Bootup Procedure
//Script this in the future.  

1. node app.js in tick_generator //This NEEDS to be started first, as it hosts the redis pubsub server(s) to which all the other modules connect.  Possibly change this in the future.  
2. node app.js in tick_database //Must be started before other modules as other modules need it.
3. node app.js in algo_core
4. node app.js in trade_exec
5. node app.js in monitor //In the future, have this always running/started first as it will have functions to boot/shut down the bot from the web console.  

#tick_data
The data from the tick_data folder can be directly downloaded from the following link:
https://drive.google.com/open?id=0Bw3Lu3S0XCdOWU9oN2tEYjJ2TFE

The final, fully processed state of the tick data is in the form of many split files in csv format each containing a set amount (50,000) rows of data.  The csvs have the following format: 
timestamp, ask, bid, askvol, bidvol

They are named PAIR_n.csv where PAIR is the currency pair whose data is stored in that file.  These data files are organized into folders named for the currency pairs inside the tick_data folder.  The timestamps of the data stored in the tick files get progressively higher, so the files are essentially in chronological order.  This is important, as the data is played back in order to the tick generator during backtesting.  

There is a file called index.csv which keeps track of what data is in what csv files.  All dates are in unix timestamp format, or seconds since the epoch.  

##Downloading new tick data
The process of acquiring new tick data has many steps.  They must be followed carefully as to avoid saving incorrect or incomplete data.  

1. To begin, download the folder called download_downloader.  
2. Open main.html in a web browser.  Use the javascript console to run the function
3. Install the chrome extension allow-control-allow-origin and enable it so that chrome will let the script download files.
4. Run the function downloadUtils.batch(ticker, startYear, startMonth, startDay, startHour) and the script will begin downloading the data from dukascopy.  Months are 0-11, days are 1-31, and hours are 0-23.  The script will continue running until it reaches the end of the data.  
5. Sort all downloaded lzma files into folders separated by their ticker symbol.  
6. Use 7zip to extract all of the lzma files.  
7. Delete the lzma files. 
8. Edit extract.py and change all lines that have a currency pair in them to have the correct currency pair that you're converting and have the correct file paths for input and output data. 
9. Process the extracted files using the python script called extract.py.  (extract2.py is included since my server had two cores and python is single-threaded).   
9. Use the Linux command "sort -n infile.csv > outfile.csv" to sort the csv in chronological order.  
10. Edit chunker.py to update the currency pair and any file paths necessary.  
11. Use the chunker.py script to split the huge csv into smaller csvs and create an index of what data is contained in each of them.
  
The result of this should be a folder containing many csv files and a file called index.csv.  This is the format the data needs to be in for use by tick_generator during backtesting.  

In the future, this may be read into a master tick history database and stored somewhere, but for now all it's used for is backtesting.  

#algo_core
This module processes raw data from the sub-algos to produce data such as buy/sell signals, success probabilities, and risk/reward figures.  Its main goal is to combine the raw data from each of the submodules and determine what it means in terms of making a trade.  

It reads data in from all the submodules passively or actively, possibly making queries to subalgos when a specific piece of data is needed.  

All calculations and assertions it produces are output to trade_exec, where they are used to determine trades.  Data may be as simple as a buy/sell rating or as complicated as max risk%, expected return%, chance of success, and other specific figures.  

#tick_database
This module has two functions.  First, it records live ticks as they come in and writes them to a database for storage/archival.  At the same time, it also performs various calculations on incoming data such as averages, technical indicators, etc.  

These calculations are saved to a redis database (preferrably hosted on the same machine) which stores actively used data until it is sent off.  The types of calculations it holds are determined by the needs of the subalgos.  

For live events that we've been waiting for like resistance breaks and average crosses (which can be configured by other subalgos), broadcast an event as soon as it happens.  For other things, such as moving averages over periods and dynamic data, listen for queries on the redis pubsub before sending.  

#monitor
The monitor module is used as a GUI and administrative dashboard to all of the bot's functionality.  It will have monitoring of live market conditions as well as control functions for doing everything necessary with controlling the bot.  

* Monitoring:
- Status checks for all the algo modules.  
- Live price feeds
- Live algo data such as SMA cross tracking, trade ratings, etc.
* Administration:
- Emergency stop button
- Config for all configurable algorithm settings

#trade_exec
This module interfaces with the broker API to execute trades.  It also serves to monitor open trades and other data from the broker.  It determines the size, quantity, and time to execute trades.  

It acts on data output from algo_core, which consists of buy/sell signals, profit % and success %, and any other data output.  It then decides whether or not to trade and if so in what way.  

This also incorporates whatever kind of trading strategy (5% portfolio max, martingale, stop/limit/take profi, etc.) into the trades that it makes.  

#Additional Reference
See the file "apr_ref.txt"
