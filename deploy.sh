sudo pkill node
git reset --hard
git clean -fd
git pull
sudo rm -rf node_modules
npm install
npm run staging >> /var/log/node/predis_api_$(date "+%Y%m%d%H%M%S").log 2>&1 &