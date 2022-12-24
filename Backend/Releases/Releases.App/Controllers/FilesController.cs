using HostMusic.MinioUtils.Models;
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
    private readonly IMinioProvider _minioProvider;

    public FilesController(IMinioProvider minioProvider)
    {
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
        
        if (request.FileType is FileType.Cover or FileType.Avatar)
        {
            var imageStream = new MemoryStream();
            using (var image = await Image.LoadAsync(request.FileData.OpenReadStream()))
            {
                var clone = image.Clone(
                    i => i.Resize(50, 50));

                await clone.SaveAsync(imageStream, new JpegEncoder());
                imageStream.Position = 0;
            }

            await _minioProvider.UpdateFile(new UpdateFileRequest
            {
                FileName = fileName,
                ContentType = contentType,
                Data = imageStream,
                BucketName = request.FileType.ToString().ToLower() + "s-compressed"
            }, HttpContext.RequestAborted);
        }
        
        await _minioProvider.UpdateFile(new UpdateFileRequest
        {
            FileName = fileName,
            ContentType = contentType,
            Data = request.FileData.OpenReadStream(),
            BucketName = request.FileType.ToString().ToLower() + "s"
        }, HttpContext.RequestAborted);
    }
    
    /// <summary>
    /// Get file
    /// </summary>
    /// <returns>One file</returns>
    [HttpGet]
    public async Task<ActionResult> GetFile([FromQuery] GetFileRequest request)
    {
        var bucketName = GetBucketName(request.FileType, request.Compressed);
        var (contentType, extension) = GetContentTypeAndExtension(request.FileType);
        var fileName = $"{request.FileId}.{extension}";
        var file = await _minioProvider.GetFileStream(new MinioFile(bucketName, fileName),
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
        await _minioProvider.DeleteFile(new MinioFile(bucketName, fileName), HttpContext.RequestAborted);
        
        if (request.FileType is FileType.Cover or FileType.Avatar)
        {
            await _minioProvider.DeleteFile(new MinioFile(bucketName + "-compressed", fileName),
                HttpContext.RequestAborted);
        }

        return Ok();
    }
    
    /// <summary>
    /// Get pre-signed url for uploading
    /// </summary>
    /// <returns>Url</returns>
    [HttpGet("url/upload")]
    public async Task<ActionResult<string>> GetUploadUrl([FromQuery] GetFileRequest request)
    {
        var bucketName = GetBucketName(request.FileType, request.Compressed);
        var (_, extension) = GetContentTypeAndExtension(request.FileType);
        var fileName = $"{request.FileId}.{extension}";
        var url = await _minioProvider.GetPreSignedUrlForUpload(bucketName, fileName, 60 * 60);
        return Ok(url);
    }
    
    /// <summary>
    /// Get pre-signed url for get file
    /// </summary>
    /// <returns>Url</returns>
    [HttpGet("url/get")]
    public async Task<ActionResult<string>> GetFileUrl([FromQuery] GetFileRequest request)
    {
        var bucketName = GetBucketName(request.FileType, request.Compressed);
        var (_, extension) = GetContentTypeAndExtension(request.FileType);
        var fileName = $"{request.FileId}.{extension}";
        var url = await _minioProvider.GetPreSignedUrl(bucketName, fileName, 60 * 60);
        return Ok(url);
    }

    private async Task CreateBuckets()
    {
        await _minioProvider.CreateDefaultBuckets(new[]
        {
            "avatars", "avatars-compressed", "covers", "covers-compressed", "tracks"
        }, CancellationToken.None);
    }
    
    private string GetBucketName(FileType fileType, bool compressed) =>
        fileType.ToString().ToLower() + "s" + (compressed ? "-compressed" : string.Empty);

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