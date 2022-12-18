using HostMusic.AmazonS3.Models;
using HostMusic.AmazonS3.Provider;
using HostMusic.MinioUtils.Provider;
using HostMusic.Releases.Core.Models;
using HostMusic.Releases.Primitives;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using Image = SixLabors.ImageSharp.Image;

namespace HostMusic.Releases.App.Controllers;

[ApiController]
[Route("[controller]")]
public class FilesController : ControllerBase
{
    private readonly IAmazonS3Provider _s3Provider;
    private readonly IMinioProvider _minioProvider;

    public FilesController(IAmazonS3Provider s3Provider, IMinioProvider minioProvider)
    {
        _s3Provider = s3Provider;
        _minioProvider = minioProvider;
    }

    /// <summary>
    /// Upload file
    /// </summary>
    [HttpPost]
    public async Task UploadFile([FromForm] UploadFileRequest request)
    {
        var (contentType, extension) = GetContentTypeAndExtension(request.FileType);
        var fileName = $"{request.FileId}.{extension}";
        await _s3Provider.UpdateFile(new UpdateFileRequest
        {
            FileName = fileName,
            ContentType = contentType,
            Data = request.FileData.OpenReadStream(),
            BucketName = request.FileType.ToString().ToLower() + "s"
        }, HttpContext.RequestAborted);

        if (request.FileType is FileType.Cover or FileType.Avatar)
        {
            var imageStream = new MemoryStream();
            var image = await Image.LoadAsync(request.FileData.OpenReadStream());
            image.Mutate(x => x.Resize(100, 100));
            await image.SaveAsync(imageStream, new JpegEncoder());

            await _s3Provider.UpdateFile(new UpdateFileRequest
            {
                FileName = fileName,
                ContentType = request.FileData.ContentType,
                Data = imageStream,
                BucketName = request.FileType.ToString().ToLower() + "s-compressed"
            }, HttpContext.RequestAborted);
        }
    }
    
    /// <summary>
    /// Get file
    /// </summary>
    /// <returns>One file</returns>
    [HttpGet]
    public async Task<ActionResult> GetFile([FromQuery] GetFileRequest request)
    {
        var bucketName = request.FileType.ToString().ToLower() + "s" + (request.Compressed ? "-compressed" : "");
        var (contentType, extension) = GetContentTypeAndExtension(request.FileType);
        var fileName = $"{request.FileId}.{extension}";
        var file = await _s3Provider.GetFileStream(new AmazonFileReference(bucketName, fileName),
            HttpContext.RequestAborted);
        return File(file, contentType, fileName);
    }

    /// <summary>
    /// Delete file
    /// </summary>
    /// <returns>One file</returns>
    [HttpDelete]
    public async Task<ActionResult> DeleteFile([FromQuery] DeleteFileRequest request)
    {
        var bucketName = request.FileType.ToString().ToLower() + "s";
        var (_, extension) = GetContentTypeAndExtension(request.FileType);
        var fileName = $"{request.FileId}.{extension}";
        await _s3Provider.DeleteFile(new AmazonFileReference(bucketName, fileName), HttpContext.RequestAborted);
        
        if (request.FileType is FileType.Cover)
        {
            await _s3Provider.DeleteFile(new AmazonFileReference(bucketName + "-compressed", fileName),
                HttpContext.RequestAborted);
        }

        return Ok();
    }
    
    /// <summary>
    /// Get pre-signed url for uploading
    /// </summary>
    /// <returns>Url</returns>
    [HttpGet("url")]
    public async Task<ActionResult<string>> GetUploadUrl([FromQuery] GetFileRequest request)
    {
        var bucketName = request.FileType.ToString().ToLower() + "s" + (request.Compressed ? "-compressed" : "");
        var (_, extension) = GetContentTypeAndExtension(request.FileType);
        var fileName = $"{request.FileId}.{extension}";
        var url = await _minioProvider.GetPreSignedUrlForUpload(bucketName, fileName, 60 * 60);
        return Ok(url);
    }

    private async Task CreateBuckets()
    {
        await _s3Provider.CreateDefaultBuckets(new[]
        {
            "avatars", "avatars-compressed", "covers", "covers-compressed", "tracks"
        }, CancellationToken.None);
    }

    private (string, string) GetContentTypeAndExtension(FileType fileType)
    {
        switch (fileType)
        {
            case FileType.Avatar:
            case FileType.Cover:
                return ("image/jpeg", "jpg");
            case FileType.Track:
                return ("audio/wav", "wav");
            default:
                throw new ArgumentOutOfRangeException();
        }
    }
}