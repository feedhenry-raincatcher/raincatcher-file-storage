# FeedHenry RainCatcher file storage [![Build Status](https://travis-ci.org/feedhenry-raincatcher/raincatcher-file-storage.png)](https://travis-ci.org/feedhenry-raincatcher/raincatcher-file-storage)

**No longer supported** - Storage support was moved to fh-wfm-file module. If you still use this module please refer to file module documentation to migrate.

A module for FeedHenry RainCatcher that manages file storage

## Supported storage engines

### AWS S3 storage

Allows to store files in AWS S3 buckets.

Options:

```
var storageConfig = {
  s3: {
    s3Options: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_ACCESS_KEY_SECRET,
      region: process.env.AWS_S3_REGION
    },
    bucket: "raincatcher-files"
  }
}
require('fh-wfm-file-storage/lib/cloud')(mediator, storageConfig);
```

### Gridfs MongoDB storage

Allows to store file in MongoDB database using Gridfs driver

Options:
```
var storageConfig = {
  gridFs: {
    mongoUrl: "mongodb://localhost:27017/files"
  }
};
require('fh-wfm-file-storage/lib/cloud')(mediator, storageConfig);
```

### Topic Subscriptions

Topics are used in file module.

#### wfm:files:create

##### Description

Save file to the storage

##### Example


```javascript
var parameters = {
   // File namespace (folder)
   namespace:null,
   fileName:"test",
   location: "/tmp/file"
  //Optional topic unique identifier
  topicUid: "uniquetopicid"
}

mediator.publish("wfm:files-store:create", parameters);
```

#### wfm:files:get
##### Description

Retrieve file from the storage (BinaryStream)

##### Example

```javascript
var parameters = {
  namespace:null,
  fileName:"test",
  topicUid: "uniquetopicid"
}

mediator.publish("wfm:files-store:get", parameters);
```
