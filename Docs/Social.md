
# MIXT SOCIAL MODULE
*file: /mixt_modules/social.php*

## Social Sharing Profiles

Social sharing profiles can be easily added, removed and customized. The sharing urls are entered by the user as patterns with variable placeholder tags, which can be any of the following:

- `{site}` - the website name
- `{title}` - the post's title
- `{link}` - the post's permalink
- `{link2}` - the shorter permalink for use in tweets, for example
- `{thumb}` - the thumbnail or attachment image

More tags can be added in the `$pattern_tags` array, inside the `mixt_social_profiles()` function.