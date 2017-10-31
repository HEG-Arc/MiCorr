from whitenoise.storage import CompressedManifestStaticFilesStorage,MissingFileError

# multiple static file errors workaround
# overwrite default CompressedManifestStaticFilesStorage ignoring bad references in static file
# as per whitenoise author suggestion https://github.com/evansd/whitenoise/issues/96

class ErrorSquashingStorage(CompressedManifestStaticFilesStorage):
    def url(self, name, **kwargs):
        try:
            return super(ErrorSquashingStorage, self).url(name, **kwargs)
        except MissingFileError:
            return name
