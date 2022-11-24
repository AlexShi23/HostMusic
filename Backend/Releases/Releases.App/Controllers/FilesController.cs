using HostMusic.AmazonS3.Models;
using HostMusic.AmazonS3.Provider;
using HostMusic.Releases.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Releases.Primitives;

namespace HostMusic.Releases.App.Controllers;

[ApiController]
[Route("[controller]")]
public class FilesController : ControllerBase
{
    private readonly IAmazonS3Provider _s3Provider;

    public FilesController(IAmazonS3Provider s3Provider)
    {
        _s3Provider = s3Provider;
    }

    [HttpPost]
    public async Task UploadFile([FromForm] UploadFileRequest request)
    {
        await _s3Provider.UpdateFile(new UpdateFileRequest
        {
            FileId = request.FileId,
            ContentType = request.FileData.ContentType,
            Data = request.FileData.OpenReadStream(),
            BucketName = request.FileType.ToString().ToLower() + "s"
        }, default);

        if (request.FileType is FileType.Cover or FileType.Avatar)
        {
            // сжатие
            await _s3Provider.UpdateFile(new UpdateFileRequest
            {
                FileId = request.FileId,
                ContentType = request.FileData.ContentType,
                Data = request.FileData.OpenReadStream(),
                BucketName = request.FileType.ToString().ToLower() + "s_compressed"
            }, default);
        }
    }
    
    [HttpGet]
    public async Task<ActionResult<Stream>> GetFile([FromForm] GetFileRequest request)
    {
        var bucketName = request.FileType.ToString().ToLower() + "s" + (request.Compressed ? "_compressed" : "");
        return await _s3Provider.GetFileStream(new AmazonFileReference(bucketName, request.FileId), default);
    }
}