# firebase-realtime

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

aws rekognition index-faces --image "{\"S3Object\":{\"Bucket\":\"baseimagen\",\"Name\":\"DJI_0027.DNG\"}}" --collection-id "reconocea" --max-faces 1 --quality-filter "AUTO" --detection-attributes "ALL" --external-image-id "DJI"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::baseimagen/*"
    }
  ]
}
