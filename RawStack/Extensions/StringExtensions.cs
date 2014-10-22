namespace System
{
    public static class StringExtensions
    {
        // Convert the string to camel case.
        public static string ToCamelCase(this string value)
        {
            return value.Substring(0, 1).ToLowerInvariant() + value.Substring(1);
        }
    }
}