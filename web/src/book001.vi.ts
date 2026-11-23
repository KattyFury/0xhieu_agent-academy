// Book 1, Vietnamese display text. Prompts stay English (the agent runs them; verified in English).
import type { Day } from "./book001";

type ViDay = { title: string; goal: string; paragraphs: string[]; flow: string[]; remember: string[]; practiceTitle: string; steps: { title: string; text: string }[]; recordText?: string };

export const book001Vi = {
  title: "Học Binance Agentic Wallet",
  days: [
    {
      title: "Ví và các địa chỉ của bạn",
      goal: "Kiểm tra agent đã kết nối chưa và tìm địa chỉ ví của bạn.",
      paragraphs: [
        "Agent nói chuyện với ví qua một công cụ tên **baw**. Việc đầu tiên nó làm được là xem **trạng thái**: đã kết nối hay chưa.",
        "Một **địa chỉ EVM** dùng chung cho BNB Smart Chain, Ethereum, Base, Arbitrum, Polygon và Robinhood Chain. **Solana** có địa chỉ riêng.",
        "Địa chỉ ví là công khai, giống số tài khoản ngân hàng, **chia sẻ được an toàn**. Cụm từ khôi phục và mã đăng nhập thì không.",
      ],
      flow: ["Xem trạng thái", "Đọc địa chỉ", "So các mạng"],
      remember: ["Một địa chỉ EVM, thêm một cho Solana.", "Địa chỉ ví chia sẻ được.", "Mã và cụm từ khôi phục thì không bao giờ."],
      practiceTitle: "Tìm địa chỉ của bạn",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này vào agent, rồi so với app Binance." }],
    },
    {
      title: "Số dư của bạn",
      goal: "Đọc ví đang giữ gì, theo từng mạng.",
      paragraphs: [
        "Agent liệt kê từng token kèm **mạng**, số lượng, giá và **giá trị USD**. Mỗi mạng giữ **số dư riêng**.",
        "Token có số dư bằng 0 không bao giờ hiện. Token dưới **$0.01**, hoặc chưa có giá, bị ẩn trừ khi bạn hỏi.",
        "USDT trên Base không trả được gì trên BNB Smart Chain. Vì vậy luôn **kiểm tra mạng** trước khi làm.",
      ],
      flow: ["Chọn mạng", "Đọc số dư", "Xem giá trị USD"],
      remember: ["Số dư tách theo mạng.", "Token rất nhỏ bị ẩn mặc định.", "Đúng mạng trước, rồi mới làm."],
      practiceTitle: "Đọc số dư",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này. Nó chỉ đọc." }],
    },
    {
      title: "Các mạng và lịch sử",
      goal: "Xem ví dùng những mạng nào và đã làm gì trước đây.",
      paragraphs: [
        "Ví hiện hỗ trợ **7 mạng**: BNB Smart Chain, Ethereum, Base, Arbitrum, Polygon, Robinhood Chain và Solana. Agent liệt kê được.",
        "**Lịch sử** cho thấy từng giao dịch kèm mạng, thời gian, trạng thái và **phí mạng**. Mặc định là 3 tháng gần nhất.",
        "Giao dịch **pending** đến khi mạng xác nhận, rồi thành **confirmed**. Lịch sử là cách kiểm tra agent đã thật sự làm gì.",
      ],
      flow: ["Liệt kê mạng", "Đọc lịch sử", "Xem phí"],
      remember: ["Lịch sử cho thấy agent đã làm gì.", "Pending là chưa xong.", "Mỗi giao dịch đều trả phí mạng."],
      practiceTitle: "Xem lịch sử",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này, rồi mở một giao dịch trên BscScan." }],
    },
    {
      title: "Gas, phí mạng",
      goal: "Hiểu gas trước khi agent gửi bất cứ thứ gì.",
      paragraphs: [
        "**Gas** là phí mạng thu để xử lý giao dịch. Trên BNB Smart Chain, gas trả bằng **BNB**.",
        "Agent cho xem ba mức: **thấp, vừa, cao**. Càng cao càng nhanh và càng đắt. Mặc định là mức vừa. Ví dụ ngày 23/11: khoảng 0.09, 0.11 và 0.31 gwei.",
        "Giá gas là **ảnh chụp tại thời điểm**, không phải phí cuối. Phí thật được chốt khi giao dịch được tạo và xác nhận.",
      ],
      flow: ["Đọc các mức", "So thời gian chờ", "Giá sẽ đổi"],
      remember: ["Trên BNB Smart Chain, gas trả bằng BNB.", "Mức vừa là mặc định.", "Giá gas không phải phí cuối."],
      practiceTitle: "Đọc giá gas",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này. Nó chỉ đọc." }],
    },
    {
      title: "Quy tắc của ví",
      goal: "Đọc các giới hạn và quy tắc an toàn agent phải tuân theo.",
      paragraphs: [
        "Ví có **hạn mức ngày**, cộng hạn mức riêng cho DeFi, prediction market, thanh toán x402 và Developer Mode. **Hạn mức còn lại không phải số dư.**",
        "**Giao dịch bất thường** (rủi ro cao, hoặc price impact bất thường) bị tự từ chối hoặc gửi về app Binance để bạn đồng ý lần hai.",
        "Phiên đăng nhập hết sau một thời gian hoặc khi lâu không dùng. Agent **đọc** quy tắc; **chỉ bạn đổi được**, trong app.",
      ],
      flow: ["Bạn đặt quy tắc", "Agent đọc", "Agent làm trong giới hạn"],
      remember: ["Hạn mức còn lại không phải số dư.", "Mỗi loại có hạn mức riêng.", "Chỉ bạn đổi được quy tắc."],
      practiceTitle: "Đọc quy tắc của bạn",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này, rồi mở Cài đặt trong app Binance để so." }],
    },
    {
      title: "Quyền dùng token",
      goal: "Biết app nào được phép tiêu token của bạn.",
      paragraphs: [
        "Một **approval** cho phép một app (**spender**) chuyển một loại token của bạn, tối đa một số lượng. Nó còn hiệu lực đến khi bị thu hồi.",
        "Approval **không giới hạn** cho spender chuyển toàn bộ token đó. Agent cho xem **mức rủi ro** của từng approval, ví dụ khi contract của spender chưa được xác minh.",
        "Sách này chỉ **đọc** approval. Trước khi đồng ý cấp quyền, hãy xem spender là ai và được lấy bao nhiêu.",
      ],
      flow: ["Liệt kê approval", "Xem spender", "Xem số lượng và rủi ro"],
      remember: ["Approval còn đến khi bị thu hồi.", "Không giới hạn là quyền rất lớn.", "Spender lạ? Dừng lại."],
      practiceTitle: "Liệt kê approval",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này. Nó không thay đổi gì." }],
    },
    {
      title: "Pending và bị khoá",
      goal: "Hiểu vì sao đôi khi ví không gửi được.",
      paragraphs: [
        "Ví bị **khoá** giao dịch mới trên một mạng khi giao dịch trước đó vẫn đang **pending** ở mạng đó.",
        "Ví cũng bị khoá khi bước kiểm tra rủi ro cần bạn **xác nhận lần hai** trong app Binance. Yêu cầu đó chờ khoảng 5 phút.",
        "Khi **mở khoá**, agent làm việc bình thường. Agent có thể kiểm tra điều này trước khi bắt đầu.",
      ],
      flow: ["Kiểm tra khoá", "Tìm lý do", "Chờ hoặc xác nhận trong app"],
      remember: ["Pending khoá giao dịch mới.", "Có bước cần bạn đồng ý trong app.", "Mở khoá là sẵn sàng."],
      practiceTitle: "Kiểm tra khoá",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này. Nó chỉ đọc." }],
    },
    {
      title: "Báo giá trước khi giao dịch",
      goal: "Đọc báo giá swap mà không giao dịch.",
      paragraphs: [
        "**Báo giá** cho thấy bạn đưa vào bao nhiêu và nhận về khoảng bao nhiêu. Đó là **ước tính**, không phải lời hứa. Ví dụ ngày 23/11: 0.001 BNB được khoảng 0.56 USDT.",
        "**Slippage** là mức giá tối đa được lệch bất lợi trước khi swap thất bại. Mặc định là auto.",
        "Swap đã gửi **chưa phải đã xong**: nó vẫn có thể thất bại on-chain. Chỉ giao dịch đã xác nhận mới tính.",
      ],
      flow: ["Lấy báo giá", "Đọc số lượng", "Xem slippage", "Quyết định"],
      remember: ["Báo giá chỉ là ước tính.", "Slippage là mức lệch bạn chấp nhận.", "Đã gửi chưa phải đã khớp."],
      practiceTitle: "Đọc báo giá, không giao dịch",
      steps: [{ title: "Xin báo giá", text: "Dán đoạn này. Nó chỉ hỏi giá." }],
    },
    {
      title: "DeFi, chỉ xem trước",
      goal: "So sánh app DeFi và xem trước một lần gửi mà không gửi thật.",
      paragraphs: [
        "App DeFi là các smart contract. **TVL** là tiền bên trong; **APY** là lợi suất năm hiển thị (với một app, là pool tốt nhất). Nó đổi liên tục.",
        "**Xem trước** cho biết số dư thay đổi, phí mạng ước tính và contract của một lần gửi. **Không gửi gì cả.**",
        "**APY cao không phải tiền miễn phí.** Rủi ro: lỗi contract, khó rút, giá giảm, lợi suất dừng.",
      ],
      flow: ["Liệt kê app", "Đọc TVL và APY", "Xem trước", "Bạn quyết định"],
      remember: ["TVL cho thấy quy mô, không phải độ an toàn.", "Xem trước không gửi gì.", "APY cao không phải tiền miễn phí."],
      practiceTitle: "So sánh và xem trước",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này. Nó chỉ tra cứu và xem trước." }],
    },
    {
      title: "Agent ID của bạn",
      goal: "Kiểm tra tên .ai của bạn và nó trỏ về đâu.",
      paragraphs: [
        "**Agent ID** là một **tên .ai**, ví dụ you.ai, nhận trong app Binance. Mỗi người một tên, miễn phí ngoài phí mạng BNB.",
        "Một cái tên được **phân giải** ra địa chỉ. Tên .ai của bạn trỏ về chính ví của bạn. Kết quả cũng cho biết đó là ví thường hay contract.",
        "Chỉ người có Agent ID mới ghi nhận được trang trong sách này. **Luôn kiểm tra địa chỉ đã phân giải** trước khi gửi gì tới một cái tên.",
      ],
      flow: ["Xem Agent ID", "Phân giải tên", "Khớp địa chỉ"],
      remember: ["Tên .ai trỏ về ví của bạn.", "Luôn kiểm tra địa chỉ phân giải.", "Phân giải không phải gửi tiền."],
      practiceTitle: "Kiểm tra tên của bạn",
      steps: [{ title: "Hỏi agent", text: "Dán đoạn này. Nó chỉ kiểm tra tên của chính bạn." }],
    },
    {
      title: "Giữ an toàn",
      goal: "Kiểm tra bốn điều trước mỗi lần xác nhận.",
      paragraphs: [
        "Trước mỗi lần đồng ý, **kiểm tra 4 điều**: tiền đi đâu, token nào và bao nhiêu, có cấp quyền gì không, và phần xem trước có cảnh báo không.",
        "Tình huống: xem trước hiện contract lạ và quyền không giới hạn. **Dừng lại. Đừng confirm** khi chưa rõ contract đó.",
        "Ví từ chối hoặc kiểm tra lại giao dịch rủi ro cao, nhưng **không bắt được lỗi trông bình thường**. **Không chia sẻ** cụm từ khôi phục, QR hay mã ghép nối.",
      ],
      flow: ["Nơi nhận", "Số lượng", "Quyền cấp", "Cảnh báo"],
      remember: ["Contract lạ? Dừng lại.", "Hạn mức là lưới an toàn.", "Không bao giờ chia sẻ mã đăng nhập."],
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
    ...d, title: v.title, goal: v.goal,
    learn: { paragraphs: v.paragraphs, flow: v.flow, remember: v.remember },
    practice: { ...d.practice, title: v.practiceTitle, recordText: v.recordText, steps: d.practice.steps.map((s, i) => ({ ...s, ...v.steps[i] })) },
  };
}
