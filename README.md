# 基督教協同高級中學 創校六十週年紀念網站（1967–2027）

財團法人臺灣省嘉義縣私立協同高級中學（Concordia Middle & High School）創校六十週年靜態紀念網站，專為 **GitHub Pages** 設計，採用純 HTML / CSS / JavaScript，無須建置工具即可修改與部署。

- 協同中學官方網站：[www.cmsh.cyc.edu.tw](https://www.cmsh.cyc.edu.tw/)
- 校訓：**協力同心** ｜ 辦學方針：**榮神益人** ｜ 學校願景：**i-Least 僕人式領袖**

## 網站特色

- **60 週年主視覺與即時倒數**：倒數至 2027 年 6 月 26 日創校六十週年紀念日（可自訂目標日期）。
- **緣起與校長勉勵**：收錄創校精神、三大辦學核心與黃淵泰校長勉勵。
- **一甲子校史互動時間軸**：支援依時期篩選（草創奠基、深耕茁壯、半世紀里程碑、迎向一甲子）。
- **60 週年系列活動與行事曆下載**：支援依類別篩選，並可一鍵下載 `.ics` 檔案加入 Google / Apple 行事曆。
- **協同校歌與校園特色**：完整收錄協同校歌歌詞與三大辦學特色。
- **協同人 60 週年祝福牆**：支援即時撰寫並張貼祝福留言（儲存在瀏覽器 `localStorage`）。
- **RWD 響應式與無障礙設計**：支援桌機、平板與手機瀏覽。

## 專案結構

```text
cmsh-60th-anniversary/
├── index.html                        # 網站主頁
├── css/styles.css                    # 典雅深藍・暖金・象牙白視覺設計系統
├── js/
│   ├── data.js                       # 倒數日期、校史、活動與祝福牆初始資料（維護首選）
│   └── main.js                       # 倒數計時、篩選互動、行事曆下載、祝福牆邏輯
├── assets/images/
│   ├── emblem-60.svg                 # 60 週年紀念向量徽章
│   ├── hero-campus.jpg               # 主視覺晨曦校園插畫
│   └── heritage-hall.jpg             # 書院人文插畫
├── .github/workflows/deploy.yml      # GitHub Pages 自動部署設定
└── .nojekyll                         # 告知 GitHub Pages 直接提供靜態檔案
```

## 如何更新內容

1. **修改倒數日期、校史事件、活動時程或預設祝福**：直接編輯 `js/data.js`。
2. **更換實景照片**：將新照片取代 `assets/images/hero-campus.jpg` 或 `assets/images/heritage-hall.jpg`（建議維持 16:9 比例與適當檔案大小）。
3. **本機預覽**：在專案目錄執行 `python3 -m http.server 8080`，於瀏覽器開啟 `http://localhost:8080`。

## 部署至 GitHub Pages

```bash
# 1. 登入 GitHub CLI
gh auth login

# 2. 建立公開 Repository 並推送（可自訂儲存庫名稱）
gh repo create cmsh-60th-anniversary --public --source=. --remote=origin --push
```

推送完成後，前往 GitHub Repository 的 **Settings → Pages**，將 **Source** 設為 **GitHub Actions**，等待約 1 分鐘即可透過 `https://<您的帳號>.github.io/cmsh-60th-anniversary/` 瀏覽網站！
