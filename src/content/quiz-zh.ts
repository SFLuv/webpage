import { quizEn, type QuizContent, type QuizSection } from "./quiz";

/*
 * Chinese edition of the SFLuv quiz for Cantonese speakers, served at
 * /sfluv-quiz/zh. Written in Traditional Chinese, the standard written form
 * for San Francisco's Cantonese-speaking community.
 *
 * Same questions, answer keys and order as the English quiz in ./quiz, so the
 * three editions can never score differently: only the words change.
 */

const sectionsZh: QuizSection[] = [
  {
    id: "tenderloin",
    title: "第一部分：田德隆區",
    lead: "開始之前：認識田德隆區",
    facts: [
      {
        summary: "田德隆區是甚麼地方？",
        body: "田德隆區（Tenderloin）是三藩市最常被誤解的社區之一。它首先是一個住宅社區。約百分之三十的居民是兒童，是全市兒童比例最高的地區之一。這代表有數以千計的家庭以這個社區為家。"
      },
      {
        summary: "社會運動與文化領導的歷史",
        body: "田德隆區有著悠久的社會運動和文化領導歷史。1966 年的 Compton’s Cafeteria 起義就在這裡發生，是美國最早有組織的 LGBTQ 抗爭行動之一。長久以來，這裡一直是移民社群、勞工家庭、藝術家和社區組織者的家園。"
      },
      {
        summary: "小商戶為何重要",
        body: "小商戶在這裡十分重要。社區內有許多家庭經營的餐廳、雜貨店、髮型屋、維修店、咖啡店和文化場所。在整個三藩市，小商戶佔所有商業機構超過百分之九十五，並提供了相當大部分的本地就業機會。"
      },
      {
        summary: "地理位置與經濟聯繫",
        body: "在地理上，田德隆區位置十分重要。它毗鄰市政中心（Civic Center），並直接連接市場街（Market Street），步行即可到達聯合廣場（Union Square）、金融區和劇院區。"
      }
    ],
    questions: [
      {
        number: 1,
        prompt: "三藩市哪一個社區的兒童比例最高？",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "Noe Valley" },
          { value: "B", label: "日落區（The Sunset）" },
          { value: "C", label: "田德隆區（The Tenderloin）" },
          { value: "D", label: "太平洋高地（Pacific Heights）" }
        ]
      },
      {
        number: 2,
        prompt: "田德隆區居民中，兒童大約佔多少比例？",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "約百分之五" },
          { value: "B", label: "約百分之十五" },
          { value: "C", label: "約百分之三十" },
          { value: "D", label: "約百分之五十" }
        ]
      },
      {
        number: 3,
        prompt: "田德隆區以甚麼而聞名？",
        answerType: "single",
        correct: ["D"],
        options: [
          { value: "A", label: "豐富的社會運動和社會公義歷史" },
          { value: "B", label: "充滿活力的小商戶和移民社群" },
          { value: "C", label: "具歷史意義的 LGBTQ 組織運動和文化領導" },
          { value: "D", label: "以上皆是" }
        ]
      },
      {
        number: 4,
        prompt: "為甚麼支持田德隆區的小商戶特別重要？",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "因為它令樓價上升得比全市其他地方更快" },
          { value: "B", label: "因為它主要令遊客和會議參加者受惠" },
          {
            value: "C",
            label: "因為小商戶創造本地就業，為家庭保留就近的日常服務，並有助建立更安全、更穩定的社區經濟"
          },
          { value: "D", label: "因為它能降低全市的租金" },
          { value: "E", label: "因為它可以取代公共服務和非牟利機構" }
        ]
      },
      {
        number: 5,
        prompt: "為甚麼田德隆區對三藩市的經濟特別重要？",
        answerType: "single",
        correct: ["E"],
        options: [
          { value: "A", label: "它毗鄰市政中心" },
          { value: "B", label: "它連接市場街" },
          { value: "C", label: "它鄰近聯合廣場、金融區和劇院區" },
          { value: "D", label: "它連接多個主要的經濟和文化中心" },
          { value: "E", label: "以上皆是" }
        ]
      }
    ]
  },
  {
    id: "community-finance",
    title: "第二部分：社區金融",
    lead: "開始之前：社區如何重新思考金錢",
    facts: [
      {
        summary: "美國的「自由銀行時代」",
        body: "在十九世紀美國的「自由銀行時代」，數以千計在地方註冊的銀行各自發行自己的鈔票。"
      },
      {
        summary: "大蕭條時期沃格爾的地方貨幣",
        body: "1932 年大蕭條期間，奧地利沃格爾鎮（Wörgl）發行了一種「印花券」貨幣。據報導，一年之內失業率下降了約百分之二十五，之後計劃被奧地利中央銀行叫停。"
      },
      {
        summary: "撒丁島的 Sardex",
        body: "2008 年全球金融危機之後，Sardex 於 2009 年在意大利撒丁島成立。它是一個互助信用網絡，近年每年促成超過五千萬歐元的交易。"
      },
      {
        summary: "比特幣與 2008 年金融危機",
        body: "比特幣同樣在 2008 年金融危機之後，於 2009 年推出。它被設計為一種無需銀行或中央機構也能運作的去中心化數碼貨幣。它推出的時機反映了社會對金融危機的廣泛回應：當時許多人對傳統金融機構和由政府管理的法定貨幣制度失去信任。加密貨幣的出現，部分是為了建立透明、以規則為本、並且不受傳統貨幣制度可能出現的失誤所影響的金融網絡。"
      },
      {
        summary: "甚麼是穩定幣",
        body: "穩定幣（stablecoin）是設計成保持價值穩定的數碼代幣。PayPal、Circle 等大型金融科技公司發行的穩定幣，以美元或美國短期國庫證券一比一作為儲備支持。"
      },
      {
        summary: "危機中的穩定幣",
        body: "2022 年，當傳統銀行系統受到干擾時，價值數以百萬美元計的穩定幣捐款被送往烏克蘭。"
      },
      {
        summary: "政府對區塊鏈工具的應用",
        body: "加州曾試行以區塊鏈工具管理車輛業權紀錄。卑詩省曾探索以區塊鏈支援的數碼身份系統。愛沙尼亞則使用受區塊鏈啟發的技術保護政府紀錄。"
      }
    ],
    questions: [
      {
        number: 6,
        prompt: "以下哪些是真實存在的地方或社區貨幣例子？",
        answerType: "single",
        correct: ["E"],
        options: [
          { value: "A", label: "沃格爾印花券" },
          { value: "B", label: "Sardex" },
          { value: "C", label: "私人發行的美國鈔票" },
          { value: "D", label: "大富翁（Monopoly）遊戲錢" },
          { value: "E", label: "除 D 以外全部" }
        ]
      },
      {
        number: 7,
        prompt: "穩定幣是：",
        answerType: "single",
        correct: ["B"],
        options: [
          { value: "A", label: "一種用鋼製造的硬幣" },
          { value: "B", label: "一種設計成保持價值穩定、並有儲備支持的加密貨幣" },
          { value: "C", label: "一種像比特幣一樣價格波動的加密貨幣" },
          { value: "D", label: "一件博物館文物" }
        ]
      },
      {
        number: 8,
        prompt: "區塊鏈技術可以用於以下哪些用途？",
        answerType: "single",
        correct: ["D"],
        options: [
          { value: "A", label: "加密貨幣" },
          { value: "B", label: "安全的數碼身份系統" },
          { value: "C", label: "透明的公共紀錄和登記冊" },
          { value: "D", label: "以上皆是" }
        ]
      },
      {
        number: 9,
        prompt: "哪些政府已經在使用或探索區塊鏈技術？請選出所有適用的答案。",
        answerType: "multiple",
        correct: ["A", "B", "C"],
        options: [
          { value: "A", label: "加州" },
          { value: "B", label: "卑詩省（British Columbia）" },
          { value: "C", label: "愛沙尼亞" },
          { value: "D", label: "以上皆不是" }
        ]
      },
      {
        number: 10,
        prompt: "區塊鏈和穩定幣被用來向烏克蘭送出援助，是因為它們讓機構可以：",
        answerType: "multiple",
        correct: ["A", "B"],
        options: [
          { value: "A", label: "進行快速、透明的跨境轉賬" },
          { value: "B", label: "減少對傳統銀行中介的依賴" },
          { value: "C", label: "以會升值的資產形式送出援助，因為穩定幣通常會升值" },
          { value: "D", label: "無需上網" }
        ]
      }
    ]
  },
  {
    id: "sfluv",
    title: "第三部分：SFLuv",
    lead: "開始之前：SFLuv 是甚麼？",
    facts: [
      {
        summary: "社區金融的在地應用",
        body: "SFLuv 建基於社區金融的悠久歷史，並運用現代工具在本地實踐。"
      },
      {
        summary: "SFLuv 的使命與重點",
        body: "SFLuv 是一個 501(c)(3) 慈善機構，以一種數碼社區貨幣支持它的雙重使命：營造社區空間（例如壁畫和園藝等小型改善工程），以及在資源不足的社區推動經濟發展。目前只專注於田德隆區。"
      },
      {
        summary: "如何賺取 SFLuv",
        body: "壁畫藝術家和其他社區「改善者」（Improvers），例如園藝工人、藝術家和小型承辦商，可以透過工作賺取 SFLuv。義工則會收到少量 SFLuv 作為感謝禮。"
      },
      {
        summary: "包裝穩定幣的基本概念",
        body: "在技術上，SFLuv 是一種「包裝穩定幣」（wrapped stablecoin），意思是它使用大型機構發行的穩定幣，再為它們加入額外的權限和規則。"
      },
      {
        summary: "SFLuv 可以在哪裡使用",
        body: "SFLuv 只可以在參與計劃的本地商戶使用，而且只有經批准的商戶才會獲得將代幣兌換回美元的工具。"
      },
      {
        summary: "長遠的管治目標",
        body: "長遠而言，SFLuv 希望提供工具，讓商戶和居民可以運用社區基金，提出並投票支持對社區有益的項目。"
      }
    ],
    questions: [
      {
        number: 11,
        prompt: "SFLuv 是甚麼？請選出所有適用的答案。",
        answerType: "multiple",
        correct: ["B", "C"],
        options: [
          { value: "A", label: "一個社區藝術節" },
          { value: "B", label: "一種數碼社區貨幣" },
          { value: "C", label: "一個專注於營造社區空間和經濟發展的 501(c)(3) 慈善機構" },
          { value: "D", label: "一項市政府稅務抵免" },
          { value: "E", label: "一張會員積分卡" }
        ]
      },
      {
        number: 12,
        prompt: "SFLuv 是「包裝穩定幣」是甚麼意思？",
        answerType: "single",
        correct: ["B"],
        options: [
          { value: "A", label: "它憑空製造金錢" },
          {
            value: "B",
            label: "它使用大型機構發行的穩定幣，並加入權限設定，令它們只能在本地使用"
          },
          { value: "C", label: "它的價格比比特幣更波動" },
          { value: "D", label: "它沒有真實資產支持" }
        ]
      },
      {
        number: 13,
        prompt: "人們如何賺取 SFLuv？",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "在加密貨幣交易所購買" },
          { value: "B", label: "贏得問答比賽" },
          { value: "C", label: "做義工和改善社區" },
          { value: "D", label: "繳交泊車告票罰款" }
        ]
      },
      {
        number: 14,
        prompt: "SFLuv 可以在哪裡使用？",
        answerType: "single",
        correct: ["B"],
        options: [
          { value: "A", label: "世界任何地方" },
          { value: "B", label: "參與計劃的本地商戶" },
          { value: "C", label: "Amazon" },
          { value: "D", label: "市政廳" }
        ]
      },
      {
        number: 15,
        prompt: "SFLuv 與一般的會員積分計劃有何不同？",
        answerType: "single",
        correct: ["D"],
        options: [
          { value: "A", label: "它透過社區行動賺取" },
          { value: "B", label: "它令社區商戶更強大" },
          { value: "C", label: "它支持營造社區空間的項目" },
          { value: "D", label: "以上皆是" }
        ]
      },
      {
        number: 16,
        prompt: "SFLuv 的其中一個長遠目標是甚麼？",
        answerType: "single",
        correct: ["C"],
        options: [
          { value: "A", label: "取代美元" },
          { value: "B", label: "成立對沖基金" },
          { value: "C", label: "提供工具，讓居民和商戶提出並投票選出社區項目" },
          { value: "D", label: "取消義工工作" }
        ]
      }
    ]
  }
];

export const quizZh: QuizContent = {
  title: "SFLuv 社區貨幣問答",
  subtitle: "Grow the Luv 版",
  description: "Grow the Luv 版：認識田德隆區、社區金融和 SFLuv。",
  finish: {
    title: "恭喜您完成「認識 SFLuv」問答！",
    body: "請向您的 SFLuv 代表出示此畫面，領取您的感謝禮（Gratitude Perks）。",
    logo: { ...quizEn.finish.logo, alt: "SFLuv 標誌" }
  },
  ui: {
    selectAll: "請選出所有適用的答案。",
    submitAnswer: "提交答案",
    chooseFirst: "請先選擇一個答案再提交。",
    correct: "正確。",
    tryAgain: "不太對，請再試一次。",
    previousSection: "上一部分",
    nextSection: "下一部分",
    submitQuiz: "提交問答",
    allCorrect: "所有答案都正確，正在提交問答……",
    blockedUnanswered: "請先完成第 {numbers} 題再提交。",
    blockedIncorrect: "請先更正第 {numbers} 題再提交。"
  },
  sections: sectionsZh
};
