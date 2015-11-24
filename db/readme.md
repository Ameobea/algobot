#Overview

This module defines the indexed set database structure.  

An indexed set is a virtual data type that represents several sorted sets on a database level.  Each of those sorted sets represents a 'column' of data, with each of their elements being a data point in a row.  In this way, an indexed set can be likened to a traditional SQL table, with rows and columns that are accessible both by index as well as by the data stored within the columns.  

Unlike SQL or other relational database formats, data cannot be set or accessed in batch form.  For example, rows cannot be set given values for each of the columns, as this would not be very useful in this use case nor provide additional efficiency.  Data can be set and accessed given an indexed set id, column, and index or index range.  It is also possible to search a column for data that fits within a specified range.  

See indexed_set.js for documentation on each function.  