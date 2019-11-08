from glob import glob
from os.path import basename, splitext
from setuptools import find_packages, setup

setup(
    name='ppr-api',
    version='0.1',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    py_modules=[splitext(basename(path))[0] for path in glob('src/*.py')],
    include_package_data=True,
    url='https://github.com/bcgov/ppr',
    license='',
    author='',
    author_email='',
    description='',
    setup_requires=["pytest-runner"],
    tests_require=["pytest"]
)
