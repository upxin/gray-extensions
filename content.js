// 获取域名存储状态
function getStorageData(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (store) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(store);
      }
    });
  });
}
function hideElementsByClassName(className, count) {
  const elements = document.getElementsByClassName(className);
  const maxCount =
    count !== undefined ? Math.min(count, elements.length) : elements.length;

  for (let i = 0; i < maxCount; i++) {
    elements[i].style.display = "none";
  }
}
function clear() {
  hideElementsByClassName("xp-info");
  hideElementsByClassName("zst-number");
  hideElementsByClassName("presqu", 2);
  hideElementsByClassName("xp-info");
  hideElementsByClassName("btn-pc");
  hideElementsByClassName("btn-download");
  hideElementsByClassName("header");
  hideElementsByClassName("btn-szc");

  const ll = document.getElementsByClassName("fixed-bottom-placeholder");
  ll[0].style.height = "44px";

  const tbody = document.getElementsByTagName("tbody");
  tbody[2].style.display = "none";

  // 获取父元素
  const parent = document.getElementById("now_gross");
  // 先删除索引为3的子元素（也就是第4项）
  if (parent.children.length > 3) {
    parent.removeChild(parent.children[3]);
  }
  // 再删除索引为1的子元素（也就是第2项）
  if (parent.children.length > 1) {
    parent.removeChild(parent.children[1]);
  }

  document.getElementById("zst").style.width = "auto";

  const type_list = document.getElementsByClassName("type-list");
  type_list[0].style.height = "44px";
  type_list[0].style.width = "100%";
}

// 初始化主题
(async () => {
  const store = await getStorageData(["currentDomain"]);
  const isGray = !!store.currentDomain;
  if (isGray) {
    document.documentElement.style.filter = "grayscale(100%)";
  } else {
    document.documentElement.style.filter = "";
  }
  clear();
})();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "switchTheme") {
    if (message.isGray) {
      document.documentElement.style.filter = "grayscale(100%)";
    } else {
      document.documentElement.style.filter = "";
    }

    clear();

    sendResponse({ success: true, ok: true });
    return true; // 保持消息通道打开，以便异步响应
  }
});
