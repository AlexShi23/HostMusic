﻿using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Microsoft.Extensions.Options;

namespace HostMusic.AmazonS3.Factory;

public class AmazonS3ClientFactory : IAmazonS3ClientFactory
{
    private AmazonS3Options Settings { get; }
    
    public AmazonS3ClientFactory(IOptions<AmazonS3Options> options)
    {
        Settings = options.Value;
    }
    
    public IAmazonS3 Create()
    {
        var credentials = new BasicAWSCredentials(Settings.AccessKey, Settings.SecretKey);
        var client = new AmazonS3Client(credentials, new AmazonS3Config
        {
            AuthenticationRegion = "eu-west-2",
            SignatureVersion = "v4",
            RegionEndpoint = RegionEndpoint.EUWest2,
            SignatureMethod = SigningAlgorithm.HmacSHA256,
            ServiceURL = Settings.ServiceUrl,
            ForcePathStyle = true
        });
        return client;
    }
}