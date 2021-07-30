# web-nodejs-sample

ExpressJS Sample Application

# Developer Workspace
[![Contribute](http://beta.codenvy.com/factory/resources/codenvy-contribute.svg)](http://beta.codenvy.com/f?id=r8et9w6vohmqvro8)

# Stack to use

FROM [codenvy/node](https://hub.docker.com/r/codenvy/node/)

# How to run

| #       | Description           | Command  |
| :------------- |:-------------| :-----|
| 1      | Run | `cd ${current.project.path}/app && node app.js` |

oc new-build  --name=makeorder  --binary --image-stream=nodejs:12-ubi8 -e COLOR=blue -e ENDPOINT=http://makeorder-orders.apps.cluster-2e68.2e68.sandbox1783.opentlc.com

oc start-build makeorder   --from-dir=.  --follow

oc new-app makeorder:latest -e COLOR=black -e ENDPOINT=http://makeorder-orders.apps.cluster-2e68.2e68.sandbox1783.opentlc.com

oc expose service/makeorder
