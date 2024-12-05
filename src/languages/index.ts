import main from './main.json';
import components from './components.json';
import common from './common.json';

function mergeI18nData(i18nData: Record<string, any>[]) {
  const mergedI18nData: Record<string, any> = {};
  for (let i = 0; i < i18nData.length; i++) {
    const i18nItem = i18nData[i];
    for (const key in i18nItem) {
      mergedI18nData[key] = { ...(mergedI18nData[key] || {}), ...(i18nItem[key] || {}) };
    }
  }
  return mergedI18nData;
}

const mainJson = mergeI18nData([main, common]);
const componentsJson = mergeI18nData([components, common]);

export {
  mainJson,
  componentsJson
}
