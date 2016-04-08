Kvalue
----
This file is the kvalue object instruction.

### object stucture
  * typeId {string} typeId refers to node type information  
  * hostDomain {string} hostDomain
  * kVName {string} node object about this kvalue
  * data {object} data object that contains kvalue information

data object like the following structure.

#### post
post object
  * title
  * subtitle
  * createUserId
  * conetent
  * tags {Array}, like [{tag: $tag}]
  * summary
  * createTime
  * updateTime
  * readTimes
  * postImgs {Array}, like [{imgurl: $imgurl}]
