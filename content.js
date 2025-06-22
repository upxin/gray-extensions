// 获取存储数据（包含域名和灰度状态）
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
/**
 * 添加滚动到顶部按钮
 */
function addScrollToTopButton() {
  const button = document.createElement("button");
  button.textContent = "↑";
  button.id = "scrollToTopButton";
  button.title = "滚动到顶部";

  button.style.cssText = `
    position: fixed;
    bottom: 50px;
    right: 2px;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    background-color: #007BFF;
    color: white;
    font-size: 18px;
    cursor: pointer;
    z-index: 9999;
    opacity: 0.8;
  `;

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
    });
  });

  // 防止重复添加
  if (!document.getElementById("scrollToTopButton")) {
    document.body.appendChild(button);
  }
}
// 添加底部滚动按钮
function addScrollToBottomButton() {
  const button = document.createElement("button");
  button.textContent = "↓"; // 优化按钮显示内容
  button.id = "scrollToBottomButton";
  button.title = "滚动到底部"; // 添加提示信息

  // 优化后的样式
  button.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 2px;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    background-color: #007BFF;
    color: white;
    font-size: 18px;
    cursor: pointer;
    z-index: 9999;
    transition: opacity 0.3s;
    opacity: 0.8;
  `;

  button.addEventListener("click", () => {
    window.scrollTo({
      top: document.body.scrollHeight,
    });
  });

  // 防止重复添加按钮
  if (!document.getElementById("scrollToBottomButton")) {
    document.body.appendChild(button);
  }
}
function hideKl8() {
  // 获取id为currentData的元素
  const currentDataElement = document.getElementById("currentData");

  // 检查元素是否存在
  if (currentDataElement) {
    // 获取所有子元素
    const children = currentDataElement.children;

    // 确保有至少两个子元素
    if (children.length >= 2) {
      // 删除前两个子元素
      // 注意：每次删除后，children集合会自动更新，所以总是删除索引0的元素
      currentDataElement.removeChild(children[0]);
      currentDataElement.removeChild(children[0]);

      console.log("成功删除前两个子元素");
    } else {
      console.log("子元素数量不足，无法删除前两个");
    }
  } else {
    console.log("未找到id为currentData的元素");
  }
}
// 通用元素隐藏函数（带安全校验）
function hideElementsByClassName(className, count) {
  const elements = document.getElementsByClassName(className);
  if (!elements.length) return; // 无元素时提前返回

  const maxCount =
    count !== undefined ? Math.min(count, elements.length) : elements.length;
  for (let i = 0; i < maxCount; i++) {
    if (elements[i]) elements[i].style.display = "none"; // 校验元素存在性
  }
}

// 核心清理函数（所有 DOM 操作带安全校验）
function clear() {
  // 隐藏元素列表
  const hideList = [
    { className: "xp-info" },
    { className: "zst-number" },
    { className: "presqu", count: 2 },
    { className: "btn-pc" },
    { className: "btn-download" },
    { className: "header" },
    { className: "btn-szc" },
  ];

  hideList.forEach((item) => {
    hideElementsByClassName(item.className, item.count);
  });

  // 调整占位元素高度
  const fixedBottomPlaceholder = document.getElementsByClassName(
    "fixed-bottom-placeholder"
  )[0];
  if (fixedBottomPlaceholder) {
    fixedBottomPlaceholder.style.height = "44px";
  }

  // 隐藏特定表格体
  function removeTableBodyWithThbg() {
    // 选择所有直接位于 tbody 下的 .thbg 元素
    const thbgElements = document.querySelectorAll("tbody > .thbg");

    thbgElements.forEach((element) => {
      const tbody = element.closest("tbody"); // 找到当前 .thbg 元素的最近 tbody 父元素
      if (tbody) {
        tbody.remove(); // 删除 tbody
        console.log("已删除包含.thbg的tbody");
      }
    });
  }
  removeTableBodyWithThbg();

  // 操作父元素子节点（带存在性校验）
  const parent = document.getElementById("now_gross");
  if (parent) {
    // 先删除第4项（索引3）
    if (parent.children[3]) parent.removeChild(parent.children[3]);
    // 再删除第2项（索引1）
    if (parent.children[1]) parent.removeChild(parent.children[1]);
  }

  // 调整元素宽度
  const zstElement = document.getElementById("zst");
  if (zstElement) {
    zstElement.style.width = "auto";
  }

  // 调整类型列表样式
  const typeList = document.getElementsByClassName("type-list")[0];
  if (typeList) {
    typeList.style.cssText = "height: 44px; width: 100%;";
  }
}

// 初始化逻辑（带域名和状态校验）
(async () => {
  try {
    // 执行 DOM 操作
    addScrollToBottomButton();
    addScrollToTopButton();
    const { currentDomain, isGray } = await getStorageData([
      "currentDomain",
      "isGray",
    ]);
    const currentUrl = window.location.hostname; // 获取当前页面域名

    // 仅在目标域名且存储域名匹配时执行
    if (currentUrl === "lotto.sina.cn" && currentDomain === "lotto.sina.cn") {
      // 应用灰度样式
      document.documentElement.style.filter = isGray ? "grayscale(100%)" : "";
      document.body.style.maxWidth = "unset";
      hideKl8();
      document.getElementById("chartsTable").style.width = "100%";
      if (document.getElementsByClassName("zst_table")?.[1]) {
        document.getElementsByClassName("zst_table")[1].style.width = "100%";
      }
      clear();
    }
  } catch (error) {
    console.error("初始化失败:", error);
  }
})();

// 消息监听（处理主题切换）
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  try {
    if (message.action !== "switchTheme") return; // 非主题切换消息直接忽略

    const { currentDomain, isGray: storageIsGray } = await getStorageData([
      "currentDomain",
      "isGray",
    ]);
    const currentUrl = window.location.hostname;

    // 双重校验：当前页面域名 + 存储域名
    if (currentUrl !== "lotto.sina.cn" || currentDomain !== "lotto.sina.cn") {
      sendResponse({ success: false, message: "非目标域名" });
      return true; // 保持消息通道
    }

    // 应用新状态
    document.documentElement.style.filter = message.isGray
      ? "grayscale(100%)"
      : "";

    // 重新清理界面（确保元素状态同步）
    clear();

    sendResponse({
      success: true,
      message: `主题切换为${message.isGray ? "灰度" : "彩色"}模式`,
      currentState: { isGray: message.isGray },
    });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
  return true; // 确保异步响应
});
