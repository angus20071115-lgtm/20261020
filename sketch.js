
let sports = []; // 儲存運動資料
let targets = []; // 儲存上方圖片卡片
let options = []; // 儲存下方名稱選項
let dragged = null; // 儲存目前拖曳的選項
let score = 0; // 儲存答對題數
let submitted = false; // 記錄是否已提交答案
let confetti = []; // 儲存彩紙動畫資料

function setup() { // 初始化遊戲
  createCanvas(windowWidth, windowHeight); // 建立全螢幕畫布
  textFont("sans-serif"); // 使用系統字型
  textAlign(CENTER, CENTER); // 設定文字置中
  initGame(); // 初始化遊戲資料
} // 結束 setup

function initGame() { // 建立或重新開始遊戲
  for (let t of targets) { // 清除先前建立的 GIF
    t.img.remove(); // 移除舊的圖片元素
  } // 結束舊圖片清除

  sports = [ // 設定六種運動與 GIF 來源
    { name: "足球", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Soccerball_current_event.gif" }, // 足球動畫
    { name: "籃球", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Dunk.gif" }, // 籃球灌籃動畫
    { name: "游泳", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Freestyle_swimming.gif" }, // 游泳動畫
    { name: "網球", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Beach_Ball_Motion.gif" }, // 球類活動動畫
    { name: "羽球", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Badminton-KKL-Animation-seitlich.gif" }, // 羽球動畫
    { name: "自行車", url: "https://commons.wikimedia.org/wiki/Special:FilePath/Biker_Animation.gif" } // 自行車動畫
  ]; // 結束運動資料設定

  targets = []; // 清空圖片卡片陣列
  options = []; // 清空名稱選項陣列
  confetti = []; // 清空彩紙
  score = 0; // 分數歸零
  submitted = false; // 設定為尚未提交
  dragged = null; // 清除拖曳狀態

  let shuffledSports = shuffle([...sports]); // 打亂圖片順序
  let cols = 3; // 每列放三張圖片
  let cardW = min(width * 0.25, 220); // 設定卡片寬度
  let cardH = min(height * 0.19, 140); // 設定卡片高度
  let gapX = (width - cols * cardW) / (cols + 1); // 計算水平間距
  let gapY = max(12, height * 0.025); // 設定垂直間距
  let startY = height * 0.23; // 設定圖片區起始高度

  for (let i = 0; i < shuffledSports.length; i++) { // 建立六張 GIF 卡片
    let col = i % cols; // 計算欄位
    let row = floor(i / cols); // 計算列數
    let x = gapX + col * (cardW + gapX) + cardW / 2; // 計算卡片水平中心
    let y = startY + row * (cardH + gapY) + cardH / 2; // 計算卡片垂直中心
    let img = createImg(shuffledSports[i].url, shuffledSports[i].name + "動畫"); // 建立瀏覽器原生 GIF 元素
    img.size(cardW - 20, cardH - 20); // 設定 GIF 尺寸
    img.position(x - cardW / 2 + 10, y - cardH / 2 + 10); // 將 GIF 放在卡片內
    img.style("object-fit", "contain"); // 保持 GIF 原始比例
    img.style("pointer-events", "none"); // 讓滑鼠事件可以穿過 GIF
    img.style("z-index", "1"); // 設定 GIF 顯示層級
    targets.push({ name: shuffledSports[i].name, x: x, y: y, w: cardW, h: cardH, img: img, matched: false }); // 儲存卡片資料
  } // 結束圖片卡片建立

  let shuffledNames = shuffle([...sports]); // 打亂運動名稱順序
  let optionW = min(width * 0.14, 145); // 設定選項寬度
  let optionH = 48; // 設定選項高度
  let optionGap = 10; // 設定選項間距
  let totalW = shuffledNames.length * optionW + (shuffledNames.length - 1) * optionGap; // 計算選項總寬度
  let startX = (width - totalW) / 2 + optionW / 2; // 計算第一個選項的位置
  let optionY = height * 0.79; // 設定選項垂直位置

  for (let i = 0; i < shuffledNames.length; i++) { // 建立六個名稱選項
    let x = startX + i * (optionW + optionGap); // 計算選項水平中心
    options.push({ name: shuffledNames[i].name, x: x, y: optionY, w: optionW, h: optionH, originalX: x, originalY: optionY, matched: false }); // 儲存選項資料
  } // 結束選項建立
} // 結束 initGame

function draw() { // 每一影格繪製畫面
  background("#F1F6FC"); // 設定背景顏色
  drawHeader(); // 繪製標題與說明
  drawTargets(); // 繪製圖片卡片邊框
  drawOptions(); // 繪製名稱選項
  drawSubmitButton(); // 繪製提交按鈕
  drawConfetti(); // 繪製彩紙動畫
} // 結束 draw

function drawHeader() { // 繪製遊戲標題
  noStroke(); // 關閉文字外框
  fill("#203A5B"); // 設定標題顏色
  textSize(min(34, width * 0.045)); // 設定標題大小
  text("運動名詞連連看", width / 2, height * 0.065); // 顯示遊戲標題

  fill("#52677F"); // 設定說明文字顏色
  textSize(min(17, width * 0.025)); // 設定說明文字大小
  text("將下方的運動名稱拖曳到上方正確的動態圖片", width / 2, height * 0.135); // 顯示操作說明

  if (submitted) { // 如果已經提交答案
    fill("#203A5B"); // 設定分數顏色
    textSize(20); // 設定分數大小
    text("答對 " + score + " / " + sports.length + " 題", width / 2, height * 0.18); // 顯示分數
  } // 結束提交狀態判斷
} // 結束 drawHeader

function drawTargets() { // 繪製上方圖片卡片邊框
  for (let t of targets) { // 逐一繪製卡片
    rectMode(CENTER); // 設定矩形以中心定位
    stroke(t.matched ? "#35A56A" : "#CBD8E6"); // 設定配對狀態邊框顏色
    strokeWeight(t.matched ? 4 : 2); // 設定邊框粗細
    fill("#FFFFFF"); // 設定卡片背景
    rect(t.x, t.y, t.w, t.h, 14); // 繪製圓角卡片
  } // 結束卡片繪製
} // 結束 drawTargets

function drawOptions() { // 繪製下方名稱選項
  for (let o of options) { // 逐一繪製名稱選項
    rectMode(CENTER); // 設定矩形以中心定位
    stroke(o.matched ? "#35A56A" : "#91A8C0"); // 設定邊框顏色
    strokeWeight(2); // 設定邊框粗細
    fill(o.matched ? "#D7F5E4" : "#FFFFFF"); // 設定卡片背景
    rect(o.x, o.y, o.w, o.h, 12); // 繪製名稱卡片
    noStroke(); // 關閉文字外框
    fill("#26384D"); // 設定名稱文字顏色
    textSize(min(18, o.w * 0.16)); // 設定名稱字體大小
    text(o.name, o.x, o.y); // 顯示運動名稱
  } // 結束選項繪製
} // 結束 drawOptions

function drawSubmitButton() { // 繪製提交按鈕
  let bx = width / 2; // 設定按鈕水平中心
  let by = height * 0.92; // 設定按鈕垂直中心
  rectMode(CENTER); // 設定矩形以中心定位
  noStroke(); // 關閉按鈕外框
  fill(submitted ? "#64748B" : "#3478C8"); // 設定按鈕顏色
  rect(bx, by, 160, 44, 12); // 繪製圓角按鈕
  fill("#FFFFFF"); // 設定按鈕文字顏色
  textSize(17); // 設定按鈕文字大小
  text(submitted ? "重新開始（R）" : "提交答案", bx, by); // 顯示按鈕文字
} // 結束 drawSubmitButton

function mousePressed() { // 處理滑鼠按下事件
  if (isOverSubmitButton()) { // 判斷是否點擊按鈕
    if (submitted) { // 如果已提交答案
      initGame(); // 重新開始
    } else { // 如果尚未提交
      submitAnswers(); // 計算分數
    } // 結束提交判斷
    return; // 結束事件
  } // 結束按鈕判斷

  if (submitted) return; // 提交後禁止拖曳

  for (let i = options.length - 1; i >= 0; i--) { // 從最上層選項開始檢查
    let o = options[i]; // 取得目前選項
    if (!o.matched && mouseX >= o.x - o.w / 2 && mouseX <= o.x + o.w / 2 && mouseY >= o.y - o.h / 2 && mouseY <= o.y + o.h / 2) { // 判斷是否點擊選項
      dragged = o; // 設定目前拖曳項目
      break; // 停止搜尋
    } // 結束選項判斷
  } // 結束選項搜尋
} // 結束 mousePressed

function mouseDragged() { // 處理滑鼠拖曳
  if (dragged && !submitted) { // 確認有選項正在拖曳
    dragged.x = mouseX; // 更新水平位置
    dragged.y = mouseY; // 更新垂直位置
  } // 結束拖曳判斷
} // 結束 mouseDragged

function mouseReleased() { // 處理滑鼠放開
  if (!dragged || submitted) { // 判斷是否有拖曳項目
    dragged = null; // 清除拖曳狀態
    return; // 結束事件
  } // 結束拖曳判斷

  for (let t of targets) { // 檢查每張圖片卡片
    if (mouseX >= t.x - t.w / 2 && mouseX <= t.x + t.w / 2 && mouseY >= t.y - t.h / 2 && mouseY <= t.y + t.h / 2) { // 判斷是否放在卡片上
      if (dragged.name === t.name && !t.matched) { // 判斷名稱是否正確
        dragged.matched = true; // 標記名稱已配對
        t.matched = true; // 標記圖片已配對
      } // 結束正確配對判斷
      break; // 停止搜尋
    } // 結束卡片範圍判斷
  } // 結束圖片檢查

  dragged.x = dragged.originalX; // 將選項放回原位
  dragged.y = dragged.originalY; // 將選項放回原位
  dragged = null; // 清除拖曳狀態
} // 結束 mouseReleased

function submitAnswers() { // 提交答案
  score = options.filter(o => o.matched).length; // 計算配對成功題數
  submitted = true; // 設定為已提交

  if (score / sports.length > 0.6) { // 判斷正確率是否大於百分之六十
    for (let i = 0; i < 100; i++) { // 建立一百個彩紙粒子
      confetti.push({ x: random(width), y: random(-height, 0), speed: random(2, 6), size: random(5, 12), c: color(random(255), random(255), random(255)) }); // 設定彩紙資料
    } // 結束彩紙建立
  } // 結束正確率判斷
} // 結束 submitAnswers

function drawConfetti() { // 繪製彩紙動畫
  for (let c of confetti) { // 逐一繪製彩紙
    noStroke(); // 關閉彩紙外框
    fill(c.c); // 設定彩紙顏色
    rect(c.x, c.y, c.size, c.size, 2); // 繪製彩紙方塊
    c.y += c.speed; // 更新垂直位置
    c.x += sin(c.y * 0.02) * 1.5; // 讓彩紙左右飄動
    if (c.y > height) { // 如果彩紙落出畫面
      c.y = random(-100, -10); // 將彩紙移回上方
      c.x = random(width); // 重新設定水平位置
    } // 結束彩紙重設
  } // 結束彩紙繪製
} // 結束 drawConfetti

function isOverSubmitButton() { // 判斷是否點擊提交按鈕
  return mouseX >= width / 2 - 80 && mouseX <= width / 2 + 80 && mouseY >= height * 0.92 - 22 && mouseY <= height * 0.92 + 22; // 回傳按鈕範圍
} // 結束 isOverSubmitButton

function shuffle(array) { // 隨機打亂陣列
  for (let i = array.length - 1; i > 0; i--) { // 從最後一個元素往前處理
    let j = floor(random(i + 1)); // 隨機選取交換位置
    [array[i], array[j]] = [array[j], array[i]]; // 交換兩個元素
  } // 結束打亂迴圈
  return array; // 回傳打亂後的陣列
} // 結束 shuffle

function keyPressed() { // 處理鍵盤按鍵
  if (key === "r" || key === "R") { // 判斷是否按下 R
    initGame(); // 重新開始遊戲
  } // 結束按鍵判斷
} // 結束 keyPressed

function windowResized() { // 處理視窗大小改變
  resizeCanvas(windowWidth, windowHeight); // 調整畫布尺寸
  initGame(); // 重新排列卡片
} // 結束 windowResized
