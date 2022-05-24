using System;

namespace HostMusic.Releases.App.Authorization
{
    public class Account
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool AcceptTerms { get; set; }
        public Role Role { get; set; }
        public string VerificationToken { get; set; } = null!;
        public DateTime? Verified { get; set; }
    }
}