document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const btn = document.getElementById("switchThemeButton");

  // 获取当前存储状态
  const getCurrentStorage = async () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(["currentDomain"], (store) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(store);
        }
      });
    });
  };

  const updateButtonText = async () => {
    const store = await getCurrentStorage();
    if (store.currentDomain === "lotto.sina.cn") {
      btn.innerText = "切换到红色";
    } else {
      btn.innerText = "切换到灰色";
    }
  };

  await updateButtonText();

  btn.addEventListener("click", async () => {
    const currentDomain = new URL(tab.url).hostname;
    const store = await getCurrentStorage();

    if (store.currentDomain) {
      btn.innerText = "切换到灰色";
      await new Promise((resolve, reject) => {
        chrome.storage.local.remove("currentDomain", () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    } else {
      btn.innerText = "切换到红色";
      await new Promise((resolve, reject) => {
        chrome.storage.local.set({ currentDomain }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    }

    const updatedStore = await getCurrentStorage();
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: "switchTheme",
      isGray: !!updatedStore.currentDomain,
    });

    if (response) {
      console.log(888, response);
    }
  });
});
