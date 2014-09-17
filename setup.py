# -*- coding: utf-8 -*-
# !/usr/bin/env python

# import os
# import sys


try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

import micorr
version = micorr.__version__

setup(
    name='MiCorr',
    version=version,
    author='',
    author_email='micorr@he-arc.ch',
    packages=[
        'micorr',
    ],
    include_package_data=True,
    install_requires=[
        'Django>=1.6.5',
    ],
    zip_safe=False,
    scripts=['micorr/manage.py'],
)
