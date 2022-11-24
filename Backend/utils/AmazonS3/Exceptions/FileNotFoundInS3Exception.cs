namespace HostMusic.AmazonS3.Exceptions;

public class FileNotFoundInS3Exception : Exception
{
    public FileNotFoundInS3Exception(string keyName, Exception? innerException = null) : base(
        $"Файл не существует: {keyName}",
        innerException)
    {
    }
}