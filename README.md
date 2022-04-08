# demo-strimzi-kafka

```sh
k apply -f *.yaml
k exec -it demo-eng-pod -n kafka -- bash
```

```sh
root@demo-eng-pod:/# apt-get update && apt-get -y install nodejs npm && mkdir /app && cd /app
# Create files produce/consume.js from this repo inside container
root@demo-eng-pod:/app# node run produce.js &
root@demo-eng-pod:/app# node run consume.js
```
