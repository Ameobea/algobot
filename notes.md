#ZRANGE sset index1 index2
- returns the members of a sorted set between index1 and index2

#ZRANGEBYSCORE sset score1 score2
- Returns the members in a sorted set that have scores between the defined parameters. 
- Adding in a ( before the score will make it exclusive.  So ZRANGEBYSCORE sset (5 10 will return all elements with score >5 and <= 10

#ZRANK sset member
- returns the index in a sorted set of the element.  

#ZREVRANK sset member
- returns the index in a sorted set of the element with the scores ordered from high to low.  

#ZSCORE sset member
- returns the score of a member of a sorted set.  