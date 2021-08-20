#!/bin/sh

# Check every 6 hours if nginx should be reloaded
function restart_nginx() {
	while :; do
		# Look for restart flag in mounted volume
		if [ -f ./flags/restart_nginx ]; then
			echo "Restarting nginx"
			# Signal nginx to gracefully reload without affecting traffic
			echo -e "POST /containers/${NGINX_CONTAINER_NAME}/kill?signal=SIGHUP HTTP/1.0\r\n" | nc -U /var/run/docker.sock
			rm ./flags/restart_nginx
    	fi
		echo "Next nginx restart check in 6 hours"
		sleep 6h
	done
}
restart_nginx &

# Attempt certificate renewal every 7 days
function renew_certificates() {
	while :; do
		echo "Checking certificate renewal status"
		# Signal certbot to run
		echo -e "POST /containers/${CERTBOT_CONTAINER_NAME}/start HTTP/1.0\r\n" | nc -U /var/run/docker.sock
		echo "Next certificate renewal attempt in 7 days"
		sleep 7d
	done
}
renew_certificates &

wait
