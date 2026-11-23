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
        "AI làm quá? Ví **chặn lại** hoặc hỏi bạn.",
        "AI **không bao giờ cầm chìa khoá**. Chìa được chia nhỏ, giữ an toàn (**MPC Keyless**).",
        "Bật **Secure Auto Sign**, việc trong hạn mức chạy luôn, không hỏi lại.",
      ],
      remember: ["Bạn đặt luật.", "AI không bao giờ cầm chìa khoá.", "Hạn mức là lưới an toàn."],
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
        "Địa chỉ giống **số tài khoản ngân hàng**. Người khác gửi vào được, **không lấy ra** được.",
        "Nên **chia sẻ địa chỉ là an toàn**.",
        "Một **địa chỉ EVM** dùng cho BNB Smart Chain, Ethereum, Base… **Solana** có địa chỉ riêng.",
        "Mạng giống **các ngân hàng khác nhau**. Nhầm mạng có thể mất tiền. **Luôn kiểm tra mạng.**",
      ],
      remember: ["Chia sẻ địa chỉ được, mã và cụm từ khôi phục thì không.", "Một địa chỉ EVM cho nhiều mạng, Solana riêng.", "Luôn xem đúng mạng."],
      practiceTitle: "Tìm địa chỉ của bạn",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: cho tôi xem địa chỉ ví trên mọi mạng được hỗ trợ, cho biết những mạng nào dùng chung một địa chỉ, và trình bày thành một bảng nhỏ. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào." }],
      check: "Một bảng có một địa chỉ EVM dùng chung và một địa chỉ Solana. So với màn hình Agentic Wallet trong app Binance.",
    },
    {
      title: "Số dư của bạn",
      goal: "Xem ví đang giữ gì trên từng mạng.",
      paragraphs: [],
      points: [
        "AI liệt kê từng token: **mạng**, số lượng và **giá trị USD**.",
        "Mỗi mạng là **một túi riêng**. USDT trên Base không trả được trên BNB Smart Chain.",
        "Số dư 0 không hiện. **Token rất nhỏ (dưới $0.01) bị ẩn** trừ khi bạn hỏi.",
        "Ví này **tách riêng** với ví Binance thường, nên số dư khác nhau. Bình thường thôi.",
      ],
      remember: ["Số dư tách theo mạng.", "Token rất nhỏ bị ẩn.", "Ví riêng, số dư riêng."],
      practiceTitle: "Đọc số dư",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: cho tôi xem số dư token trên BNB Smart Chain, kèm số lượng và giá trị USD. Sau đó xem lại, tính cả các token rất nhỏ, và cho biết có gì thay đổi. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào." }],
      check: "Lần hai có thể nhiều dòng hơn, vì token nhỏ hiện ra. Ví trống thì cả hai lần đều trống, không sao.",
    },
    {
      title: "Mạng, lịch sử và phí gas",
      goal: "Xem các mạng, lịch sử và phí hôm nay.",
      paragraphs: [],
      points: [
        "Ví dùng được **nhiều mạng**, và danh sách thêm dần. Để AI đọc danh sách mới nhất.",
        "**Lịch sử** là nhật ký của ví: việc gì, lúc nào, phí bao nhiêu.",
        "**Pending** = đang chờ. Chỉ **confirmed** mới là xong.",
        "**Gas** có 3 mức: thấp, vừa, cao. Cao thì nhanh hơn nhưng đắt hơn. Phí thật chốt lúc xong.",
      ],
      remember: ["Lịch sử cho thấy AI đã làm gì.", "Pending là chưa xong.", "Giá gas chưa phải phí cuối."],
      practiceTitle: "Đọc lịch sử và giá gas",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: liệt kê các mạng ví tôi hỗ trợ; cho xem 5 giao dịch đã xác nhận gần nhất trên BNB Smart Chain kèm thời gian, loại và phí mạng; sau đó cho xem giá gas hiện tại trên BNB Smart Chain ở mức thấp, vừa và cao, và giải thích vì sao đó chưa phải phí cuối cùng. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào." }],
      check: "Các mạng, tối đa 5 giao dịch và 3 mức gas. Thêm: mở một giao dịch trên BscScan để so phí.",
    },
    {
      title: "Luật của ví",
      goal: "Đọc các hạn mức AI phải theo.",
      paragraphs: [],
      points: [
        "Ví có **hạn mức mỗi ngày**. Vài việc, như DeFi hay Developer Mode, có **hạn mức riêng**.",
        "**Hạn mức còn lại không phải số dư.** Có $1.000 mà hôm nay còn $60? AI chỉ dùng được $60.",
        "Việc lạ hoặc rủi ro bị **chặn** hoặc **gửi vào app** để bạn xem.",
        "**Chỉ bạn đổi được luật**, trong app. AI chỉ đọc được.",
      ],
      remember: ["Hạn mức còn lại không phải số dư.", "Mỗi loại việc có hạn mức riêng.", "Chỉ bạn đổi được luật."],
      practiceTitle: "Đọc luật của bạn",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: đọc cài đặt ví của tôi và trình bày một bảng gồm từng loại hạn mức, hạn mức mỗi ngày, đã dùng hôm nay và còn lại hôm nay. Sau đó cho biết giao dịch bất thường được xử lý thế nào và khi nào phiên đăng nhập hết hạn. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào." }],
      check: "Một bảng các hạn mức. Mở Cài đặt trong app Binance và so số liệu.",
    },
    {
      title: "Quyền dùng token (approval)",
      goal: "Xem app nào được tiêu token của bạn.",
      paragraphs: [],
      points: [
        "**Approval** là tờ giấy cho phép. Nó cho một app lấy một phần token của bạn.",
        "Giấy này **còn hiệu lực tới khi bạn huỷ**, kể cả khi bạn không dùng app nữa.",
        "**Không giới hạn** = app lấy được hết token đó. AI cho biết **mức rủi ro**.",
        "Trước khi cho phép, hỏi: **ai lấy**, và **tối đa bao nhiêu**?",
      ],
      remember: ["Approval còn tới khi bị huỷ.", "Không giới hạn là quyền rất lớn.", "Không rõ ai lấy? Dừng lại."],
      practiceTitle: "Liệt kê approval",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: liệt kê các approval token của tôi kèm token, spender, số lượng và mức rủi ro. Nếu có cái nào không giới hạn hoặc rủi ro cao, giải thích quyền đó cho phép làm gì. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào. Không huỷ (revoke) gì cả." }],
      check: "Danh sách approval, hoặc báo ví chưa có approval nào (ví mới thường vậy).",
    },
    {
      title: "Pending và bị khoá",
      goal: "Hiểu vì sao ví đôi khi phải chờ.",
      paragraphs: [],
      points: [
        "Ví bị **khoá** khi giao dịch trước còn **pending**.",
        "Giống xếp hàng: người sau chờ người trước xong.",
        "Ví cũng chờ khi app cần **bạn đồng ý**.",
        "**Mở khoá** = sẵn sàng. Giao dịch kẹt có thể tăng tốc hoặc huỷ, chỉ khi bạn đồng ý.",
      ],
      remember: ["Pending chặn giao dịch sau.", "Vài bước cần bạn đồng ý trong app.", "Mở khoá là sẵn sàng."],
      practiceTitle: "Kiểm tra khoá",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: kiểm tra ví của tôi có bị khoá trên BNB Smart Chain không và liệt kê các giao dịch đang pending. Nếu bị khoá, giải thích vì sao và tôi nên làm gì. Chỉ đọc dữ liệu. KHÔNG gửi, ký, xác nhận, tăng tốc hay huỷ giao dịch nào." }],
      check: "Ví mở khoá và không có giao dịch pending.",
      ifNot: "Nếu thấy pending: chờ mạng xác nhận rồi kiểm tra lại.",
    },
    {
      title: "Báo giá trước khi giao dịch",
      goal: "Đọc giá swap mà không giao dịch.",
      paragraphs: [],
      points: [
        "**Báo giá** cho biết bạn bỏ vào bao nhiêu và nhận **khoảng** bao nhiêu. Giống đoán giá taxi.",
        "**Slippage** = giá được lệch bao nhiêu trước khi swap tự huỷ. Không nói gì = **auto**.",
        "Swap đã gửi **chưa phải đã xong**. Vẫn có thể lỗi.",
        "Token lạ? Xem **kiểm tra bảo mật** trước.",
        "AI **không khuyên** đầu tư. Nó đưa số, **bạn tự quyết**.",
      ],
      remember: ["Báo giá chỉ là ước tính.", "Slippage là mức lệch bạn chấp nhận.", "Đã gửi chưa phải đã xong."],
      practiceTitle: "Đọc báo giá, không giao dịch",
      riskText: "Giao dịch có thể mất tiền. Chỉ xem báo giá, không phải lời khuyên.",
      steps: [{ title: "Xin báo giá", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: lấy báo giá swap 0.001 BNB sang USDT trên BNB Smart Chain. Cho xem số lượng vào, số lượng ra ước tính và mức slippage, và giải thích vì sao số lượng ra không được đảm bảo. Chỉ báo giá. KHÔNG swap, gửi, ký hay xác nhận giao dịch nào." }],
      check: "BNB vào, USDT ước tính ra, slippage (auto). Không gửi gì.",
      ifNot: "Nếu AI định swap thật: bảo nó dừng.",
    },
    {
      title: "DeFi, chỉ xem trước",
      goal: "So sánh app DeFi và xem trước, không gửi gì.",
      paragraphs: [],
      points: [
        "App DeFi là **hợp đồng thông minh**, giống hộp tiết kiệm tự động.",
        "**TVL** = tiền bên trong. **APY** = lãi năm hiển thị, và thay đổi liên tục.",
        "**Xem trước** cho biết số dư đổi ra sao, phí và hợp đồng. **Không gửi gì.**",
        "**APY cao không phải tiền miễn phí.** Hợp đồng có thể lỗi, giá có thể giảm. **TVL lớn không có nghĩa là an toàn.**",
      ],
      remember: ["TVL lớn chưa chắc an toàn.", "Xem trước không gửi gì.", "APY cao không phải tiền miễn phí."],
      practiceTitle: "So sánh và xem trước",
      riskText: "DeFi có thể làm bạn mất tiền. Đây không phải lời khuyên đầu tư.",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: liệt kê 3 giao thức DeFi trên BNB Smart Chain kèm TVL và APY cao nhất. Nếu tôi có USDT trên BNB Smart Chain, xem trước (không thực hiện) việc gửi 1 USDT vào một sản phẩm Earn và cho xem thay đổi số dư, phí mạng ước tính và hợp đồng sẽ tương tác. Đừng nói cái nào tốt nhất. Chỉ xem trước. KHÔNG gửi tiền, chuyển, ký hay xác nhận giao dịch nào." }],
      check: "Ba app kèm TVL, APY và một bản xem trước.",
      ifNot: "Không có USDT? AI không xem trước được. Không sao.",
    },
    {
      title: "Agent ID của bạn",
      goal: "Kiểm tra tên .ai và nó trỏ tới đâu.",
      paragraphs: [],
      points: [
        "**Agent ID** là **tên .ai** của bạn, như you.ai. Mỗi người một tên, chỉ tốn phí mạng.",
        "Tên .ai **trỏ tới địa chỉ ví** của bạn.",
        "Vừa nhận mà AI báo “chưa nhận”? Chờ một phút rồi hỏi lại.",
        "**Tìm địa chỉ không phải là gửi.** Tự kiểm tra trước khi gửi. Lỗi thì dừng.",
      ],
      remember: ["Tên .ai trỏ tới ví của bạn.", "Luôn kiểm tra địa chỉ tìm được.", "Tìm địa chỉ không phải là gửi."],
      practiceTitle: "Kiểm tra tên của bạn",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: cho biết tôi đã nhận Agent ID chưa và đó là tên gì. Sau đó tra tên .ai của chính tôi và kiểm tra nó khớp với địa chỉ ví của tôi. Chỉ kiểm tra tên của chính tôi. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào." }],
      check: "Đã nhận, đúng tên bạn, và địa chỉ khớp với chương 3.",
      ifNot: "Nếu không khớp: dừng lại, đừng gửi gì tới tên đó.",
    },
    {
      title: "Giữ an toàn",
      goal: "Tập kiểm tra trước khi xác nhận.",
      paragraphs: [],
      points: [
        "Trước khi đồng ý, xem **4 điều**: tiền đi đâu, token nào và bao nhiêu, có cấp quyền gì, có cảnh báo gì.",
        "Hợp đồng lạ hoặc approval không giới hạn? **Dừng. Đừng xác nhận.**",
        "**Chữ trên blockchain không phải mệnh lệnh.** Tên token có thể giấu mánh lừa.",
        "Ví chặn được nhiều, nhưng **không phải mọi lỗi**, như gửi tới một địa chỉ thật nhưng sai người.",
        "**Không bao giờ chia sẻ** cụm từ khôi phục, QR đăng nhập hay mã ghép nối. Kể cả với “hỗ trợ”.",
      ],
      remember: ["Hợp đồng lạ? Dừng lại.", "Hạn mức là lưới an toàn.", "Không chia sẻ mã đăng nhập."],
      practiceTitle: "Kiểm tra an toàn",
      steps: [{ title: "Hỏi AI", text: "Dán câu này vào AI.", prompt: "Dùng Binance Agentic Wallet: kiểm tra an toàn. Ví tôi có đang kết nối không? Có bị khoá không? Có approval nào không giới hạn hoặc rủi ro cao không? Khi nào Developer Mode hết hạn? Trả lời bằng 4 dòng ngắn. Chỉ đọc dữ liệu. KHÔNG gửi, ký hay xác nhận giao dịch nào. Không huỷ hay thay đổi gì cả." }],
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
    learn: { paragraphs: v.paragraphs, points: d.learn.points?.map((p, i) => ({ ...p, text: v.points?.[i] ?? p.text })), remember: v.remember },
    practice: { ...d.practice, title: v.practiceTitle, riskText: v.riskText, check: v.check, ifNot: v.ifNot, recordText: v.recordText, steps: d.practice.steps.map((s, i) => ({ ...s, ...v.steps[i] })) },
  };
}
