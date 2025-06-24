document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const btn = document.getElementById("switchThemeButton");
  const choosedBtn = document.getElementById("choosed");

  const targetDomain = "lotto.sina.cn"; // 固定目标域名

  // 获取当前存储状态（包含isGray和currentDomain）
  const getCurrentStorage = async () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(["currentDomain", "isGray"], (store) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          // 初始化默认值：首次访问设为非灰度模式
          resolve({
            currentDomain: store.currentDomain || targetDomain,
            isGray: store.isGray || false,
          });
        }
      });
    });
  };

  // 根据isGray状态更新按钮文本
  const updateButtonText = async (isGray) => {
    btn.innerText = isGray ? "切换到红色" : "切换到灰色";
  };

  // 初始化按钮状态
  const store = await getCurrentStorage();
  await updateButtonText(store.isGray);

  btn.addEventListener("click", async () => {
    const currentStore = await getCurrentStorage();
    const newIsGray = !currentStore.isGray; // 切换状态

    // 固定目标域名，仅更新isGray状态
    await new Promise((resolve, reject) => {
      chrome.storage.local.set(
        { currentDomain: targetDomain, isGray: newIsGray },
        () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        }
      );
    });

    // 发送包含最新isGray状态的消息
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: "switchTheme",
      isGray: newIsGray, // 直接传递新状态
    });

    // 更新按钮显示
    await updateButtonText(newIsGray);

    if (response) {
      console.log("主题切换成功", response);
    }
  });

  choosedBtn.addEventListener("click", async () => {
    chrome.tabs.sendMessage(tab.id, {
      action: "openPanel",
    });
  });
});
