#!/bin/sh

# Define variables
IMAGE_ID="$DOCKER_REGISTRY/eks-common-services-api"
IMAGE_TAG="dev-$CI_COMMIT_SHORT_SHA"
SERVICE_NAME="$APP_NAME"
HELM_VERSION="v3.9.0"
EKS_CLUSTER_NAME="nextgen-dev-cluster"
KUBECTL_VERSION="v1.30.0"

# Configure cluster
apk update && apk add python3 py3-pip jq curl
pip3 install awscli
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set region $AWS_DEFAULT_REGION
aws eks update-kubeconfig --name $EKS_CLUSTER_NAME

# Install helm and kubectl
curl -fsSL https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl -o /usr/local/bin/kubectl
chmod +x /usr/local/bin/kubectl
kubectl version --client
curl -fsSL https://get.helm.sh/helm-$HELM_VERSION-linux-amd64.tar.gz | tar xzf - -C /usr/local/bin --strip-components=1 linux-amd64/helm

# Helm Install
helm upgrade --install common-services-api ./charts/common-services-api --set image.repository=$IMAGE_ID --set image.tag=$IMAGE_TAG --set ingress.annotations.group_name=dev-ing --set ingress.annotations.loadbalancer_name=dev-eks --set ingress.hosts[0].host=nextgen-dev-common-services-api.radiusdirect.net --set ingress.hosts[0].paths[0].path=/ --set ingress.hosts[0].paths[0].pathType=Prefix -n dev --debug
kubectl rollout status deployment/common-services-api -n dev

echo "Deployment complete."
