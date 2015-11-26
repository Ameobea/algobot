#Redis commands

##ZADD sset score member
- Adds member to sorted set sset with score score.

##ZREM sset member
- Removes member member from sorted set sset.

##ZRANGE sset index1 index2
- returns the members of a sorted set between index1 and index2.

##ZRANGEBYSCORE sset score1 score2
- Returns the members in a sorted set that have scores between the defined parameters. 
- Adding in a ( before the score will make it exclusive.  So ZRANGEBYSCORE sset (5 10 will return all elements with score >5 and <= 10.

##ZRANK sset member
- returns the index in a sorted set of the element.  

##ZREVRANK sset member
- returns the index in a sorted set of the element with the scores ordered from high to low.  

##ZSCORE sset member
- returns the score of a member of a sorted set.  

##ZCOUNT sset
- returns the number of members of a sorted set.

----

#Price move prediction !!IMPORTANT

To predict future price moves, one must look at the past.  By studying historic price moves and reactions to various market conditions, it is possible to make good predictions of what it will do in the future.  By combining this with an understanding the hidden forces that actually drives price moves, traders making trades, these guesses can be improved.  

##Market Conditions
In charts, it is easy to pick up on historic price trends by simply watching which direction the line goes.  There are three types of market conditions possible: Bull, Bear, and Range.  

In a bull market, the price goes from a lower price to a higher price.  In a bear market, the price goes from a high price to a low price.  In a range market, the price doesn't move significantly in either direction.  It is possible to make money off any of these market conditions as long as the current condition can be determined and stays the same over the duration of the trade.  

In almost all price moves, the direction of the price is not a straight line.  Moves consist of moves and corrections, where corrections are small reversals that move contrary to the trend.  For example, in a move from $50 to $60, the price may rise to $55, drop back down to $53, and then continue to $60.  The move from $55 to $53 is a correction.  

Corrections represent buying or selling opportunities.  If a clear bull trend exists and is expected to continue and the price drops, this represents a good buying opportunity.  

##Trends
Trends can be identified over many different time frames.  The trend over different periods of time can be different.  For example, a bear trend on a daily timeframe can be a small correction in a much larger, more gradual bull trend on the yearly time frame.  

*Analysis of larger time frames can be used to predict the direction of a price move at a pivot point - up or down.*  

----

#Overall Trading Strategy

There are many different strategies that exist for predicting and taking advantage of price moves to make money.  

##Trend Trades
Trend trades represent attempts to identify and follow bull/bear trends in prices.  Once a trend is identified, you simply long or short the direction that the trend is moving.  If the trend continues, the price will move in the specified direction resulting in profit.  

An important thing to watch for is false trends.  In order to make maximum profit, it is desirable to enter into a trend as soon as possible.  However, trends aren't necessarily real unti they've existed for a while.  Thus comes the problem; the more sure you are a trend exists, the longer it has existed, and so the more likely it is for it to break out/down.  

Trends can be identified using a variety of methods ranging from moving average crosses, pivot point analysis, and a plethora of other tools.  

----

Transcription of shit I wrote down during class:

- Manual input for artificial price triggers.  e.g. be able to put in sentiments based on world events and alerts of news-based price triggers.  

I want it to look at graphs and determine support/resistance lines, trends, and possible reversal points.  
I want monitor to draw those support/resistance lines on price graphs and any indicators it calculates
I want live probability figures and any other raw trade indicators the algos throw out for each monitored assset
I want daily trade history digests with profitability figures as well as a watchlist of assets that the bot is monitoring and what trades it will make when events happen
I want multiple log levels with logs that are saved, timestamped, and archived.  
I want live activity feeds that can be parsed into visualizations of the bot's activity
I want low-level database access visualizations
I want a SEXY dashboard showing every aspect of the bot's activity.  
I want a multi-tiered error-management system that checks data for issues, manages modules, and auto-corrects problems without causing the bot to shut down.  
I want to make sure NO trade gets executed without being 100% certain all data being used to determine it is sane and correct
I want error tolerance so that the bot won't crash because of a missed tick or late SMA calculation
I want regular backups of everything - database, config, logs, etc. and a restore system that makes it easy to reset
I want live notifications sent about problems, important events, etc.
I want it to look professional and work profesionally
I want this to actually make money.  

----

#Events to find and predict
These are price formations that are created by support/resistance lines.  When the price passes through a support line downward, this is called a breakdown.  If it passes through a resistance line up, this is called a breakout.  Generally, when a price does this, it represents a rather significant move.  

However, is must be known that support/resistance lines aren't real; they're just the effect of orders placed by other traders.  Because of this, it is very possible that what appears to be a support/resistance line is only an illusion.  Nothing is guarenteed - the goal is to create >50% guesses as to what the price will do.  If it's not possible to determine the direction of a move, the prediction of a move in either direction is also useful.  

###Isosceles triangle breakouts/breakdowns

Slant support/resistance lines of approx. inverse slope that intersect at a point in the future.  Tightening range until breakout/breakdown.

###Right triangle breakouts/breakdown

Formed by one horizontal line of support/resistance and one slant.  Tightening range until breakout/breakdown.  

##Channels

Channels are formed by two parralel lines of support and resistance going either upwards or downwards.  The price bounces off of the resistance at the top and the support at the bottom while trending downward in a larger time period.  It is possible to trade the bounces/pops or to simply follow the underlying trend.  

When the price stops following the pattern set forth in the channel, this marks a break of the channel and usually a resulting price move.  Some technical analysis strategies such as a bull flag predict price moves based on larger macro chart formations.  

###Channel bounce trading
This strategy attempts to take advantage of predictable price moves within a channel.  Shorting at the resistance line and buying at the support line, even contrary to the overall trend of the channel, has the possiblity of turning profit.  In order to use this strategy, it must be decided that a channel will continue.  

##Moving Averages

----

#General Notes

##Uses of SMA Derivs
SMA Derivs can be used very effectively to determine the sentiment of the market.  If the deriv is above significantly above zero for an extended period of time, this indicates the probability of a bull market.  The same goes for the contrary, if it is below zero for an extended period of time which indicates a bear market.   The other option is if it hovers around and regulrarly crosses zero, indicating a range market.  

It is possible that the distance and times at which it crosses zero can be used to determine prime buy/sell points for trading the small moves within a range.