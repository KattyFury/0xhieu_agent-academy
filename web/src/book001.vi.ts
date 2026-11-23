// Book 001, Vietnamese display text. Prompts stay English (the agent runs them; verified in English).
import type { Day } from "./book001";

type ViDay = { title: string; paragraphs: string[]; flow: string[]; remember: string[]; practiceTitle: string; steps: { title: string; text: string }[]; recordText?: string };

export const book001Vi = {
  title: "Học Binance Agentic Wallet",
  days: [
    {
      title: "Làm quen Agentic Wallet",
      paragraphs: [
        "**Agentic Wallet** là một ví riêng mà AI agent của bạn dùng thay bạn. Bạn hỏi bằng lời thường, agent sẽ xem số dư, lấy báo giá và chuẩn bị giao dịch.",
        "**Bạn đặt giới hạn.** Hạn mức ngày, Developer Mode và các quy tắc an toàn nằm trong app Binance, và khoá của ví không bao giờ rời Binance.",
        "**Agent ID** là tên .ai của bạn, ví dụ you.ai. Đó là tên gắn với ví này.",
      ],
      flow: ["Bạn hỏi", "Agent chuẩn bị", "Xem trước", "Ví kiểm tra quy tắc", "Ví ký"],
      remember: ["Agent chỉ làm trong quy tắc của ví.", "Giới hạn và an toàn chỉnh trong app Binance.", "Biết agent được làm gì trước khi nó làm."],
      practiceTitle: "Chuẩn bị ví",
      steps: [
        { title: "Bật Developer Mode", text: "App Binance: Agentic Wallet, Cài đặt. Cần để **ghi nhận bài**; kéo dài 7 ngày, dùng là được gia hạn." },
        { title: "Gặp ví của bạn", text: "Dán vào Claude Code, Codex hoặc Binance AI Pro." },
      ],
      recordText: "Bản ghi nhỏ on-chain về tiến độ, **không phải lệnh mua bán**. Chỉ gõ confirm khi xem trước khớp.",
    },
    {
      title: "Một ví, nhiều mạng",
      paragraphs: [
        "Một **địa chỉ EVM** dùng được trên 6 mạng: BNB Smart Chain, Ethereum, Base, Arbitrum, Polygon và Robinhood Chain. **Solana** có địa chỉ riêng.",
        "Mỗi mạng giữ **số dư riêng**. USDT trên Base không trả được gì trên BNB Smart Chain, nên luôn kiểm tra mạng trước.",
        "**Gas** là phí mạng thu để xử lý giao dịch. Có mức thấp, vừa, cao: càng cao càng nhanh và càng đắt. Trên BNB Smart Chain, gas trả bằng BNB.",
      ],
      flow: ["Chọn mạng", "Xem số dư", "Xem gas", "Rồi mới làm"],
      remember: ["Một địa chỉ EVM, thêm một cho Solana.", "Số dư tách theo từng mạng.", "Đúng mạng trước, rồi mới làm."],
      practiceTitle: "Vẽ bản đồ ví",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này, rồi so với app Binance." }],
    },
    {
      title: "Agent giúp bạn giao dịch thế nào",
      paragraphs: [
        "**Báo giá** là ước tính, không phải lời hứa. Ví dụ ngày 23/11: 0.001 BNB được khoảng 0.56 USDT. Giá có thể đổi trước khi swap chạy.",
        "**Slippage** là mức giá tối đa được lệch bất lợi trước khi swap thất bại. Mặc định là auto. **Price impact** là mức giá do chính lệnh của bạn đẩy đi, lớn hơn ở pool nhỏ.",
        "**Lệnh giới hạn** chờ đến khi giá chạm mức bạn đặt rồi mới khớp. Dùng được trên BNB Smart Chain và Solana.",
      ],
      flow: ["Lấy báo giá", "Đọc số lượng", "Xem slippage", "Quyết định"],
      remember: ["Báo giá chỉ là ước tính.", "Slippage là mức lệch bạn chấp nhận.", "Lệnh giới hạn chờ giá của bạn."],
      practiceTitle: "Đọc báo giá, không giao dịch",
      steps: [{ title: "Xin báo giá", text: "Dán đoạn này. Nó chỉ hỏi giá." }],
    },
    {
      title: "Khám phá DeFi",
      paragraphs: [
        "Ứng dụng DeFi là các smart contract. Earn trả lãi khi bạn gửi; Liquidity Pool dùng token của bạn để giao dịch. **TVL** là tiền nằm bên trong; **APY** là lợi suất năm.",
        "Ví dụ giả định: App A có $100M, lãi 5%. App B có $500K, lãi 3,000%. Không số nào chứng minh an toàn, nhưng hãy hỏi B khó hơn: **lợi suất đó từ đâu ra?**",
        "**Rủi ro:** lỗi contract, khó rút, giá token giảm và lợi suất dừng. APY của một app là pool tốt nhất của nó, và thay đổi liên tục.",
      ],
      flow: ["Liệt kê app", "Đọc TVL và APY", "Hỏi vì sao", "Bạn quyết định"],
      remember: ["APY cao không phải tiền miễn phí.", "TVL cho thấy quy mô, không phải độ an toàn.", "Gửi tiền là quyết định của bạn."],
      practiceTitle: "So sánh 2 app",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này. Nó chỉ tra cứu." }],
    },
    {
      title: "Đọc thị trường, đừng chạy theo",
      paragraphs: [
        "**Leaderboard:** ai kiếm được tiền. **Signals:** chiến lược đang nói gì và trước đây làm ra sao. **Tracker:** ví lớn đang mua gì.",
        "Ngày 23/11: trader số 1 tuần trên BNB Smart Chain kiếm khoảng $35,000, **toàn bộ từ một token**. Kỹ năng, hay một lần may mắn?",
        "**Hãy hỏi:** bao nhiêu giao dịch? Bao nhiêu từ một token? Vài lần thắng chẳng chứng minh gì, backtest là quá khứ, và ví lớn mua không có nghĩa giá sẽ tăng.",
      ],
      flow: ["Ai thắng", "Thắng thế nào", "Bao lâu một lần", "Còn thiếu gì"],
      remember: ["Dữ liệu cho thấy quá khứ, không phải tương lai.", "Lãi từ một token là dấu hiệu cảnh báo.", "Kiểm chứng trước khi làm."],
      practiceTitle: "Chất vấn một top trader",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này và đọc xem dữ liệu không nói được điều gì." }],
    },
    {
      title: "Giới hạn của ví",
      paragraphs: [
        "Ví dụ: hạn mức ngày của bạn là $100 và agent đã dùng $40. **Còn lại $60**, kể cả khi bạn có $1,000. Agent không thể nâng lên $200. **Chỉ bạn làm được**, trong app Binance.",
        "DeFi, prediction market, thanh toán x402 và Developer Mode có **hạn mức riêng**. Chúng reset lúc **00:00 UTC**.",
        "Phiên đăng nhập hết sau một khoảng thời gian hoặc khi lâu không dùng. Developer Mode kéo dài 7 ngày, mỗi lần dùng được gia hạn. Hai thứ **hết hạn riêng**.",
      ],
      flow: ["Bạn đặt quy tắc", "Agent đọc", "Agent làm trong giới hạn"],
      remember: ["Hạn mức còn lại không phải số dư.", "Mỗi loại có hạn mức riêng.", "Chỉ bạn đổi được quy tắc."],
      practiceTitle: "Đọc quy tắc của bạn",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này, rồi mở Cài đặt trong app để so." }],
    },
    {
      title: "Giữ an toàn",
      paragraphs: [
        "Trước mỗi lần đồng ý, **kiểm tra 4 điều**: tiền đi đâu, token nào và bao nhiêu, có cấp quyền gì không, và có cảnh báo không.",
        "Tình huống: phần xem trước hiện một contract bạn không biết và quyền dùng token không giới hạn. **Dừng lại. Đừng confirm** khi chưa biết contract đó là gì.",
        "Ví có thể tự từ chối giao dịch bị gắn cờ rủi ro cao, hoặc hỏi lại bạn trong app. Nó **không bắt được lệnh trông bình thường** mà bạn ra nhầm. **Không bao giờ chia sẻ** cụm từ khôi phục, mã QR đăng nhập hay mã ghép nối.",
      ],
      flow: ["Nơi nhận", "Số lượng", "Quyền cấp", "Cảnh báo"],
      remember: ["Contract lạ? Dừng lại.", "Quyền không giới hạn là quyền rất lớn.", "Không bao giờ chia sẻ mã đăng nhập."],
      practiceTitle: "Kiểm tra an toàn",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này. Nó không thay đổi gì." }],
      recordText: "Khi mọi trang của sách đã được ghi nhận, chứng chỉ được cấp ngay trong giao dịch đó.",
    },
  ] as ViDay[],
};

/** Day in the chosen language; prompts and numbers always come from the English source. */
export function localDay(d: Day, lang: "en" | "vi"): Day {
  if (lang === "en") return d;
  const v = book001Vi.days[d.day - 1];
  return {
    ...d, title: v.title,
    learn: { paragraphs: v.paragraphs, flow: v.flow, remember: v.remember },
    practice: { ...d.practice, title: v.practiceTitle, recordText: v.recordText, steps: d.practice.steps.map((s, i) => ({ ...s, ...v.steps[i] })) },
  };
}
