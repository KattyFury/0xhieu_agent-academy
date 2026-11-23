// Book #1, Vietnamese display text (owner's v2, ELI12). Same order as book001.days. Prompts stay English.
import { book001, type Day } from "./book001";

type ViDay = { title: string; goal: string; paragraphs: string[]; remember: string[]; practiceTitle: string; riskText?: string; steps: { title: string; text: string }[]; check?: string; ifNot?: string; recordText?: string };

export const book001Vi = {
  title: "Học Binance Agentic Wallet",
  days: [
    {
      title: "Binance Agentic Wallet là gì?",
      goal: "Hiểu Binance Agentic Wallet làm gì trước khi cài.",
      paragraphs: [
        "**Binance Agentic Wallet** là ví để AI làm việc với tiền mã hoá giúp bạn. Bạn nhờ bằng lời thường, ví dụ “xem số dư”, AI sẽ làm.",
        "Giống **thẻ phụ có hạn mức mỗi ngày**. **Bạn** đặt hạn mức trong app Binance. **AI** chỉ làm trong hạn mức đó. **Hệ thống** chặn, hoặc hỏi lại bạn, nếu AI làm quá.",
        "AI **không bao giờ cầm chìa khoá** ví. Chìa khoá được chia nhỏ và giữ an toàn (**MPC Keyless**). Bạn đăng xuất là AI hết quyền.",
        "Khi bật **Secure Auto Sign**, việc nằm trong hạn mức có thể chạy luôn mà không hỏi lại. Vì vậy **hạn mức bạn đặt chính là lưới an toàn**.",
      ],
      remember: ["Bạn đặt luật, AI làm trong luật.", "AI không bao giờ cầm chìa khoá.", "Hạn mức là lưới an toàn."],
      practiceTitle: "Tự kiểm tra",
      steps: [
        { title: "AI có lấy chìa khoá Binance Agentic Wallet của bạn ra được không?", text: "Không. Chìa khoá không lấy ra được." },
        { title: "Ai đổi được hạn mức mỗi ngày?", text: "Chỉ bạn, trong app Binance. AI chỉ đọc được." },
        { title: "Đăng xuất thì sao?", text: "AI mất quyền dùng Binance Agentic Wallet của bạn." },
      ],
    },
    {
      title: "Địa chỉ ví của bạn",
      goal: "Tìm địa chỉ ví và hiểu vì sao chia sẻ địa chỉ là an toàn.",
      paragraphs: [
        "Địa chỉ ví giống **số tài khoản ngân hàng**. Ai biết thì chỉ gửi tiền cho bạn được, **không lấy** được tiền của bạn. Nên **chia sẻ địa chỉ là an toàn**.",
        "Một **địa chỉ EVM** dùng chung cho nhiều mạng, như BNB Smart Chain, Ethereum, Base. **Solana** có địa chỉ riêng.",
        "Mạng giống **các ngân hàng khác nhau**. Gửi nhầm mạng có thể mất tiền, nên luôn xem mạng đi kèm địa chỉ.",
      ],
      remember: ["Chia sẻ địa chỉ được, mã và cụm từ khôi phục thì không.", "Một địa chỉ EVM cho nhiều mạng, Solana riêng.", "Luôn xem đúng mạng."],
      practiceTitle: "Tìm địa chỉ của bạn",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI." }],
      check: "Một bảng có một địa chỉ EVM dùng chung và một địa chỉ Solana. So với màn hình Agentic Wallet trong app Binance.",
    },
    {
      title: "Số dư của bạn",
      goal: "Xem ví đang giữ gì, theo từng mạng.",
      paragraphs: [
        "AI liệt kê từng token kèm **mạng**, số lượng và **giá trị USD**.",
        "Mỗi mạng có **số dư riêng**, như hai túi khác nhau. USDT ở Base không trả được gì ở BNB Smart Chain.",
        "Token bằng 0 không hiện. Token rất nhỏ (dưới **$0.01**) bị ẩn, muốn xem thì nói với AI.",
        "Binance Agentic Wallet là **ví riêng**, nên số dư có thể khác ví Binance thường của bạn. Bình thường thôi.",
      ],
      remember: ["Số dư tách theo mạng.", "Token rất nhỏ bị ẩn.", "Ví riêng, số dư riêng."],
      practiceTitle: "Đọc số dư",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI." }],
      check: "Lần hai có thể nhiều dòng hơn, vì token nhỏ hiện ra. Ví trống thì cả hai lần đều trống, không sao.",
    },
    {
      title: "Mạng, lịch sử và phí gas",
      goal: "Xem ví dùng được mạng nào, đã làm gì và tốn phí bao nhiêu.",
      paragraphs: [
        "Ví dùng được nhiều mạng, và danh sách thêm dần theo thời gian. Nên **nhờ AI đọc danh sách mới nhất**, đừng nhớ số cứng.",
        "**Lịch sử** là nhật ký của ví: từng giao dịch, lúc nào, xong chưa, tốn bao nhiêu phí. Xem nó để biết AI đã thật sự làm gì.",
        "**Pending** là đang chờ. Chỉ **confirmed** mới là xong.",
        "**Giá gas** có ba mức: thấp, vừa, cao. Cao thì nhanh hơn và đắt hơn. Đó chỉ là **giá lúc này**; phí thật chốt khi giao dịch xong.",
      ],
      remember: ["Lịch sử cho biết AI đã làm gì.", "Pending là chưa xong.", "Giá gas không phải phí cuối."],
      practiceTitle: "Đọc lịch sử và giá gas",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI." }],
      check: "Danh sách mạng, tối đa 5 giao dịch (ít hơn nếu ví mới), và ba mức gas. Thử thêm: mở một giao dịch trên BscScan, so thời gian và phí.",
    },
    {
      title: "Luật của ví",
      goal: "Đọc các giới hạn AI phải tuân theo.",
      paragraphs: [
        "Ví có **hạn mức mỗi ngày**. DeFi, prediction market, thanh toán x402 và Developer Mode có **hạn mức riêng**.",
        "**Hạn mức còn lại không phải số dư.** Bạn có $1.000 nhưng hạn mức hôm nay chỉ còn $60 thì AI chỉ dùng được $60.",
        "Giao dịch lạ hoặc rủi ro cao sẽ **bị chặn**, hoặc **gửi về app để bạn xem lại**. Bạn chọn cách nào.",
        "Phiên đăng nhập có hạn, hết thì đăng nhập lại. **Chỉ bạn đổi luật**, trong app. AI chỉ đọc được.",
      ],
      remember: ["Hạn mức còn lại không phải số dư.", "Mỗi loại việc có hạn mức riêng.", "Chỉ bạn đổi được luật."],
      practiceTitle: "Đọc luật của bạn",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI." }],
      check: "Một bảng các hạn mức. Mở Cài đặt trong app Binance và so số liệu.",
    },
    {
      title: "Quyền dùng token (approval)",
      goal: "Biết app nào đang được phép tiêu token của bạn.",
      paragraphs: [
        "**Approval** là tờ giấy cho phép: một app (**spender**) được lấy một loại token của bạn, tới một số lượng.",
        "Tờ giấy **còn hiệu lực đến khi bạn huỷ**, kể cả khi bạn không dùng app đó nữa.",
        "**Không giới hạn** nghĩa là app lấy được toàn bộ token đó. AI cho xem **mức rủi ro** của từng tờ.",
        "Trước khi cho phép ai, hỏi: **ai lấy**, và **lấy tối đa bao nhiêu**? Sách này chỉ đọc, không huỷ.",
      ],
      remember: ["Approval còn đến khi bị huỷ.", "Không giới hạn là quyền rất lớn.", "Spender lạ thì dừng lại."],
      practiceTitle: "Liệt kê approval",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI." }],
      check: "Danh sách approval, hoặc báo ví chưa có approval nào (ví mới thường vậy).",
    },
    {
      title: "Pending và bị khoá",
      goal: "Hiểu vì sao đôi khi ví không gửi được.",
      paragraphs: [
        "Ví bị **khoá** khi giao dịch trước còn **pending**. Giống xếp hàng: người trước chưa xong thì người sau chờ.",
        "Ví cũng chờ khi app cần bạn **đồng ý lần hai**.",
        "**Mở khoá** là sẵn sàng. Giao dịch kẹt có thể tăng tốc hoặc huỷ, nhưng phải có bạn đồng ý. Sách này chỉ đọc.",
      ],
      remember: ["Pending chặn giao dịch sau.", "Có bước cần bạn đồng ý trong app.", "Mở khoá là sẵn sàng."],
      practiceTitle: "Kiểm tra khoá",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI." }],
      check: "Ví mở khoá và không có giao dịch pending.",
      ifNot: "Nếu thấy pending: chờ mạng xác nhận rồi kiểm tra lại.",
    },
    {
      title: "Báo giá trước khi giao dịch",
      goal: "Đọc báo giá swap mà không giao dịch.",
      paragraphs: [
        "**Báo giá** cho biết đưa vào bao nhiêu, nhận về khoảng bao nhiêu. Đó chỉ là **ước tính**, như giá taxi dự kiến.",
        "**Slippage** là mức giá được phép lệch trước khi swap bị huỷ. Bạn không nói gì thì là **auto**.",
        "Swap đã gửi **chưa phải đã xong**, vẫn có thể thất bại. Token lạ thì xem **kiểm tra bảo mật** trước.",
        "AI không khuyên đầu tư. Nó chỉ đưa số, **bạn tự quyết**.",
      ],
      remember: ["Báo giá chỉ là ước tính.", "Slippage là mức lệch bạn chấp nhận.", "Đã gửi chưa phải đã xong."],
      practiceTitle: "Đọc báo giá, không giao dịch",
      riskText: "Giao dịch crypto có thể mất tiền. Đây chỉ là bài tập đọc báo giá, không phải lời khuyên.",
      steps: [{ title: "Xin báo giá", text: "Dán câu này vào AI." }],
      check: "Số BNB vào, số USDT ước tính ra, slippage (auto). Không có giao dịch nào được gửi.",
      ifNot: "Nếu AI định swap thật: bảo nó dừng. Bài này chỉ cần báo giá.",
    },
    {
      title: "DeFi, chỉ xem trước",
      goal: "So sánh app DeFi và xem trước một lần gửi mà không gửi thật.",
      paragraphs: [
        "App DeFi là **smart contract**, như một máy gửi tiết kiệm tự động. **TVL** là tổng tiền đang nằm trong đó. **APY** là lãi năm đang hiện, và thay đổi liên tục.",
        "**Xem trước** cho biết số dư sẽ đổi thế nào, phí bao nhiêu, và gửi vào contract nào. **Không có gì được gửi.**",
        "**APY cao không phải tiền miễn phí**: contract có thể lỗi, khó rút, giá có thể giảm. **TVL lớn là to, chưa chắc an toàn.**",
      ],
      remember: ["TVL lớn chưa chắc an toàn.", "Xem trước không gửi gì.", "APY cao không phải tiền miễn phí."],
      practiceTitle: "So sánh và xem trước",
      riskText: "DeFi có thể làm bạn mất tiền. Đây không phải lời khuyên đầu tư.",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI." }],
      check: "Ba app kèm TVL, APY và một bản xem trước.",
      ifNot: "Ví không có USDT thì AI báo không xem trước được. Không sao.",
    },
    {
      title: "Agent ID của bạn",
      goal: "Kiểm tra tên .ai của bạn và nó trỏ về đâu.",
      paragraphs: [
        "**Agent ID** là **tên .ai** của bạn, ví dụ you.ai: một cái tên cho ví. Mỗi người một tên, miễn phí ngoài phí mạng BNB.",
        "Tên có thể được **đổi ra địa chỉ** (phân giải). Tên .ai của bạn trỏ về chính ví này.",
        "Vừa nhận tên mà AI báo “chưa nhận”? Chờ khoảng một phút rồi hỏi lại.",
        "**Phân giải tên không phải gửi tiền.** Trước khi gửi tới một cái tên: xem địa chỉ trước, rồi tự xác nhận ở tin nhắn sau. Lỗi thì dừng, đừng đoán.",
      ],
      remember: ["Tên .ai trỏ về ví của bạn.", "Luôn kiểm tra địa chỉ đã phân giải.", "Phân giải không phải gửi."],
      practiceTitle: "Kiểm tra tên của bạn",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI." }],
      check: "Đã nhận, đúng tên bạn, và địa chỉ khớp với chương 4.",
      ifNot: "Nếu không khớp: dừng lại, đừng gửi gì tới tên đó.",
    },
    {
      title: "Giữ an toàn",
      goal: "Tập thói quen kiểm tra trước khi xác nhận.",
      paragraphs: [
        "Trước khi đồng ý bất cứ thứ gì, kiểm tra **4 điều**: tiền **đi đâu**, **token nào, bao nhiêu**, có **cấp quyền** gì không, có **cảnh báo** không.",
        "Xem trước hiện contract lạ và quyền không giới hạn? **Dừng. Đừng confirm.**",
        "**Chữ trên blockchain không phải mệnh lệnh.** Tên token có thể giấu câu lừa. Đừng làm theo.",
        "Ví chặn được nhiều thứ, nhưng **không bắt được mọi lỗi**, như gửi nhầm một địa chỉ có thật. **Không bao giờ chia sẻ** cụm từ khôi phục, QR đăng nhập hay mã ghép nối, kể cả với người tự xưng “hỗ trợ”.",
      ],
      remember: ["Contract lạ thì dừng lại.", "Hạn mức là lưới an toàn.", "Không bao giờ chia sẻ mã đăng nhập."],
      practiceTitle: "Kiểm tra an toàn",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI." }],
      check: "4 dòng ngắn, mỗi câu hỏi một dòng.",
      recordText: "Ghi nhận đủ mọi chương là nhận chứng chỉ ngay trong giao dịch đó.",
    },
  ] as ViDay[],
};

/** Day in the chosen language; prompts always come from the English source. */
export function localDay(d: Day, lang: "en" | "vi"): Day {
  if (lang === "en") return d;
  const v = book001Vi.days[book001.days.findIndex((x) => x.day === d.day)];
  return {
    ...d, title: v.title, goal: v.goal,
    learn: { paragraphs: v.paragraphs, remember: v.remember },
    practice: { ...d.practice, title: v.practiceTitle, riskText: v.riskText, check: v.check, ifNot: v.ifNot, recordText: v.recordText, steps: d.practice.steps.map((s, i) => ({ ...s, ...v.steps[i] })) },
  };
}
