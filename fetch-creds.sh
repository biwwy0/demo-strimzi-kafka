#!/usr/bin/env bash

if [[ "$DEBUG" ]]; then
	set -exuo pipefail
else
	set -euo pipefail
fi

function help(){
    echo "USAGE: $(basename $0) -u indexer-events"
    exit 1
}

parse_args() {
	if ! [[ -z $@ ]]
	then
		while getopts "u:e:h" option
			do
			  case "${option}"
			    in
			      u)
							export user="$OPTARG"
							;;
						*)
							help
							;;
			  esac
			done
	else
		help
	fi
}

fetch_secrets() {
	kubectl get secret "${user}" -n kafka -o json |jq -r '.data."user.crt"' | base64 -d > "$PWD/user.crt"
	kubectl get secret "${user}" -n kafka -o json |jq -r '.data."user.key"' | base64 -d > "$PWD/user.key"
	kubectl get secret kafka-cluster-ca-cert -n kafka -o json |jq -r '.data."ca.crt"' | base64 -d > "$PWD/ca.crt"

	echo security.protocol=SSL > env.properties
	echo ssl.ca.location="$PWD/ca.crt" >> env.properties
	echo ssl.key.location="$PWD/user.key" >> env.properties
	echo ssl.certificate.location="$PWD/user.crt" >> env.properties
	echo ssl.key.password=$(kubectl get secret "${user}" -n kafka -o json |jq -r '.data."user.password"' | base64 -d) >> env.properties
}

main() {
  parse_args "$@"
  fetch_secrets
}

main "$@"
