﻿namespace HostMusic.AmazonS3.Models;

public class AmazonFileReference
{
    public string BucketName { get; set; }
    public string FileName { get; set; }
    
    public AmazonFileReference(string bucketName, string fileName)
    {
        BucketName = bucketName;
        FileName = fileName;
    }
}