
# Utility storage_path functions for models FileField.upload_to definitions
# These functions were moved from artefacts/models.py to a separate module
# as they are used in migrations files and must not be imported directly from models file to avoid
# DJango version >= 1.9 breaking migration due to Model import before application init (or app_label meta option def)

def get_img_storage_path(instance, filename):
    return '/'.join(['artefacts', str(instance.section.artefact.id), 'images', filename])

def get_doc_storage_path(instance, filename):
    return '/'.join(['artefacts', str(instance.artefact.id), 'documents', filename])

def get_img_storage_path_stratigraphy(instance, filename):
    return '/'.join(['artefacts', str(instance.artefact.id), 'stratigraphies', filename])
