# 綜合領域研習點餐

研習午餐訂購頁：民國 115 年 10 月 2 日。GitHub 儲存程式碼，Cloudflare Pages 提供公開網站與 Pages Functions，Cloudflare D1 保存跨裝置訂單。

## 功能

- 學員名單選擇及現場自行輸入姓名。
- 主餐、飲料各單選一項，附餐點圖片。
- 公開 API 只回傳品項統計，不回傳姓名或個別訂單。
- 管理頁 `/admin.html` 以 `ADMIN_TOKEN` 驗證後才能查看訂單。
- 送出後下載 PNG 點餐卡。
- QR 圖片會依部署網址產生；目前使用 QR Server 圖片端點，端點會收到公開網站網址。

## 部署架構

此專案不是 GitHub Pages 靜態部署：GitHub 保存原始碼，Cloudflare Pages 執行前端和 Functions，D1 負責雲端資料庫。單靠 GitHub Pages 無法執行本專案的訂單 API。

1. 將此資料夾內容推送至 GitHub 儲存庫。建議先設為 **Private**；Cloudflare Pages 可連接私有 GitHub 儲存庫。
2. 在 Cloudflare 建立 Pages 專案，連接此儲存庫。Framework preset 選 `None`，Build command 留空，Build output directory 設為 `.`。
3. 在 Cloudflare D1 建立資料庫，於資料庫 Console 執行 `schema.sql` 的 SQL。
4. 在 Pages 專案設定 `Settings → Functions → D1 database bindings`，binding name 設為 `DB`，並選取剛建立的資料庫。
5. 在 Pages 專案的環境變數／Secrets 設定 `ADMIN_TOKEN`。請自行建立一組長且隨機的密鑰；只輸入 Cloudflare Secret，勿提交至 GitHub 或貼在聊天中。
6. 重新部署後，確認公開首頁與 `/api/stats` 可用，再用 `https://<部署網域>/admin.html` 和管理密鑰登入管理端。

Cloudflare Pages Functions 會提供 `functions/api` 下的 API 路由。若 Functions 或 D1 尚未設定，公開頁仍可載入，但訂單送出與雲端統計無法使用。
