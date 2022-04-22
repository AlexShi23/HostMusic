namespace HostMusic.Identity.Core
{
    public class IdentitySettings
    {
        public string Secret { get; set; }
        public int RefreshTokenTTL { get; set; }
    }
}