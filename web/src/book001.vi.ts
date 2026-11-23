// Book #1, Vietnamese display text (owner's v2, ELI12). Same order as book001.days. Prompts are Vietnamese too (owner, 2026-11-23).
import { book001, type Day } from "./book001";

type ViDay = { title: string; goal: string; paragraphs: string[]; points?: string[]; remember: string[]; practiceTitle: string; riskText?: string; steps: { title: string; text: string; prompt?: string }[]; check?: string; ifNot?: string; recordText?: string };

export const book001Vi = {
  title: "Học Binance Agentic Wallet",
  days: [
    {
      title: "Binance Agentic Wallet là gì?",
      goal: "Hiểu nó làm gì trước khi cài.",
      paragraphs: [],
      points: [
        "**AI dùng ví này giúp bạn**. Cứ nhờ, ví dụ “xem số dư”.",
        "Giống **thẻ có hạn mức mỗi ngày**. **Bạn** đặt hạn mức trong app Binance.",
        "AI **không bao giờ cầm chìa khoá**. Chìa được chia nhỏ, giữ an toàn (**MPC Keyless**).",
      ],
      remember: [],
      practiceTitle: "Tự kiểm tra",
      steps: [
        { title: "AI có lấy chìa khoá Binance Agentic Wallet của bạn ra được không?", text: "Không. Chìa khoá không lấy ra được." },
        { title: "Ai đổi được hạn mức mỗi ngày?", text: "Chỉ bạn, trong app Binance. AI chỉ đọc được." },
        { title: "Đăng xuất thì sao?", text: "AI mất quyền dùng Binance Agentic Wallet của bạn." },
      ],
    },
    {
      title: "Địa chỉ ví của bạn",
      goal: "Tìm địa chỉ ví. Hiểu vì sao chia sẻ được an toàn.",
      paragraphs: [],
      points: [
        "Địa chỉ giống **số tài khoản ngân hàng**. Người khác gửi vào được, **không lấy ra** được. Nên **chia sẻ là an toàn**.",
        "Một **địa chỉ EVM** dùng cho BNB Smart Chain, Ethereum, Base… **Solana** có địa chỉ riêng.",
        "Mạng giống **các ngân hàng khác nhau**. Nhầm mạng có thể mất tiền. **Luôn kiểm tra mạng.**",
      ],
      remember: [],
      practiceTitle: "Tìm địa chỉ của bạn",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: cho tôi xem địa chỉ ví trên mọi mạng được hỗ trợ, cho biết những mạng nào dùng chung một địa chỉ, và trình bày thành một bảng nhỏ. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào." }],
      check: "Một bảng có một địa chỉ EVM dùng chung và một địa chỉ Solana. So với màn hình Agentic Wallet trong app Binance.",
    },
    {
      title: "Số dư, lịch sử và phí gas",
      goal: "Xem bạn đang giữ gì, đã làm gì và phí hôm nay.",
      paragraphs: [],
      points: [
        "AI liệt kê từng token kèm **mạng** và **giá trị USD**. Mỗi mạng là **một túi riêng**.",
        "**Lịch sử** là nhật ký. **Pending** = đang chờ. Chỉ **confirmed** mới là xong.",
        "**Gas** có 3 mức: thấp, vừa, cao. Phí thật chốt lúc xong.",
      ],
      remember: [],
      practiceTitle: "Đọc số dư, lịch sử và gas",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: cho tôi xem số dư token trên BNB Smart Chain kèm giá trị USD, 5 giao dịch đã xác nhận gần nhất kèm thời gian, loại và phí mạng, và giá gas hiện tại ở mức thấp, vừa và cao. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào." }],
      check: "Số dư, tối đa 5 giao dịch và 3 mức gas.",
    },
    {
      title: "Luật của ví",
      goal: "Đọc các hạn mức AI phải theo.",
      paragraphs: [],
      points: [
        "Ví có **hạn mức mỗi ngày**.",
        "**Hạn mức còn lại không phải số dư.** Còn $60 = AI chỉ dùng được $60.",
        "**Chỉ bạn đổi được luật**, trong app.",
      ],
      remember: [],
      practiceTitle: "Đọc luật của bạn",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: đọc cài đặt ví của tôi và trình bày một bảng gồm từng loại hạn mức, hạn mức mỗi ngày, đã dùng hôm nay và còn lại hôm nay. Sau đó cho biết giao dịch bất thường được xử lý thế nào và khi nào phiên đăng nhập hết hạn. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào." }],
      check: "Một bảng các hạn mức. Mở Cài đặt trong app Binance và so số liệu.",
    },
    {
      title: "Approval và khoá ví",
      goal: "Xem ai tiêu được token của bạn, và vì sao ví phải chờ.",
      paragraphs: [],
      points: [
        "**Approval** là tờ giấy cho phép: app lấy được một phần token của bạn tới khi bạn huỷ.",
        "**Không giới hạn** = app lấy được hết token đó. Không rõ ai lấy? **Dừng lại.**",
        "Ví **bị khoá** = giao dịch trước còn pending. Ví chờ tới khi nó xong.",
      ],
      remember: [],
      practiceTitle: "Kiểm tra approval và khoá",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: liệt kê các approval token của tôi kèm token, spender, số lượng và mức rủi ro, và kiểm tra ví có bị khoá trên BNB Smart Chain không, có giao dịch nào pending không. Chỉ đọc dữ liệu. KHÔNG gửi, ký, xác nhận, huỷ approval, tăng tốc hay huỷ giao dịch nào." }],
      check: "Danh sách approval (không có là bình thường) và ví mở khoá, không pending.",
    },
    {
      title: "Báo giá và DeFi, chỉ xem trước",
      goal: "Đọc giá và một kèo DeFi mà không gửi gì.",
      paragraphs: [],
      points: [
        "**Báo giá** là giá ước tính: bạn bỏ vào bao nhiêu, nhận **khoảng** bao nhiêu. **Slippage** là mức lệch bạn chấp nhận.",
        "**Xem trước** cho biết số dư đổi ra sao, phí và hợp đồng. **Không gửi gì.**",
        "**APY cao không phải tiền miễn phí.** TVL lớn không có nghĩa là an toàn.",
      ],
      remember: [],
      practiceTitle: "Đọc báo giá và xem trước",
      riskText: "Giao dịch và DeFi có thể mất tiền. Chỉ báo giá và xem trước, không phải lời khuyên.",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: lấy báo giá swap 0.001 BNB sang USDT trên BNB Smart Chain, rồi liệt kê 3 giao thức DeFi kèm TVL và APY cao nhất. Chỉ báo giá và xem trước. KHÔNG swap, gửi tiền vào, ký hay xác nhận giao dịch nào." }],
      check: "Báo giá BNB sang USDT (slippage auto) và 3 app DeFi. Không gửi gì.",
      ifNot: "Nếu AI định swap thật: bảo nó dừng.",
    },
    {
      title: "Giữ an toàn",
      goal: "Tập kiểm tra trước khi xác nhận.",
      paragraphs: [],
      points: [
        "Trước khi đồng ý, xem **4 điều**: tiền đi đâu, token nào và bao nhiêu, có cấp quyền gì, có cảnh báo gì.",
        "Hợp đồng lạ hoặc approval không giới hạn? **Dừng. Đừng xác nhận.**",
        "**Không bao giờ chia sẻ** cụm từ khôi phục, QR đăng nhập hay mã ghép nối. Kể cả với “hỗ trợ”.",
      ],
      remember: [],
      practiceTitle: "Kiểm tra an toàn",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: kiểm tra an toàn. Ví tôi có đang kết nối không? Có bị khoá không? Có approval nào không giới hạn hoặc rủi ro cao không? Khi nào Developer Mode hết hạn? Trả lời bằng 4 dòng ngắn. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào. Không huỷ hay thay đổi gì cả." }],
      check: "4 dòng ngắn, mỗi câu hỏi một dòng.",
      recordText: "Lần lưu này lưu mọi trang và cấp chứng chỉ.",
    },
  ] as ViDay[],
};

/** Day in the chosen language; prompts always come from the English source. */
export function localDay(d: Day, lang: "en" | "vi"): Day {
  if (lang === "en") return d;
  const v = book001Vi.days[book001.days.findIndex((x) => x.day === d.day)];
  return {
    ...d, title: v.title, goal: v.goal,
    learn: { paragraphs: v.paragraphs, points: d.learn.points?.map((p, i) => ({ ...p, text: v.points?.[i] ?? p.text })), remember: v.remember },
    practice: { ...d.practice, title: v.practiceTitle, riskText: v.riskText, check: v.check, ifNot: v.ifNot, recordText: v.recordText, steps: d.practice.steps.map((s, i) => ({ ...s, ...v.steps[i] })) },
  };
}
