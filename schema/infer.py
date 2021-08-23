#!/usr/bin/env python
# -*- coding: utf8 -*-

from pyspark.sql import SparkSession
import json
from os import path, walk, makedirs

path_requests = 'requests'
path_schemas = 'inferred-schemas'

def inferSchema():
    spark = SparkSession.builder \
            .appName('Schema Inference') \
            .master('local') \
            .getOrCreate()
    spark.sparkContext.setLogLevel('ERROR')

    # List all files in directory and add them to a list.
    request_files = []
    for (_, _, filenames) in walk(path_requests):
        for file in filenames:
            if file.endswith('.json'):
                request_files.extend([file])

    # Make sure the folder that we'll export schemas to exists.
    if len(request_files) > 0:
        if not path.exists(path_schemas):
            print(f'/{path_schemas} did not exist, creating now.')
            makedirs(path_schemas)

    if len(request_files) == 0:
        print('No requests found. Exiting.')
        return

    for file in request_files:
        path_request = path.join(path_requests, file)
        path_schema = path.join(path_schemas, file)

        df = spark.read.json(path_request, multiLine=True)
        print(f'LOAD: {path_request}')

        with open(path_schema, 'w') as file_schema:
            # Prepare pretty printed file for writing to file.
            dump = json.dumps(json.loads(df.schema.json()), indent=2, sort_keys=True)

            file_schema.write(dump)
            file_schema.close()
            print(f'WRITE: {path_schema}')

    print('Inference completed.')

def run():
    if path.exists(path_requests):
        inferSchema()
    else:
        print(f'/{path_requests} folder does not exist. Creating folder now.')
        print('Please add requests to the requests folder and try again.')

run()
