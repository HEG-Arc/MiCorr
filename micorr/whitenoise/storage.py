from whitenoise.storage import CompressedManifestStaticFilesStorage,MissingFileError

# multiple static file errors workaround
# overwrite default CompressedManifestStaticFilesStorage ignoring bad references in static file
# as per whitenoise author suggestion https://github.com/evansd/whitenoise/issues/96

class ErrorSquashingStorage(CompressedManifestStaticFilesStorage):
    def url(self, name, **kwargs):
        try:
            return super(ErrorSquashingStorage, self).url(name, **kwargs)
        except (MissingFileError, ValueError):
            return name

    def post_process(self, *args, **kwargs):
        files = super(ErrorSquashingStorage, self).post_process(*args, **kwargs)
        for name, hashed_name, processed in files:
            if isinstance(processed, MissingFileError):
                processed = True
            yield name, hashed_name, processed

