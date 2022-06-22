using System;
using System.Globalization;

namespace HostMusic.Releases.Core.Exceptions
{
    public class AppException : Exception
    {
        public AppException(string message) : base(message)
        {
        }

        public AppException(string message, params object[] args)
            : base(string.Format(CultureInfo.CurrentCulture, message, args))
        {
        }
    }
}