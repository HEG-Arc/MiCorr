echo replacing ___my.example.com___/$MY_DOMAIN_NAME
# Replace actual domain name into the nginx reverse proxy config template
sed -i "s/___my.example.com___/$MY_DOMAIN_NAME/g" /etc/nginx/nginx.conf
echo starting nginx
nginx -g 'daemon off;'
