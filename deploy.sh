#!/usr/bin/env bash

set -e

PUBSUB_TOPIC=test-topic-2
GCLOUD_BUCKET=hbt-data-staging

GCLOUD_PROJECT_STAGING=hungarian-blue-trail-staging
GCLOUD_PROJECT_PROD=hungarian-blue-trail
GCLOUD_REGION=europe-central2
GCLOUD_FUNCTIONS_RUNTIME=nodejs16

GRAPHQL_FUNCTION_NAME=graphql
GRAPHQL_HANDLER_ENTRYPOINT=graphql
GRAPHQL_MEMORY_CONFIG=1024MB
GRAPHQL_TIMEOUT_CONFIG=30s
GRAPHQL_MAX_INSTANCES_CONFIG=3

WORKER_FUNCTION_NAME=worker
WORKER_HANDLER_ENTRYPOINT=worker
WORKER_MEMORY_CONFIG=256MB
WORKER_TIMEOUT_CONFIG=540s
WORKER_MAX_INSTANCES_CONFIG=2

if [ "$DEPLOY_TARGET" == "production" ]; then
    echo "››››››››››››››››››››››››››››"
    echo "››› Deploy to production ›››"
    echo "››››››››››››››››››››››››››››"
    GCLOUD_PROJECT="$GCLOUD_PROJECT_PROD"
else
    echo "›››››››››››››››››››››››››"
    echo "››› Deploy to staging ›››"
    echo "›››››››››››››››››››››››››"
    GCLOUD_PROJECT="$GCLOUD_PROJECT_STAGING"
fi

if [ "$GCLOUD_LOGGED_IN" != "true" ]; then
    echo ""
    echo "››› Login to gcloud"
    echo ""

    mkdir .tmp
    echo "$GCLOUD_SERVICE_ACCOUNT" | base64 -d > .tmp/gcloud.json
    gcloud auth activate-service-account --key-file=.tmp/gcloud.json
    rm .tmp/gcloud.json
fi

set -x

gcloud config set project "$GCLOUD_PROJECT"

if [ "$DEPLOY_SERVICE" == "worker" ]; then
    gcloud functions deploy "$WORKER_FUNCTION_NAME" \
        --region "$GCLOUD_REGION" \
        --entry-point "$WORKER_HANDLER_ENTRYPOINT" \
        --trigger-topic "$PUBSUB_TOPIC" \
        --memory "$WORKER_MEMORY_CONFIG" \
        --runtime "$GCLOUD_FUNCTIONS_RUNTIME" \
        --timeout "$WORKER_TIMEOUT_CONFIG" \
        --set-env-vars NODE_ENV=production,PUBSUB_TOPIC="$PUBSUB_TOPIC",GCLOUD_BUCKET="$GCLOUD_BUCKET" \
        --max-instances "$WORKER_MAX_INSTANCES_CONFIG"
else
    gcloud functions deploy "$GRAPHQL_FUNCTION_NAME" \
        --region "$GCLOUD_REGION" \
        --entry-point "$GRAPHQL_HANDLER_ENTRYPOINT" \
        --trigger-http \
        --allow-unauthenticated \
        --memory "$GRAPHQL_MEMORY_CONFIG" \
        --runtime "$GCLOUD_FUNCTIONS_RUNTIME" \
        --security-level secure-always \
        --timeout "$GRAPHQL_TIMEOUT_CONFIG" \
        --set-env-vars NODE_ENV=production,GCLOUD_BUCKET="$GCLOUD_BUCKET" \
        --max-instances "$GRAPHQL_MAX_INSTANCES_CONFIG"
fi
