namespace HostMusic.Releases.Core.Models;

public class ReleasesPageResponse
{
    public IReadOnlyList<ReleaseResponse> Releases { get; set; }
    public int PagesCount { get; set; }
    
    public ReleasesPageResponse(IReadOnlyList<ReleaseResponse> releases, int pagesCount)
    {
        Releases = releases;
        PagesCount = pagesCount;
    }
}