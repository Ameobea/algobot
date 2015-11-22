This module defines the indexed set database structure.  

An indexed set consists of two or more lists of data which share common indexes.  They are similar to tables
in MySQL or another traditional database where many rows of data can have multiple columns of attributes.  

On the database side, these structres are stored in sorted sets.  Each sorted set contains the indexes of
each element stored as well as that element, in effect creating one sorted set for each "column" of data, with
rows being elements within that sorted set.  The index is stored in the element and the data is stored
in the score of the sorted set in the redis database.  

Data can be stored and retrieved as a row or as a column within a row.  