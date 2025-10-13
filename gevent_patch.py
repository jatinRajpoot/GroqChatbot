"""
Early gevent monkey patching to avoid SSL import warnings.
This module MUST be imported before any other modules that use SSL.
"""
from gevent import monkey

# Patch all standard library modules before any other imports
monkey.patch_all()
