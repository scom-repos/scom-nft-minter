rm -rf src/contracts &&
mkdir -p src/contracts/scom-product-contract &&
mkdir -p src/contracts/scom-commission-proxy-contract &&
cp -r node_modules/@scom/scom-product-contract/src/* src/contracts/scom-product-contract &&
cp -r node_modules/@scom/scom-commission-proxy-contract/src/* src/contracts/scom-commission-proxy-contract