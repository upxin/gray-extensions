function createNumberSelector(options = {}) {
  // 默认配置（三行数字自然排列，左对齐）
  const defaultOptions = {
    row1: [1, 2, 3, null, null, 12, 13, 14, null, null, 23, 24, 25], // 第一行
    row2: [4, 5, 6, 10, 11, 15, 16, 17, 21, 22, 26, 27, 28], // 第二行
    row3: [7, 8, 9, 18, 19, 20, null, null, 29, 30, 31, 32, 33], // 第三行
    title: "数字选择器",
  };

  const config = { ...defaultOptions, ...options };

  // 检查是否已存在数字选择器
  const existingContainer = document.getElementById(
    "number-selector-container"
  );
  if (existingContainer) {
    const existingToast = document.getElementById("number-selector-toast");
    const existingStyle = document.querySelector("style[data-number-selector]");

    if (existingToast) document.body.removeChild(existingToast);
    if (existingStyle) document.head.removeChild(existingStyle);
    document.body.removeChild(existingContainer);
  }

  // 创建弹窗容器
  const container = document.createElement("div");
  container.id = "number-selector-container";
  container.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 20px;
    z-index: 9999;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
  `;

  // 创建标题栏（可拖拽区域）
  const header = document.createElement("div");
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    cursor: move;
    user-select: none;
    padding: 8px 12px;
    background-color: #f5f5f5;
    border-radius: 4px;
  `;

  const title = document.createElement("h3");
  title.textContent = config.title;
  title.style.margin = "0";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #666;
    user-select: none;
    padding: 4px;
  `;

  header.appendChild(title);
  header.appendChild(closeBtn);

  // 创建内容区域（三行左对齐布局）
  const content = document.createElement("div");
  content.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  `;

  // 创建三行数字（左对齐，每行独立flex容器）
  const rows = [config.row1, config.row2, config.row3];

  rows.forEach((rowData, rowIndex) => {
    const rowContainer = document.createElement("div");
    rowContainer.style.cssText = `
      display: flex;
      gap: 8px;
      justify-content: flex-start; /* 左对齐 */
    `;

    rowData.forEach((num) => {
      const item = document.createElement("div");
      item.style.cssText = `
        width: 40px;
        height: 40px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: #f9f9f9;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.2s ease;
        user-select: none;
      `;

      if (num === null) {
        item.textContent = "";
        item.style.border = "1px dashed #eee";
        item.style.backgroundColor = "transparent";
        item.style.cursor = "default";
        item.style.pointerEvents = "none";
      } else {
        item.textContent = num;
        item.addEventListener("click", function () {
          this.classList.toggle("active");
        });
      }

      rowContainer.appendChild(item);
    });

    content.appendChild(rowContainer);
  });

  // 创建按钮区域
  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = `
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
  `;

  const copyBtn = document.createElement("button");
  copyBtn.textContent = "复制选中数字";
  copyBtn.style.cssText = `
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    user-select: none;
  `;

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "清空选择";
  clearBtn.style.cssText = `
    padding: 10px 20px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    user-select: none;
  `;

  buttonContainer.appendChild(copyBtn);
  buttonContainer.appendChild(clearBtn);

  // 创建提示信息区域
  const toast = document.createElement("div");
  toast.id = "number-selector-toast";
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 10000;
  `;

  // 添加样式到 head
  const style = document.createElement("style");
  style.setAttribute("data-number-selector", "true");
  style.textContent = `
    #number-selector-container .active {
      color: red;
      border-color: #ff9999;
      background-color: #fff0f0;
    }
    
    #number-selector-container button:hover {
      filter: brightness(0.95);
    }
    
    #number-selector-container button:active {
      filter: brightness(0.9);
    }
    
    #number-selector-toast.show {
      opacity: 1;
    }
  `;

  document.head.appendChild(style);

  // 将所有元素添加到容器
  container.appendChild(header);
  container.appendChild(content);
  container.appendChild(buttonContainer);
  document.body.appendChild(container);
  document.body.appendChild(toast);

  // 实现拖拽功能
  let isDragging = false;
  let offsetX, offsetY;
  let initialLeft, initialTop;
  let containerWidth, containerHeight;

  header.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    e.preventDefault();
    isDragging = true;
    const rect = container.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    containerWidth = container.offsetWidth;
    containerHeight = container.offsetHeight;
    offsetX = e.clientX - initialLeft;
    offsetY = e.clientY - initialTop;
    container.style.transition = "none";
    container.style.transform = "none";
    container.style.top = `${initialTop}px`;
    container.style.left = `${initialLeft}px`;
    container.classList.add("dragging");
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const minX = 0;
    const maxX = screenWidth - containerWidth;
    const minY = 0;
    const maxY = screenHeight - containerHeight;
    const constrainedX = Math.max(minX, Math.min(newX, maxX));
    const constrainedY = Math.max(minY, Math.min(newY, maxY));
    container.style.left = `${constrainedX}px`;
    container.style.top = `${constrainedY}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      container.style.transition = "transform 0.2s ease";
      container.classList.remove("dragging");
    }
  });

  // 复制选中数字
  copyBtn.addEventListener("click", () => {
    const selectedItems = container.querySelectorAll(".active");
    const selectedNumbers = Array.from(selectedItems).map(
      (item) => item.textContent
    );
    if (selectedNumbers.length === 0) {
      showToast("请先选择要复制的数字！");
      return;
    }
    const numbersString = selectedNumbers.sort((a, b) => a - b).join(",");
    navigator.clipboard
      .writeText(numbersString)
      .then(() => showToast("已复制: " + numbersString))
      .catch(() => showToast("复制失败，请手动复制！"));
  });

  // 清空选择
  clearBtn.addEventListener("click", () => {
    const allItems = container.querySelectorAll(".active");
    allItems.forEach((item) => item.classList.remove("active"));
    showToast("已清空所有选择");
  });

  // 关闭弹窗
  closeBtn.addEventListener("click", () => {
    container.style.opacity = "0";
    container.style.transform = "translate(-50%, -50%) scale(0.9)";
    container.style.transition = "opacity 0.3s, transform 0.3s";
    setTimeout(() => {
      document.body.removeChild(container);
      document.body.removeChild(toast);
      document.head.removeChild(style);
    }, 300);
  });

  // 显示提示
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }

  // 返回控制对象
  return {
    close: () => closeBtn.click(),
    copy: () => copyBtn.click(),
    clear: () => clearBtn.click(),
    getSelectedNumbers: () =>
      Array.from(container.querySelectorAll(".active")).map((item) =>
        Number(item.textContent)
      ),
  };
}

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

function setNone(id) {
  document.getElementById(id).style.display = "none";
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
    // 创建数字选择器（使用默认配置）

    // 仅在目标域名且存储域名匹配时执行
    if (currentUrl === "lotto.sina.cn" && currentDomain === "lotto.sina.cn") {
      const selector = createNumberSelector();

      // 创建自定义配置的数字选择器
      const customSelector = createNumberSelector({
        title: "自定义数字选择器",
        row1: [1, 2, 3, null, null, 12, 13, 14, null, null, 23, 24, 25],
        row2: [4, 5, 6, 10, 11, 15, 16, 17, 21, 22, 26, 27, 28, 32, 33],
        row3: [7, 8, 9, null, null, 18, 19, 20, null, null, 29, 30, 31], // 可选，会自动计算
      });
      // 应用灰度样式
      document.getElementById("zst").style.filter = isGray
        ? "grayscale(100%)"
        : "";
      document.body.style.maxWidth = "unset";
      hideKl8();
      document.getElementById("chartsTable").style.width = "100%";
      if (document.getElementsByClassName("zst_table")?.[1]) {
        document.getElementsByClassName("zst_table")[1].style.width = "100%";
      }
      setNone("wrapper");
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
    document.getElementById("zst").style.filter = message.isGray
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

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "openPanel") {
    const { currentDomain, isGray } = await getStorageData([
      "currentDomain",
      "isGray",
    ]);
    if (currentDomain === "lotto.sina.cn") {
      const selector = createNumberSelector();

      // 创建自定义配置的数字选择器
      const customSelector = createNumberSelector({
        title: "自定义数字选择器",
        row1: [1, 2, 3, null, null, 12, 13, 14, null, null, 23, 24, 25],
        row2: [4, 5, 6, 10, 11, 15, 16, 17, 21, 22, 26, 27, 28, 32, 33],
        row3: [7, 8, 9, null, null, 18, 19, 20, null, null, 29, 30, 31], // 可选，会自动计算
      });
    }
  }
});
