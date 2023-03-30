rm -rf src/contracts &&
mkdir -p src/contracts/scom-product-contract &&
mkdir -p src/contracts/scom-commission-proxy-contract &&
mkdir -p src/scom-network-picker &&
cp -r node_modules/@scom/scom-product-contract/src/* src/contracts/scom-product-contract &&
cp -r node_modules/@scom/scom-commission-proxy-contract/src/* src/contracts/scom-commission-proxy-contract &&
cp -r node_modules/@scom/scom-network-picker/src/* src/scom-network-picker &&
cp -r src/scom-network-picker/img/* src/img &&
rm -rf src/scom-network-picker/img